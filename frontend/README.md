# AIU 招新前端 · 接口对接文档

> 面向前端开发队友的接口说明。本文档以 `api/` 目录下的 Serverless Functions 源码为准，描述后端**真实**接受与返回的内容，并标注前端当前实现中需要修正的对接差异。

---

## 一、项目概览

- **技术栈**：React 19 + Vite 8（ESM）
- **部署方式**：Vercel（前端 SPA + `/api/*` Serverless Functions）
- **后端运行时**：Vercel Node Serverless，数据库为 Neon PostgreSQL（`@neondatabase/serverless`）
- **本地开发**：仅前端可独立 `npm run dev`（端口 5173），`/api/*` 需在 Vercel 环境或本地配置后端代理才可联调

### 启动命令

```bash
cd frontend
npm install      # 安装依赖
npm run dev      # 启动开发服务器 http://localhost:5173
npm run build    # 生产构建，输出到 dist/
npm run preview  # 本地预览生产构建
npm run lint     # oxlint 检查
```

---

## 二、接口基础信息

| 项 | 值 |
|---|---|
| Base URL | 同源（前端通过相对路径 `/api/...` 调用） |
| 请求格式 | `application/json`（UTF-8） |
| 鉴权 | 无（公开接口） |
| 跨域 | 同源部署，无需 CORS；本地联调见 [本地联调说明](#七本地联调说明) |

### 路由约定（来自 `vercel.json`）

- `/api/*` → 走 Serverless Function（`api/` 目录下同名 `.js`）
- 其余路径 → 回退到 `frontend/dist/index.html`（SPA History 路由）

---

## 三、接口列表

### 1. 提交报名 `POST /api/register`

招新报名表单的唯一写入接口。前端表单提交时调用。

#### 请求

- **Method**：`POST`
- **Content-Type**：`application/json`
- **Body**：JSON 对象

##### 请求体字段（后端真实期望）

| 字段 | 类型 | 必填 | 后端处理说明 |
|---|---|---|---|
| `name` | string | ✅ 是 | 姓名，`trim()` 后不能为空 |
| `college` | string | ✅ 是 | 学院，`trim()` 后不能为空 |
| `gradeMajorClass` | string | ✅ 是 | 年级 / 专业 / 班级；**后端会兜底读取 `class` 字段**（二者任一非空即可） |
| `phone` | string | ✅ 是 | 中国大陆手机号，正则校验 `^1[3-9]\d{9}$` |
| `firstChoiceDepartment` | string | ✅ 是 | 第一志愿部门，不能为空 |
| `secondChoiceDepartment` | string | ❌ 否 | 第二志愿部门，为空时入库 `null` |
| `isOpenToAdjustment` | boolean | ❌ 否 | 是否服从调剂，后端用 `Boolean(...)` 转换，缺省为 `false` |
| `skills` | string | ❌ 否 | **特长 / 爱好**（入库列 `hobbies_or_specialties`） |
| `motivation` | string | ❌ 否 | **加入原因**（入库列 `reason_to_join`） |
| `selfIntro` | string | ❌ 否 | 自我介绍 |
| `experience` | string | ❌ 否 | 科创经历详情；**非空时 `hasTechExperience` 自动置 `true`** |
| `hasTechExperience` | boolean | ❌ 否 | ⚠️ **后端忽略此字段**，统一由 `experience` 是否非空推断 |

> **字段名映射**：前端语义字段名 ≠ 后端读取字段名 ≠ 数据库列名。完整对照见 [第五节](#五字段名映射对照重要)。

#### 请求示例（推荐写法，字段名与后端对齐）

```jsonc
POST /api/register
Content-Type: application/json

{
  "name": "张三",
  "college": "计算机学院",
  "gradeMajorClass": "2024级 软件工程 1班",
  "phone": "13800138000",
  "firstChoiceDepartment": "创智部",
  "secondChoiceDepartment": "运营部",
  "isOpenToAdjustment": true,
  "skills": "摄影、剪辑、Python",
  "motivation": "希望参与真实 AI 项目，提升工程能力",
  "selfIntro": "对人工智能充满热情，喜欢动手实践……",
  "experience": "2025 年全国大学生数学建模竞赛省一等奖，负责建模与编程"
}
```

#### 成功响应

- **HTTP**：`200 OK`
- **Body**：

```jsonc
{
  "success": true,
  "message": "报名提交成功",
  "data": {
    "id": 42,                 // 报名记录主键（number）
    "created_at": "2026-07-29T12:34:56.000Z"  // ISO 8601 / timestamptz 字符串
  }
}
```

#### 错误响应

错误统一返回 `{ "success": false, "message": "..." }`，前端应展示 `message` 给用户。

| HTTP | message | 触发条件 |
|---|---|---|
| 400 | `请求体必须是 JSON 格式` | `Content-Type` 不含 `application/json` 且 `body` 不是对象 |
| 400 | `JSON 解析失败` | `body` 是非法 JSON 字符串 |
| 400 | `请求体无效` | 解析后 `body` 不是对象 |
| 400 | `name 不能为空` | `name` 为空（最先校验） |
| 400 | `phone 不能为空` | `phone` 为空 |
| 400 | `phone 格式不正确，请填写中国大陆手机号` | `phone` 不匹配 `^1[3-9]\d{9}$` |
| 400 | `college 不能为空` | `college` 为空 |
| 400 | `gradeMajorClass 或 class 不能为空` | `gradeMajorClass` 与 `class` 均为空 |
| 400 | `firstChoiceDepartment 不能为空` | `firstChoiceDepartment` 为空 |
| 405 | `Method Not Allowed` | 非 `POST` 请求（响应头带 `Allow: POST`） |
| 500 | `数据库连接串未配置，请在 Vercel 环境变量中设置 DATABASE_URL` | 服务端 `DATABASE_URL` 缺失 |
| 500 | `服务器内部错误` | 数据库写入异常等未知错误 |

> **校验顺序**：`name → phone(空) → phone(格式) → college → gradeMajorClass → firstChoiceDepartment`。前端如需精确报错，请按相同顺序优先级做本地校验。

---

### 2. 健康检查 `GET /api/test`

用于确认后端 Serverless 是否正常运行（无业务逻辑）。

#### 请求

- **Method**：`GET`
- **Body**：无

#### 响应

- **HTTP**：`200 OK`

```json
{ "message": "后端运行正常！" }
```

---

## 四、字段名映射对照（重要）

为避免混淆，三者命名对照如下：

| 业务含义 | 前端表单字段（state） | 接口字段（后端读取） | 数据库列（写入） |
|---|---|---|---|
| 姓名 | `name` | `name` | `name` |
| 学院 | `college` | `college` | `college` |
| 年级/专业/班级 | `gradeMajorClass` | `gradeMajorClass` / `class` | `grade_major_class` |
| 手机号 | `phone` | `phone` | `phone` |
| 第一志愿部门 | `firstChoiceDepartment` | `firstChoiceDepartment` | `first_choice_department` |
| 第二志愿部门 | `secondChoiceDepartment` | `secondChoiceDepartment` | `second_choice_department` |
| 是否服从调剂 | `isOpenToAdjustment` | `isOpenToAdjustment` | `is_open_to_adjustment` |
| 特长/爱好 | `hobbiesOrSpecialties` | `skills` | `hobbies_or_specialties` |
| 加入原因 | `reasonToJoin` | `motivation` | `reason_to_join` |
| 自我介绍 | `selfIntroduction` | `selfIntro` | `self_introduction` |
| 是否有科创经历 | `hasTechExperience` | （由 `experience` 推断） | `has_tech_experience` |
| 科创经历详情 | `techExperienceDetails` | `experience` | `tech_experience_details` |

---

## 五、TypeScript 类型定义（可直接复用）

为方便队友在调用时获得类型提示，提供以下类型（即使项目当前为 JS，也可在 JSDoc 中引用）：

```ts
// 提交报名的请求体（字段名以后端为准）
export interface RegisterPayload {
  name: string
  college: string
  gradeMajorClass: string
  phone: string
  firstChoiceDepartment: string
  secondChoiceDepartment?: string
  isOpenToAdjustment?: boolean
  skills?: string        // 特长/爱好
  motivation?: string    // 加入原因
  selfIntro?: string     // 自我介绍
  experience?: string    // 科创经历详情
}

// 报名成功响应
export interface RegisterSuccessResponse {
  success: true
  message: string
  data: {
    id: number
    created_at: string
  }
}

// 报名失败响应
export interface RegisterErrorResponse {
  success: false
  message: string
}

export type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse
```

---

## 六、前端调用封装示例

建议封装一个统一的提交函数，集中处理字段名映射与错误：

```js
async function submitRegistration(form) {
  const payload = {
    name: form.name.trim(),
    college: form.college.trim(),
    gradeMajorClass: form.gradeMajorClass.trim(),
    phone: form.phone.trim(),
    firstChoiceDepartment: form.firstChoiceDepartment.trim(),
    secondChoiceDepartment: form.secondChoiceDepartment.trim(),
    isOpenToAdjustment: form.isOpenToAdjustment,
    skills: form.hobbiesOrSpecialties.trim(),       // ← 注意字段名
    motivation: form.reasonToJoin.trim(),           // ← 注意字段名
    selfIntro: form.selfIntroduction.trim(),
    experience: form.hasTechExperience ? form.techExperienceDetails.trim() : '',
  }

  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.success) {
    throw new Error(data?.message || '提交失败，请稍后重试')
  }
  return data.data // { id, created_at }
}
```

---

## 七、本地联调说明

`/api/*` 由 Vercel Serverless 托管，本地 `vite dev` 默认**不会**运行后端。两种联调方式：

1. **Vercel CLI**（推荐，行为与线上一致）
   ```bash
   # 在仓库根目录
   npm i -g vercel
   vercel dev        # 同时托管前端与 /api/*
   ```
   需在 Vercel 项目环境变量中配置 `DATABASE_URL`。

2. **Vite 代理**（仅当前端想指向独立后端地址时）
   在 `vite.config.js` 中增加：
   ```js
   server: {
     proxy: {
       '/api': {
         target: 'https://your-vercel-app.vercel.app',
         changeOrigin: true,
       },
     },
   }
   ```

---

## 八、部门字典

前端部门选项与后端无强校验（后端仅检查非空），但为保证数据一致性，统一使用以下 4 个部门：

| 部门 | 职能 |
|---|---|
| 创智部 | 技术支撑赛事，组织培训营造竞赛氛围 |
| 运营部 | 统筹财务、赛事、实验室及证明办理 |
| 宣传部 | 运营公众号，推送资讯与协会动态 |
| 外联部 | 统筹活动、项目及成员管理 |

---

## 九、注意事项

- 后端对 `gradeMajorClass` 有 `class` 字段兜底，前端**无需**额外传 `class`，保持 `gradeMajorClass` 即可。
- `phone` 必须为 11 位中国大陆手机号，前端已用相同正则做本地校验，体验更佳。
- `hasTechExperience` 字段后端不读取，前端可继续在 UI 中用于控制「科创经历详情」的展开与必填联动，但**不要**依赖后端回传该字段。
- 提交成功返回的 `id` 建议展示给用户（如 `#0042`），便于后续核对。
