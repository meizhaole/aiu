# AIU 招新网站说明文档

本文档用于说明当前仓库的整体结构、功能范围、接口约定、部署方式与开发注意事项，适合后续协作开发与项目交接时参考。

## 1. 项目概述

### 项目名称

AIU 招新网站

### 项目用途

这是一个面向人工智能协会招新的多页面 Web 站点，兼顾内容展示与在线报名两部分能力：

- 前端以科幻蓝白 HUD 风格展示协会介绍、部门总览、部门详情、招新流程、FAQ、联系页和报名页
- 报名页通过 `/api/register` 将表单数据写入 PostgreSQL 数据库

### 当前主要功能

- 多页面 SPA 路由站点
- 首页预览入口页
- 协会介绍页
- 部门总览与部门详情页
- 招新流程页
- FAQ 页
- 联系页（当前展示招新群图片）
- 报名表单页
- 404 兜底页
- 前端表单校验、提交成功反馈与报名编号展示
- 后端校验后写入 `registrations` 表

## 2. 技术栈与版本

### 前端

| 技术 | 版本 | 说明 |
| --- | --- | --- |
| React | 19.2.7 | 前端界面与状态管理 |
| React DOM | 19.2.7 | 页面渲染 |
| React Router DOM | 7.18.1 | 前端真实路由 |
| Vite | 8.1.1 | 构建工具与开发服务器 |
| @vitejs/plugin-react | 6.0.3 | Vite 的 React 插件 |
| oxlint | 1.71.0 | 代码检查工具 |

### 后端

| 技术 | 说明 |
| --- | --- |
| Vercel Serverless Functions | 后端 API 入口位于 `api/register.js` |
| Node.js Runtime | 使用 Vercel 默认 Node.js 运行时 |
| ES Module | 使用 `import/export` 语法 |

### 数据库

| 技术 | 说明 |
| --- | --- |
| Neon PostgreSQL | 托管 PostgreSQL 数据库 |
| @neondatabase/serverless | 数据库连接驱动 |

### 部署平台

| 平台 | 说明 |
| --- | --- |
| Vercel | 前端构建、静态资源托管、Serverless Function 部署 |

## 3. 前端页面与路由

当前前端已升级为真实路由结构：

| 路由 | 页面说明 |
| --- | --- |
| `/` | 首页预览页，包含协会、部门、流程、FAQ 预览与 CTA |
| `/about` | 协会介绍页，包含使命、团建轮播、荣誉列表、文化与收获 |
| `/departments` | 部门总览页 |
| `/departments/:departmentId` | 部门详情页，当前支持 `cz / yy / xc / wl` |
| `/process` | 招新流程页 |
| `/faq` | FAQ 页 |
| `/contact` | 联系页，当前展示招新群图片 |
| `/register` | 报名页 |
| `*` | 未匹配路由兜底页 |

### 当前前端交互特点

- 顶栏使用 `react-router-dom` 导航，支持当前页高亮
- 路由切换后自动滚动到页面顶部
- 团建活动为轮播展示
- 荣誉板块默认只展示部分条目，可点击展开/收起
- 联系页不再展示邮箱电话，改为展示招新群二维码图片
- 报名页保留原有表单逻辑与数据库接口

## 4. 目录结构与职责

| 路径 | 职责 |
| --- | --- |
| `api/register.js` | 处理 `POST /api/register` 报名请求并写库 |
| `api/test.js` | 健康检查接口 |
| `frontend/` | 前端源码目录 |
| `frontend/src/App.jsx` | 前端路由入口 |
| `frontend/src/components/` | 页面复用组件，如布局、FAQ、轮播、页头等 |
| `frontend/src/pages/` | 路由页面 |
| `frontend/src/data.js` | 前端页面文案、部门数据、流程数据、FAQ 数据等 |
| `frontend/public/image/` | logo、活动图、招新群图片等静态资源 |
| `vercel.json` | Vercel 构建与 SPA rewrite 配置 |
| `package.json` | 根目录后端依赖 |
| `frontend/package.json` | 前端依赖与脚本 |

### `frontend/` 说明

当前前端不再只是单页报名表，而是完整招新门户。前端接口对接、路由和页面说明见 [`frontend/README.md`](frontend/README.md)。

## 5. 数据库设计

### 表名

`registrations`

### 建表结构

```sql
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    college VARCHAR(100) NOT NULL,
    grade_major_class VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    first_choice_department VARCHAR(100) NOT NULL,
    second_choice_department VARCHAR(100),
    is_open_to_adjustment BOOLEAN DEFAULT FALSE,
    hobbies_or_specialties TEXT,
    reason_to_join TEXT,
    self_introduction TEXT,
    has_tech_experience BOOLEAN DEFAULT FALSE,
    tech_experience_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 字段说明

| 字段 | 类型 | 约束 / 默认值 | 说明 |
| --- | --- | --- | --- |
| `id` | `SERIAL` | `PRIMARY KEY` | 报名记录主键，自增 |
| `name` | `VARCHAR(100)` | `NOT NULL` | 姓名 |
| `college` | `VARCHAR(100)` | `NOT NULL` | 学院 |
| `grade_major_class` | `VARCHAR(200)` | `NOT NULL` | 年级 / 专业 / 班级 |
| `phone` | `VARCHAR(20)` | `NOT NULL` | 手机号 |
| `first_choice_department` | `VARCHAR(100)` | `NOT NULL` | 第一志愿部门 |
| `second_choice_department` | `VARCHAR(100)` | 可空 | 第二志愿部门 |
| `is_open_to_adjustment` | `BOOLEAN` | `DEFAULT FALSE` | 是否服从调剂 |
| `hobbies_or_specialties` | `TEXT` | 可空 | 特长 / 爱好 |
| `reason_to_join` | `TEXT` | 可空 | 加入原因 |
| `self_introduction` | `TEXT` | 可空 | 自我介绍 |
| `has_tech_experience` | `BOOLEAN` | `DEFAULT FALSE` | 是否有科创经历 |
| `tech_experience_details` | `TEXT` | 可空 | 科创经历详情 |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `DEFAULT CURRENT_TIMESTAMP` | 创建时间 |

## 6. API 接口文档

### 端点

`POST /api/register`

### 功能

接收前端报名数据，完成基础校验后写入 `registrations` 表。

### 请求体字段映射

| 请求字段（前端发送） | 数据库列 | 说明 |
| --- | --- | --- |
| `name` | `name` | 姓名 |
| `college` | `college` | 学院 |
| `gradeMajorClass` | `grade_major_class` | 年级 / 专业 / 班级；后端兜底读取 `class` |
| `phone` | `phone` | 手机号 |
| `firstChoiceDepartment` | `first_choice_department` | 第一志愿部门 |
| `secondChoiceDepartment` | `second_choice_department` | 第二志愿部门，为空存 `null` |
| `isOpenToAdjustment` | `is_open_to_adjustment` | 是否服从调剂 |
| `skills` | `hobbies_or_specialties` | 特长 / 爱好 |
| `motivation` | `reason_to_join` | 加入原因 |
| `selfIntro` | `self_introduction` | 自我介绍 |
| `experience` | `tech_experience_details` | 科创经历详情 |
| `hasTechExperience` | `has_tech_experience` | 前端会提交，但后端实际根据 `experience` 是否为空计算 |

### 当前后端校验规则

- `name` 不能为空
- `phone` 不能为空
- `phone` 必须符合中国大陆手机号格式：`^1[3-9]\d{9}$`
- `college` 不能为空
- `gradeMajorClass` 不能为空；如果未传，则兼容读取 `class`
- `firstChoiceDepartment` 不能为空

### 成功响应示例

```json
{
  "success": true,
  "message": "报名提交成功",
  "data": {
    "id": 12,
    "created_at": "2026-07-28T09:00:00.000Z"
  }
}
```

### 失败状态码

| 状态码 | 含义 |
| --- | --- |
| `400` | 请求参数缺失、格式错误或 JSON 无效 |
| `405` | 只允许 `POST` |
| `500` | 数据库连接失败、写入失败或其他未预期错误 |

## 7. 环境变量与配置

### 必需环境变量

| 变量名 | 作用 |
| --- | --- |
| `DATABASE_URL` | Neon PostgreSQL 连接串 |

### 配置注意事项

- `DATABASE_URL` 必须在 Vercel 环境变量中配置
- 本地开发如需联调 API，也需要在环境中提供同名变量
- `.env` 文件不应提交到仓库

## 8. 本地开发与部署

### 本地开发步骤

#### 1. 安装依赖

根目录安装后端依赖：

```bash
npm install
```

进入前端目录安装前端依赖：

```bash
cd frontend
npm install
```

#### 2. 启动前端

```bash
cd frontend
npm run dev
```

#### 3. 本地联调 API

推荐使用 Vercel CLI：

```bash
vercel dev
```

### Vercel 部署说明

`vercel.json` 当前配置如下：

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    {
      "source": "/((?!api/.*|.*\\..*).*)",
      "destination": "/index.html"
    }
  ]
}
```

### 配置解释

| 配置项 | 作用 |
| --- | --- |
| `buildCommand` | 构建前端 |
| `outputDirectory` | 前端构建产物目录 |
| `rewrites` | 支持前端多路由直达，未命中 API 或静态资源时回退到 `index.html` |

### Root Directory 注意事项

Vercel 项目的 Root Directory 必须指向仓库根目录，而不是 `frontend`。否则会读不到根目录的 `vercel.json`，前端真实路由直达时容易出现 404。

## 9. 开发注意事项

- 当前站点已从单页报名站升级为多页面招新门户，新增页面时请保持 HUD 风格一致
- 联系页当前使用 `frontend/public/image/招新群.jpg` 作为展示资源
- 荣誉列表为折叠展示，若继续扩充奖项，优先保持数据驱动结构
- 后端 `/api/register` 仍是当前唯一正式写入接口
- 如后续调整数据库字段、表单结构或部门名称，请同步更新：
  - `api/register.js`
  - `frontend/src/pages/Register.jsx`
  - `frontend/src/data.js`
  - 本文档与 `frontend/README.md`

## 10. 建议的基础检查

- `cd frontend && npm run build`
- `cd frontend && npm run lint`
- 打开以下路由做基础手动检查：
  - `/`
  - `/about`
  - `/departments`
  - `/departments/cz`
  - `/departments/yy`
  - `/departments/xc`
  - `/departments/wl`
  - `/process`
  - `/faq`
  - `/contact`
  - `/register`

---

如果后续页面结构、前端交互或后端字段继续变化，请优先同步更新这份文档，保证代码与说明保持一致。
