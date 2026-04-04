# 第一阶段 MVP（开源组合A + MySQL）开发说明

## 1. 目标与原则
- 目标：上线一个可对外投放的多语言站点（EN/RU/ES），可展示广州/深圳医疗资源，并引导用户留资；管理端可由非IT同事维护内容与资源库、查看/导出线索。
- 原则：先用成熟开源框架快速上线与试运营，运营一段时间后再评估迁移/自研。

## 2. 技术栈（组合A，数据库改为 MySQL）
- Public Web：Next.js（SSR/SSG，多语言 SEO）
- CMS：Strapi（内容模型、多语言、媒体、发布）
- Business API：NestJS（线索、资源库、导出、简单看板聚合）
- Database：MySQL 8（CMS 与 API 各自独立 schema/db）
- Object Storage（可选，MVP可先本地）：S3 兼容（后续 MinIO/云对象存储）
- Search（MVP可后置）：Meilisearch（用于模糊搜索下拉与站内搜索）
- Analytics（MVP先不做全量）：后续引入 PostHog/Metabase

## 3. MVP 范围（必须交付）
### 3.1 前台（Public Web）
- 多语言路由：/en /ru /es，支持切换语言
- 页面
  - 首页：价值主张、服务范围、信任背书、核心 CTA（免费评估）
  - 医院列表：按城市（广州/深圳）过滤 + 关键词搜索（MVP可先前端过滤或Strapi查询）
  - 医院详情：简介、地址/交通信息、关联科室、关联医生（可选）
  - 政策页：外国人就医政策（基础内容）
  - 留资页：姓名/邮箱/护照/电子病历（可选上传）/IM联系方式（类型+账号）
- 提交留资后：展示成功页（下一步联系说明）

### 3.2 CMS（Strapi）
- 内容类型
  - Hospital（医院）：多语言名称/简介、城市、地址、标签、封面图、关联科室/医生
  - Department（科室）：多语言名称/简介、关联医院、标签
  - Doctor（医生）：多语言姓名/简介、擅长、关联医院/科室（MVP可选）
  - Policy（政策）：多语言标题/内容
  - Landing Page（落地页）：选择模板 + 文案/图片 + 关联推荐内容（MVP先做最小字段）
- 多语言：启用 i18n；缺失语言版本时前台允许隐藏或回退 EN（MVP默认隐藏缺失）
- 发布：草稿/发布两态
- 非IT友好：字段描述（help text）、必填校验、默认值（如城市默认广州）

### 3.3 业务 API（NestJS）
- Leads（留资）
  - 创建留资（接收Public Web表单）
  - 管理端查询留资列表/详情（鉴权）
  - 导出 CSV（按筛选条件：时间范围/语言/城市/来源等，MVP先最小筛选）
- Resources（内部运营资源库）
  - 资源录入（向导式UI在管理端实现，API提供CRUD）
  - 类型：酒店/餐馆/交通（接送机/市内往返）/医院资源
  - 模糊查询：给“下拉+搜索”用（MVP先用 MySQL LIKE，后续换 Meilisearch）
- Auth/RBAC（MVP最小）
  - 先支持管理员账号（环境变量配置），后续迭代员工体系与权限点

### 3.4 管理端（Admin Console，向导式）
- MVP 最小交付（不追求全功能）
  - 资源库向导：分步表单录入 + 模糊搜索下拉选择
  - 留资列表/详情 + 导出 CSV
  - 简单 Dashboard：线索数量趋势（按天）+ 渠道/语言占比（数据口径后置完善）
- 说明：Strapi 自带后台用于内容维护；自研管理端用于线索/资源/导出/看板。

## 4. 目录规划（建议）
- apps/web：Next.js（前台+自研管理端可同仓不同路由）
- apps/cms：Strapi（内容后台）
- apps/api：NestJS（业务API）
- scripts：初始化/抓取/导入脚本
- seed：演示数据（JSON）

## 5. 本地开发（建议流程）
### 5.1 安装 MySQL（不使用 Docker）
- 安装 MySQL 8（建议用 MySQL Installer / Homebrew / apt 等系统方式）
- 确保你能使用以下任一工具连接 MySQL
  - MySQL Workbench
  - mysql 命令行（mysql client）

### 5.2 初始化数据库与账号（建议）
- 建议准备两个库
  - `oversea_cms`：给 Strapi 用
  - `oversea_api`：给 NestJS 用
- 在 MySQL 中执行（可用 Workbench 运行）

```sql
CREATE DATABASE IF NOT EXISTS oversea_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS oversea_api CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

CREATE USER IF NOT EXISTS 'oversea'@'%' IDENTIFIED BY 'oversea';
GRANT ALL PRIVILEGES ON oversea_cms.* TO 'oversea'@'%';
GRANT ALL PRIVILEGES ON oversea_api.* TO 'oversea'@'%';
FLUSH PRIVILEGES;
```

### 5.3 启动顺序
1) 启动本机 MySQL 服务（确保 `MYSQL_HOST/MYSQL_PORT` 可连接）
2) 启动 apps/cms（Strapi）并配置使用 MySQL（连接 `oversea_cms`）
3) 启动 apps/api（NestJS）连接 MySQL（连接 `oversea_api`）
4) 启动 apps/web（Next.js）配置 CMS 与 API Base URL

## 6. 演示数据（医院内容抓取）
- 目标：用于早期测试/演示的“公开信息”填充。
- 推荐方式：使用 scripts 下的抓取脚本在可联网环境运行，将结果保存为 seed JSON，再手工/批量导入 Strapi。
- 目标医院（优先广州）
  - 广医三院（广州医科大学附属第三医院）
  - 省妇幼/儿童医院（待确认具体机构名称与官网域名）
  - 广州中医药大学第一附属医院
- 注意：抓取仅限公开页面；不得抓取需要登录或明确禁止采集的内容；前台展示建议标注来源并定期校验更新。
