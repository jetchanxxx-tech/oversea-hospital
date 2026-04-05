#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_DIR="${RUN_DIR:-${ROOT_DIR}/.run}"
LOG_DIR="${LOG_DIR:-${ROOT_DIR}/logs}"
ENV_FILE="${ENV_FILE:-${ROOT_DIR}/.env}"

mkdir -p "${RUN_DIR}"
mkdir -p "${LOG_DIR}"

if [[ -f "${ENV_FILE}" ]]; then
  set -a
  . "${ENV_FILE}"
  set +a
fi

WEB_PORT="${WEB_PORT:-3000}"
API_PORT="${API_PORT:-3001}"
CMS_PORT="${CMS_PORT:-1337}"

API_PID_FILE="${RUN_DIR}/api.pid"
WEB_PID_FILE="${RUN_DIR}/web.pid"
CMS_PID_FILE="${RUN_DIR}/cms.pid"

cmd="${1:-}"

port_in_use() {
  local port="$1"
  if command -v ss >/dev/null 2>&1; then
    ss -lnt 2>/dev/null | awk '{print $4}' | grep -E "(:|\\.)${port}\$" -q
    return
  fi
  if command -v netstat >/dev/null 2>&1; then
    netstat -lnt 2>/dev/null | awk '{print $4}' | grep -E "(:|\\.)${port}\$" -q
    return
  fi
  return 1
}

is_running_pid() {
  local pid="$1"
  [[ -n "${pid}" ]] && kill -0 "${pid}" >/dev/null 2>&1
}

read_pid() {
  local file="$1"
  if [[ -f "${file}" ]]; then
    cat "${file}" 2>/dev/null || true
  fi
}

start_one() {
  local name="$1"
  local pid_file="$2"
  local port="$3"
  shift 3
  local pid
  pid="$(read_pid "${pid_file}")"
  if [[ -n "${pid}" ]] && is_running_pid "${pid}"; then
    echo "${name} already running (pid=${pid})"
    return 0
  fi
  if port_in_use "${port}"; then
    echo "${name} port ${port} already in use, skip start"
    return 0
  fi
  nohup "$@" > "${LOG_DIR}/${name}.log" 2>&1 &
  echo $! > "${pid_file}"
  echo "${name} started (pid=$(cat "${pid_file}"))"
}

stop_one() {
  local name="$1"
  local pid_file="$2"
  local pid
  pid="$(read_pid "${pid_file}")"
  if [[ -z "${pid}" ]]; then
    echo "${name} not running (no pid file)"
    return 0
  fi
  if ! is_running_pid "${pid}"; then
    rm -f "${pid_file}"
    echo "${name} not running (stale pid file removed)"
    return 0
  fi
  kill "${pid}" >/dev/null 2>&1 || true
  for _ in $(seq 1 20); do
    if ! is_running_pid "${pid}"; then
      rm -f "${pid_file}"
      echo "${name} stopped"
      return 0
    fi
    sleep 0.3
  done
  kill -9 "${pid}" >/dev/null 2>&1 || true
  rm -f "${pid_file}"
  echo "${name} killed"
}

status_one() {
  local name="$1"
  local pid_file="$2"
  local port="$3"
  local pid
  pid="$(read_pid "${pid_file}")"
  if [[ -n "${pid}" ]] && is_running_pid "${pid}"; then
    echo "${name}: running pid=${pid} port=${port}"
  else
    if port_in_use "${port}"; then
      echo "${name}: port_in_use port=${port} (pid file missing or stale)"
    else
      echo "${name}: stopped port=${port}"
    fi
  fi
}

install_deps() {
  (cd "${ROOT_DIR}" && npm install)
}

build_all() {
  if [[ -d "${ROOT_DIR}/apps/api" ]]; then
    (cd "${ROOT_DIR}" && npm --workspace apps/api run build)
  fi
  if [[ -d "${ROOT_DIR}/apps/web" ]]; then
    (cd "${ROOT_DIR}" && npm --workspace apps/web run build)
  fi
  if [[ -d "${ROOT_DIR}/apps/cms" ]]; then
    (cd "${ROOT_DIR}" && npm --workspace apps/cms run build)
  fi
}

seed_demo() {
  (cd "${ROOT_DIR}" && npm --workspace apps/api run seed:demo)
}

start_all() {
  if [[ -d "${ROOT_DIR}/apps/api" ]]; then
    start_one "api" "${API_PID_FILE}" "${API_PORT}" bash -lc "cd '${ROOT_DIR}' && PORT='${API_PORT}' npm --workspace apps/api run start:prod"
  fi
  if [[ -d "${ROOT_DIR}/apps/web" ]]; then
    start_one "web" "${WEB_PID_FILE}" "${WEB_PORT}" bash -lc "cd '${ROOT_DIR}' && npm --workspace apps/web run start"
  fi
  if [[ -d "${ROOT_DIR}/apps/cms" ]]; then
    start_one "cms" "${CMS_PID_FILE}" "${CMS_PORT}" bash -lc "cd '${ROOT_DIR}' && npm --workspace apps/cms run start"
  fi
}

stop_all() {
  stop_one "web" "${WEB_PID_FILE}"
  stop_one "api" "${API_PID_FILE}"
  stop_one "cms" "${CMS_PID_FILE}"
}

status_all() {
  status_one "web" "${WEB_PID_FILE}" "${WEB_PORT}"
  status_one "api" "${API_PID_FILE}" "${API_PORT}"
  status_one "cms" "${CMS_PID_FILE}" "${CMS_PORT}"
}

logs_one() {
  local name="$1"
  local file="${LOG_DIR}/${name}.log"
  if [[ -f "${file}" ]]; then
    tail -n 200 "${file}"
  else
    echo "No log file: ${file}"
  fi
}

case "${cmd}" in
  install)
    install_deps
    ;;
  build)
    build_all
    ;;
  seed:demo)
    seed_demo
    ;;
  start)
    start_all
    ;;
  stop)
    stop_all
    ;;
  restart)
    stop_all
    start_all
    ;;
  status)
    status_all
    ;;
  logs:api)
    logs_one "api"
    ;;
  logs:web)
    logs_one "web"
    ;;
  logs:cms)
    logs_one "cms"
    ;;
  *)
    echo "Usage: $0 {install|build|seed:demo|start|stop|restart|status|logs:api|logs:web|logs:cms}"
    echo "Env: ENV_FILE=${ENV_FILE} RUN_DIR=${RUN_DIR} LOG_DIR=${LOG_DIR} WEB_PORT=${WEB_PORT} API_PORT=${API_PORT} CMS_PORT=${CMS_PORT}"
    exit 1
    ;;
esac

