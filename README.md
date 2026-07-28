# AIU 报名网站说明文档

本文档用于快速说明当前报名网站的整体结构、接口、部署方式与开发约定，适合开发者以及未来的 AI 助手直接参考。

## 1. 项目概述

### 项目名称

AIU 报名网站

### 项目用途

这是一个用于社团或组织报名的 Web 系统，核心目标是接收报名者提交的信息，并将数据写入 PostgreSQL 数据库。

### 主要功能

- 前端展示中文报名表单
- 提交报名信息到后端 API
- 后端校验后写入 `registrations` 表
- 成功后返回报名编号和提交时间

## 2. 技术栈与版本

### 前端

| 技术 | 版本 | 说明 |
| --- | --- | --- |
| React | 19.2.7 | 前端界面与表单状态管理 |
| React DOM | 19.2.7 | 页面渲染 |
| Vite | 8.1.1 | 构建工具与开发服务器 |
| @vitejs/plugin-react | 6.0.3 | Vite 的 React 插件 |
| oxlint | 1.71.0 | 代码检查工具 |

### 后端

| 技术 | 说明 |
| --- | --- |
| Vercel Serverless Functions | 后端 API 入口位于 `api/register.js` |
| Node.js Runtime | 使用 Vercel 默认 Node.js 运行时，无需在 `vercel.json` 中显式声明版本 |
| 语法 | ES Module，使用 `import/export` |

### 数据库

| 技术 | 说明 |
| --- | --- |
| Neon PostgreSQL | 托管 PostgreSQL 数据库 |
| 驱动 | `@neondatabase/serverless`，通过连接串连接数据库 |

### 部署平台

| 平台 | 说明 |
| --- | --- |
| Vercel | 前端构建、静态资源托管、Serverless Function 部署 |

## 3. 目录结构与职责

当前仓库根目录位于 `D:\Codes\aiu`，关键文件如下：

| 路径 | 职责 |
| --- | --- |
| `api/register.js` | Vercel Serverless Function 入口，处理报名表单的 `POST /api/register` 请求 |
| `frontend/` | 前端源码目录，使用 Vite + React 构建报名页面 |
| `vercel.json` | Vercel 部署配置，定义构建命令、输出目录、静态路由重写规则 |
| `package.json` | 根目录依赖配置，当前包含后端所需的 `@neondatabase/serverless` |
| `.env` | 本地与部署环境变量文件，不应提交到仓库 |
| `.gitignore` | 忽略规则，已排除 `.env`、`node_modules`、`dist`、`.vercel` 等敏感或构建产物 |

### 各目录说明

#### `api/`

存放 Vercel Functions。当前只有 `register.js`，负责接收报名数据并写库。

#### `frontend/`

存放前端应用源码。当前页面为中文报名表，提交时会直接调用 `/api/register`。

#### 根目录

根目录保存部署配置、环境变量说明和后端依赖，不放前端源码。Vercel 控制台里的 Root Directory 也应保持为仓库根目录 `aiu`，不要改成 `frontend` 或 `api`。

## 4. 数据库设计

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

### 主键与索引说明

- `id` 是主键，数据库会为主键自动建立唯一索引。
- 当前建表语句未定义额外索引。
- 如果后续需要按手机号或创建时间查询，可再按实际业务补充索引。

## 5. API 接口文档

### 端点

`POST /api/register`

### 功能

接收前端提交的报名数据，完成校验后写入 `registrations` 表。

### 请求体字段映射

当前前端提交的 JSON 字段与数据库列映射如下：

| 前端字段 | 数据库列 | 说明 |
| --- | --- | --- |
| `name` | `name` | 姓名 |
| `college` | `college` | 学院 |
| `gradeMajorClass` | `grade_major_class` | 年级 / 专业 / 班级 |
| `phone` | `phone` | 手机号 |
| `firstChoiceDepartment` | `first_choice_department` | 第一志愿部门 |
| `secondChoiceDepartment` | `second_choice_department` | 第二志愿部门，可为空 |
| `isOpenToAdjustment` | `is_open_to_adjustment` | 是否服从调剂 |
| `hobbiesOrSpecialties` | `hobbies_or_specialties` | 特长 / 爱好，可为空 |
| `reasonToJoin` | `reason_to_join` | 加入原因，可为空 |
| `selfIntro` | `self_introduction` | 自我介绍，可为空 |
| `experience` | `tech_experience_details` | 科创经历详情 |
| `hasTechExperience` | `has_tech_experience` | 前端当前会提交该字段，但后端以 `experience` 是否为空决定该值 |

### 重要实现说明

当前后端代码中，`has_tech_experience` 并不是直接信任请求体中的 `hasTechExperience` 值，而是根据 `experience` 是否有内容自动计算：

```js
const experience = getTrimmedString(body.experience);
const hasTechExperience = experience.length > 0;
```

因此，前端提交时只要保证 `experience` 字段正确传递即可。

### 校验规则

后端当前校验逻辑如下：

- `name` 不能为空
- `phone` 不能为空
- `phone` 必须符合中国大陆手机号格式：`^1[3-9]\d{9}$`
- `college` 不能为空
- `gradeMajorClass` 不能为空；如果未传，则兼容读取 `class`
- `firstChoiceDepartment` 不能为空
- 如果 `experience` 有值，则会写入 `tech_experience_details`，并将 `has_tech_experience` 设为 `true`

### 请求示例

```json
{
	"name": "张三",
	"college": "计算机学院",
	"gradeMajorClass": "2024级 软件工程 1班",
	"phone": "13800000000",
	"firstChoiceDepartment": "技术部",
	"secondChoiceDepartment": "宣传部",
	"isOpenToAdjustment": true,
	"hobbiesOrSpecialties": "摄影、前端开发",
	"reasonToJoin": "希望参与团队协作并提升能力",
	"selfIntro": "我性格开朗，善于沟通",
	"hasTechExperience": true,
	"experience": "参加过校级前端项目与比赛"
}
```

### 成功响应

HTTP 状态码：`200`

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

### 失败响应

#### 参数校验失败

HTTP 状态码：`400`

```json
{
	"success": false,
	"message": "phone 格式不正确，请填写中国大陆手机号"
}
```

#### 方法不允许

HTTP 状态码：`405`

```json
{
	"success": false,
	"message": "Method Not Allowed"
}
```

#### 服务器错误

HTTP 状态码：`500`

```json
{
	"success": false,
	"message": "服务器内部错误"
}
```

### 错误码说明

| 状态码 | 含义 |
| --- | --- |
| `200` | 提交成功 |
| `400` | 请求参数缺失、格式错误或 JSON 无效 |
| `405` | 只允许 `POST` |
| `500` | 数据库连接失败、写入失败或其他未预期错误 |

## 6. 环境变量与配置

### 必需环境变量

| 变量名 | 作用 |
| --- | --- |
| `DATABASE_URL` | Neon PostgreSQL 连接串，后端函数通过它连接数据库 |

### 可选环境变量

| 变量名 | 作用 |
| --- | --- |
| `NODE_ENV` | 运行环境标识，通常在部署平台自动提供 |

### 配置注意事项

- `DATABASE_URL` 必须在 Vercel 环境变量中配置。
- 本地开发时也需要在 `.env` 中提供同名变量。
- `.env` 文件已被 `.gitignore` 忽略，不能提交到仓库。

## 7. 部署流程

### 本地开发步骤

#### 1. 安装依赖

在根目录安装后端依赖：

```bash
npm install
```

进入前端目录安装前端依赖：

```bash
cd frontend
npm install
```

#### 2. 启动前端

在 `frontend/` 目录中启动 Vite 开发服务器：

```bash
npm run dev
```

#### 3. 测试 API

当前 API 是 Vercel Serverless Function，最贴近线上行为的本地方式是使用 Vercel CLI 模拟运行：

```bash
vercel dev
```

如果只调试前端页面，可以先单独启动 `frontend/` 的开发服务器，再在浏览器中联调线上或本地模拟的 API。

### Vercel 部署步骤

#### 1. 导入仓库

在 Vercel 控制台导入当前 Git 仓库 `meizhaole/aiu`。

#### 1.1 检查 Root Directory

Root Directory 需要指向仓库根目录，也就是 `aiu`。如果把它改成 `frontend`，Vercel 就会读不到根目录的 `vercel.json`，从而导致 `/register` 这类 SPA 路由出现 404。

#### 2. 设置环境变量

在项目设置中添加：

- `DATABASE_URL`

#### 3. 自动构建

Vercel 会读取根目录的 `vercel.json`，执行以下配置：

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

### `vercel.json` 配置解释

| 配置项 | 作用 |
| --- | --- |
| `buildCommand` | 构建前端：进入 `frontend/` 后安装依赖并执行 `npm run build` |
| `outputDirectory` | 指定前端构建产物目录为 `frontend/dist` |
| `$schema` | 提供编辑器补全和配置校验 |
| `rewrites` | 让非 API、非静态资源的路由回退到 `/index.html`，支持 SPA 路由 |

## 8. 开发规范与注意事项

### 敏感信息保护

- `.env` 不提交到仓库。
- 数据库连接串只放在本地环境或 Vercel 环境变量中。
- 不要在前端代码里硬编码 `DATABASE_URL`。

### 数据库迁移注意事项

- 当前代码默认 `registrations` 表已经存在。
- 后端写入字段和建表语句必须保持一致。
- 如果后续调整表结构，应同步更新：
	- `api/register.js`
	- 前端 `frontend/src/App.jsx` 的提交字段
	- 本文档中的映射表

### 前端构建产物路径约定

- 前端构建输出固定为 `frontend/dist`。
- 该路径已被 `vercel.json` 的 `outputDirectory` 使用。
- 不要把构建产物手动提交到仓库。

### 测试建议

- 修改前端后先执行：`cd frontend && npm run build`
- 修改 API 后检查 `api/register.js` 能否通过语法加载
- 提交报名时重点验证：
	- 必填项是否拦截
	- 手机号格式是否正确
	- `experience` 为空时是否仍能正常提交
	- 成功后是否返回 `id` 和 `created_at`

### 当前实现的约定

- 前端页面使用中文字段展示。
- 前端提交到 `/api/register`。
- 后端只接受 `POST`。
- Vercel 部署时，API 与前端由同一个仓库管理。

---

如果后续数据库字段、部门名称或提交结构发生变化，请优先同步更新 API、前端和本文档，保持三者一致。
