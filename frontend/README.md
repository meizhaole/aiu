# AIU 招新前端说明文档

本文档说明当前 `frontend/` 目录下前端应用的页面结构、路由设计、主要组件、数据组织方式与报名接口对接约定。

---

## 一、前端概览

当前前端已从“单页报名页”升级为“多页面招新门户”，仍然保持原有科幻蓝白 HUD 风格，不重做整体 UI 体系。

### 技术栈

- React 19
- Vite 8
- React Router DOM 7
- 原生 CSS
- oxlint

### 启动命令

```bash
cd frontend
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

---

## 二、前端路由结构

当前前端使用 `react-router-dom` 进行真实路由管理：

| 路由 | 页面说明 |
| --- | --- |
| `/` | 首页预览页 |
| `/about` | 协会介绍页 |
| `/departments` | 部门总览页 |
| `/departments/:departmentId` | 部门详情页 |
| `/process` | 招新流程页 |
| `/faq` | FAQ 页 |
| `/contact` | 联系页 |
| `/register` | 报名页 |
| `*` | 404 页 |

### 当前支持的部门详情 ID

- `cz`：创智部
- `yy`：运营部
- `xc`：宣传部
- `wl`：外联部

---

## 三、页面功能说明

### 1. 首页 `/`

- 保留原有 Hero 主视觉
- 增加协会介绍预览
- 增加部门总览预览
- 增加招新流程预览
- 增加 FAQ 预览
- 增加底部 CTA

### 2. 协会介绍页 `/about`

- 展示协会定位与核心使命
- 展示团建活动轮播
- 展示成员竞赛荣誉
- 展示品牌文化与加入收获
- 荣誉板块默认折叠，只显示部分条目，可点击查看更多或收起

### 3. 部门总览页 `/departments`

- 展示四个部门卡片
- 点击卡片进入内部详情页
- 提供部门选择建议与流程入口

### 4. 部门详情页 `/departments/:departmentId`

- 展示部门简介
- 展示岗位职责
- 展示适合人群
- 展示成长收获
- 展示项目示例
- 提供报名入口
- 提供公众号招新推文外链入口
- 非法 `departmentId` 显示兜底空状态

### 5. 招新流程页 `/process`

- 展示完整四步流程
- 展示报名建议
- 提供报名 CTA

### 6. FAQ 页 `/faq`

- 使用单项展开折叠面板
- 一次只展开一个问题
- 提供继续浏览入口

### 7. 联系页 `/contact`

- 当前不再展示邮箱、电话、地点等文字信息
- 当前展示 `public/image/招新群.jpg`
- 用于承载招新群二维码或海报图

### 8. 报名页 `/register`

- 保留原有受控表单
- 保留前端校验逻辑
- 保留提交到 `/api/register`
- 保留成功页、报名编号和时间展示
- 仅将原本的本地切页跳转改为真实路由跳转

---

## 四、关键文件与职责

| 路径 | 职责 |
| --- | --- |
| `src/main.jsx` | 前端挂载入口，使用 `BrowserRouter` |
| `src/App.jsx` | 路由表定义 |
| `src/components/SiteLayout.jsx` | 全局布局与顶栏导航 |
| `src/components/PageHero.jsx` | 二级页面通用头部 |
| `src/components/FaqAccordion.jsx` | FAQ 折叠组件 |
| `src/components/TeamCarousel.jsx` | 团建轮播组件 |
| `src/components/SectionTitle.jsx` | 区块标题组件 |
| `src/pages/` | 各路由页面 |
| `src/data.js` | 协会、部门、流程、FAQ、联系页等前端数据 |
| `src/App.css` | 前端主要样式 |
| `src/index.css` | 全局变量、背景和基础样式 |

---

## 五、前端数据组织

`src/data.js` 当前统一维护以下数据：

- 顶栏导航
- 协会基础信息
- 协会荣誉列表
- 部门总览与详情数据
- 团建轮播数据
- 招新流程数据
- FAQ 数据
- 联系页数据

### 当前实现特点

- 页面内容大多由数据驱动生成
- 荣誉、FAQ、流程、部门详情都不是写死在页面结构里
- 如果后续替换文案或扩展奖项，优先修改 `src/data.js`

---

## 六、报名页与后端接口对接

### 当前提交地址

`POST /api/register`

### 前端表单字段与接口字段映射

| 前端 state 字段 | 提交字段 |
| --- | --- |
| `name` | `name` |
| `college` | `college` |
| `gradeMajorClass` | `gradeMajorClass` |
| `phone` | `phone` |
| `firstChoiceDepartment` | `firstChoiceDepartment` |
| `secondChoiceDepartment` | `secondChoiceDepartment` |
| `isOpenToAdjustment` | `isOpenToAdjustment` |
| `hobbiesOrSpecialties` | `skills` |
| `reasonToJoin` | `motivation` |
| `selfIntroduction` | `selfIntro` |
| `techExperienceDetails` | `experience` |

### 后端校验重点

- 姓名必填
- 学院必填
- 年级 / 专业 / 班级必填
- 手机号必须符合中国大陆手机号格式
- 第一志愿部门必填

### 成功响应

```json
{
  "success": true,
  "message": "报名提交成功",
  "data": {
    "id": 42,
    "created_at": "2026-07-29T12:34:56.000Z"
  }
}
```

---

## 七、静态资源说明

`public/image/` 当前包含：

- 协会 logo
- 各部门 logo
- 活动图片
- 联系页招新群图片 `招新群.jpg`

### 注意

- 联系页目前依赖中文文件名 `招新群.jpg`
- 若后续替换该图片，请同步确认文件名或页面引用路径是否一致

---

## 八、开发与修改建议

### UI 相关

- 保持当前 HUD 风格与蓝白色板
- 尽量复用 `App.css` 中现有按钮、面板、排版和卡片体系
- 不建议引入新的 UI 库

### 内容相关

- 页面文案优先改 `src/data.js`
- 页面结构交互再改 `src/pages/` 或 `src/components/`

### 接口相关

- 不要随意改动 `/api/register` 的 payload 字段名
- 如果要改字段或表结构，请同步更新：
  - `src/pages/Register.jsx`
  - `api/register.js`
  - 根目录 `README.md`
  - 本文档

---

## 九、建议检查项

每次前端改动后建议至少执行：

```bash
cd frontend
npm run build
npm run lint
```

并手动检查以下页面：

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

如果后续继续补图片、替换真实协会文案、接入更多页面模块，记得同步更新本文件，保证前端实现与说明一致。
