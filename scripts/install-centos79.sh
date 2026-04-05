#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Please run as root (sudo -i)." >&2
  exit 1
fi

cmd_exists() {
  command -v "$1" >/dev/null 2>&1
}

detect_pkg_manager() {
  if cmd_exists yum; then
    echo "yum"
    return
  fi
  if cmd_exists dnf; then
    echo "dnf"
    return
  fi
  if cmd_exists apt-get; then
    echo "apt"
    return
  fi
  echo ""
}

port_in_use() {
  local port="$1"
  if cmd_exists ss; then
    ss -lnt 2>/dev/null | awk '{print $4}' | grep -E "(:|\\.)${port}\$" -q
    return
  fi
  if cmd_exists netstat; then
    netstat -lnt 2>/dev/null | awk '{print $4}' | grep -E "(:|\\.)${port}\$" -q
    return
  fi
  return 1
}

is_local_host() {
  local host="$1"
  [[ "${host}" == "127.0.0.1" || "${host}" == "localhost" || "${host}" == "::1" ]]
}

prompt() {
  local var_name="$1"
  local label="$2"
  local default_value="$3"
  local secret="${4:-0}"
  local input

  if [[ "${secret}" == "1" ]]; then
    read -r -s -p "${label} [default: ${default_value}]: " input
    echo
  else
    read -r -p "${label} [default: ${default_value}]: " input
  fi

  if [[ -z "${input}" ]]; then
    input="${default_value}"
  fi
  printf -v "${var_name}" '%s' "${input}"
}

confirm() {
  local label="$1"
  local default_yes="${2:-1}"
  local input
  local hint
  if [[ "${default_yes}" == "1" ]]; then
    hint="Y/n"
  else
    hint="y/N"
  fi
  read -r -p "${label} (${hint}): " input
  input="$(echo "${input}" | tr '[:upper:]' '[:lower:]')"
  if [[ -z "${input}" ]]; then
    [[ "${default_yes}" == "1" ]]
    return
  fi
  [[ "${input}" == "y" || "${input}" == "yes" ]]
}

echo "== Oversea MVP Installer (CentOS 7.9, no Docker) =="
echo

PKG_MANAGER="$(detect_pkg_manager)"
if [[ -z "${PKG_MANAGER}" ]]; then
  echo "No supported package manager found (yum/dnf/apt-get)." >&2
  exit 1
fi

if [[ -f /etc/os-release ]]; then
  echo "OS detected:"
  cat /etc/os-release | sed -n '1,6p'
  echo
fi

SKIP_MYSQL_INSTALL=1
SKIP_NGINX_INSTALL=1

prompt INSTALL_ROOT "Base install directory" "/opt/oversea"
prompt APP_USER "Linux user to run services" "oversea"
prompt APP_GROUP "Linux group to run services" "oversea"
prompt PROJECT_DIR "Project source directory (contains apps/web, apps/api, apps/cms)" "${INSTALL_ROOT}/app"
prompt DOMAIN "Domain name (optional, for Nginx server_name)" "example.com"

prompt MYSQL_HOST "MySQL host" "127.0.0.1"
prompt MYSQL_PORT "MySQL port" "3306"
prompt MYSQL_ROOT_PASSWORD "MySQL root password (set/ensure)" "root" 1
prompt MYSQL_APP_USER "MySQL app user" "oversea"
prompt MYSQL_APP_PASSWORD "MySQL app user password" "oversea" 1
prompt MYSQL_CMS_DB "CMS database name" "oversea_cms"
prompt MYSQL_API_DB "API database name" "oversea_api"

prompt WEB_PORT "Public Web port (Next.js)" "3000"
prompt API_PORT "Business API port (NestJS)" "3001"
prompt CMS_PORT "CMS port (Strapi)" "1337"

echo
echo "Pre-check ports:"
for p in "${MYSQL_PORT}" "${WEB_PORT}" "${API_PORT}" "${CMS_PORT}" "80"; do
  if port_in_use "${p}"; then
    echo "- Port ${p}: IN USE"
  else
    echo "- Port ${p}: free"
  fi
done

echo
echo "Install plan:"
echo "- INSTALL_ROOT=${INSTALL_ROOT}"
echo "- PROJECT_DIR=${PROJECT_DIR}"
echo "- APP_USER=${APP_USER}:${APP_GROUP}"
echo "- DOMAIN=${DOMAIN}"
echo "- MySQL: ${MYSQL_HOST}:${MYSQL_PORT}, dbs=${MYSQL_CMS_DB},${MYSQL_API_DB}"
echo "- Ports: web=${WEB_PORT}, api=${API_PORT}, cms=${CMS_PORT}"
echo

if ! confirm "Continue with installation?" 1; then
  echo "Cancelled."
  exit 0
fi

mkdir -p "${INSTALL_ROOT}"
mkdir -p "${INSTALL_ROOT}/logs"

echo
echo "== Step 1: System packages =="
if [[ "${PKG_MANAGER}" == "yum" || "${PKG_MANAGER}" == "dnf" ]]; then
  ${PKG_MANAGER} -y install epel-release || true
  ${PKG_MANAGER} -y install curl ca-certificates git unzip tar which vim \
    gcc-c++ make python3 || true
else
  apt-get update -y || true
  apt-get install -y curl ca-certificates git unzip tar vim \
    build-essential python3 || true
fi

echo
echo "== Step 2: Create service user/group =="
if ! getent group "${APP_GROUP}" >/dev/null 2>&1; then
  groupadd --system "${APP_GROUP}"
fi
if ! id -u "${APP_USER}" >/dev/null 2>&1; then
  useradd --system --gid "${APP_GROUP}" --home-dir "${INSTALL_ROOT}" --shell /sbin/nologin "${APP_USER}"
fi
chown -R "${APP_USER}:${APP_GROUP}" "${INSTALL_ROOT}"

echo
echo "== Step 3: Install Node.js (CentOS 7.9 note) =="
echo "CentOS 7 has old glibc. New Node LTS may not be available. Defaulting to Node.js 16.x (EOL) for compatibility."
echo "If you can upgrade OS (recommended), use Node 20+."
if cmd_exists node; then
  echo "Node.js already installed: $(node -v)"
else
  if confirm "Install Node.js 16.x from NodeSource?" 1; then
    if [[ "${PKG_MANAGER}" == "yum" || "${PKG_MANAGER}" == "dnf" ]]; then
      curl -fsSL https://rpm.nodesource.com/setup_16.x | bash -
      ${PKG_MANAGER} -y install nodejs
    else
      curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
      apt-get install -y nodejs
    fi
  fi
fi

echo
echo "== Step 4: Install MySQL 8 (local service) =="
MYSQL_EXISTS=0
MYSQL_RUNNING=0
if cmd_exists mysqld || rpm -qa | grep -q mysql-community-server; then
  MYSQL_EXISTS=1
fi
if port_in_use "${MYSQL_PORT}"; then
  MYSQL_RUNNING=1
fi
if cmd_exists systemctl; then
  if systemctl is-active mysqld >/dev/null 2>&1; then
    MYSQL_RUNNING=1
  fi
fi
if pgrep -x mysqld >/dev/null 2>&1; then
  MYSQL_RUNNING=1
fi

if ! is_local_host "${MYSQL_HOST}"; then
  echo "MYSQL_HOST is not local (${MYSQL_HOST}). Skipping local MySQL installation."
else
  if [[ "${MYSQL_RUNNING}" == "1" ]]; then
    echo "MySQL appears to be running on port ${MYSQL_PORT}. Skipping MySQL installation."
  else
    echo "MySQL is not running on ${MYSQL_HOST}:${MYSQL_PORT}. Skipping MySQL installation (by request)."
  fi
fi

if confirm "Ensure MySQL databases/users exist (requires root password)?" 1; then
  if cmd_exists mysql; then
    set +e
    mysql -h"${MYSQL_HOST}" -P"${MYSQL_PORT}" -uroot -p"${MYSQL_ROOT_PASSWORD}" <<SQL
CREATE DATABASE IF NOT EXISTS \`${MYSQL_CMS_DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS \`${MYSQL_API_DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER IF NOT EXISTS '${MYSQL_APP_USER}'@'%' IDENTIFIED BY '${MYSQL_APP_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${MYSQL_CMS_DB}\`.* TO '${MYSQL_APP_USER}'@'%';
GRANT ALL PRIVILEGES ON \`${MYSQL_API_DB}\`.* TO '${MYSQL_APP_USER}'@'%';
FLUSH PRIVILEGES;
SQL
    rc=$?
    set -e
    if [[ "${rc}" -ne 0 ]]; then
      echo "Could not connect as MySQL root. Skipping database/user initialization."
    fi
  else
    echo "mysql client not found. Skipping database/user initialization."
  fi
fi

echo
echo "== Step 5: Nginx reverse proxy =="
if ! cmd_exists nginx; then
  echo "nginx is not installed. Skipping Nginx configuration (by request)."
elif port_in_use 80; then
  echo "Port 80 is already in use. Skipping Nginx configuration."
  echo "You can manually proxy:"
  echo "- / -> 127.0.0.1:${WEB_PORT}"
  echo "- /api/ -> 127.0.0.1:${API_PORT}"
  echo "- /cms/ -> 127.0.0.1:${CMS_PORT}"
else
  echo "nginx is installed. Skipping Nginx configuration (by request)."
  echo "If you want to configure nginx, remove the skip flag section and re-run."
fi

echo
echo "== Step 6: Prepare app environment file =="
mkdir -p "${PROJECT_DIR}"
chown -R "${APP_USER}:${APP_GROUP}" "${PROJECT_DIR}"

cat > "${PROJECT_DIR}/.env" <<ENV
MYSQL_HOST=${MYSQL_HOST}
MYSQL_PORT=${MYSQL_PORT}
MYSQL_USER=${MYSQL_APP_USER}
MYSQL_PASSWORD=${MYSQL_APP_PASSWORD}
CMS_DB_NAME=${MYSQL_CMS_DB}
API_DB_NAME=${MYSQL_API_DB}

CMS_BASE_URL=http://127.0.0.1:${CMS_PORT}
API_BASE_URL=http://127.0.0.1:${API_PORT}
WEB_BASE_URL=http://127.0.0.1:${WEB_PORT}
ENV

chown "${APP_USER}:${APP_GROUP}" "${PROJECT_DIR}/.env"
chmod 600 "${PROJECT_DIR}/.env"

echo
echo "== Step 7: Create systemd service templates (optional) =="
echo "This step assumes code is already in: ${PROJECT_DIR}"
echo "and contains: apps/web, apps/api, apps/cms"

if confirm "Create systemd services for api/cms/web (npm install/build required)?" 0; then
  cat > /etc/systemd/system/oversea-api.service <<UNIT
[Unit]
Description=Oversea API (NestJS)
After=network.target

[Service]
Type=simple
User=${APP_USER}
Group=${APP_GROUP}
WorkingDirectory=${PROJECT_DIR}/apps/api
Environment=NODE_ENV=production
EnvironmentFile=${PROJECT_DIR}/.env
ExecStart=/usr/bin/npm run start:prod -- --port=${API_PORT}
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
UNIT

  cat > /etc/systemd/system/oversea-cms.service <<UNIT
[Unit]
Description=Oversea CMS (Strapi)
After=network.target

[Service]
Type=simple
User=${APP_USER}
Group=${APP_GROUP}
WorkingDirectory=${PROJECT_DIR}/apps/cms
Environment=NODE_ENV=production
EnvironmentFile=${PROJECT_DIR}/.env
ExecStart=/usr/bin/npm run start -- --port ${CMS_PORT}
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
UNIT

  cat > /etc/systemd/system/oversea-web.service <<UNIT
[Unit]
Description=Oversea Web (Next.js)
After=network.target

[Service]
Type=simple
User=${APP_USER}
Group=${APP_GROUP}
WorkingDirectory=${PROJECT_DIR}/apps/web
Environment=NODE_ENV=production
EnvironmentFile=${PROJECT_DIR}/.env
ExecStart=/usr/bin/npm run start -- --port ${WEB_PORT}
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
UNIT

  systemctl daemon-reload
  systemctl enable oversea-api oversea-cms oversea-web
  echo "systemd units created. You still need to run npm install/build inside each app directory before starting services."
fi

echo
echo "== Done =="
echo "- Nginx: http://${DOMAIN} (or server IP if domain not set)"
echo "- Env file: ${PROJECT_DIR}/.env"
echo "- Next steps (when code is ready):"
echo "  1) cd ${PROJECT_DIR}/apps/api && npm ci && npm run build"
echo "  2) cd ${PROJECT_DIR}/apps/cms && npm ci && npm run build"
echo "  3) cd ${PROJECT_DIR}/apps/web && npm ci && npm run build"
echo "  4) systemctl start oversea-api oversea-cms oversea-web"
