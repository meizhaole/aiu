// 协会与招新静态数据

// 会徽（封面主视觉 + 顶栏品牌标识）
export const EMBLEM = '/image/aiu_logo.png'

// 协会介绍
export const ASSOCIATION = {
  name: '人工智能协会',
  enName: 'AIU',
  tagline: '2026 招新进行中',
  intro:
    '人工智能协会（AIU）是一个聚焦人工智能技术学习、竞赛与项目实践的学生科技社团。'
    + '协会以「让每一位成员都能在智能时代有所成长」为宗旨，'
    + '通过线下培训、专题讲座、赛事支持和科创项目，'
    + '为成员搭建从入门到实战的完整成长路径。',
  highlights: [
    { title: '技术培训', desc: '系统化线下培训，零基础也能入门' },
    { title: '赛事实战', desc: '对接各类科创与 AI 赛事，以赛促学' },
    { title: '项目历练', desc: '真实项目驱动，积累实战经验' },
    { title: '伙伴同行', desc: '结识志同道合的伙伴，共同成长' },
  ],
}

// 四个部门：点击 logo 跳转对应招新宣传公众号推文
export const DEPARTMENTS = [
  {
    key: 'cz',
    name: '创智部',
    desc: '技术支撑赛事，组织培训营造竞赛氛围',
    logo: '/image/cz_logo.jpg',
    link: 'https://mp.weixin.qq.com/s/queEfOTnIjlVcyfn2dDPtQ',
  },
  {
    key: 'yy',
    name: '运营部',
    desc: '统筹财务、赛事、实验室及证明办理',
    logo: '/image/yy_logo.jpg',
    link: 'https://mp.weixin.qq.com/s/EqCONnoo78-qgxkhfrEO_Q',
  },
  {
    key: 'xc',
    name: '宣传部',
    desc: '运营公众号，推送资讯与协会动态',
    logo: '/image/xc_logo.jpg',
    link: 'https://mp.weixin.qq.com/s/KJa6xAZnK8IiYRZvXbvV5Q',
  },
  {
    key: 'wl',
    name: '外联部',
    desc: '统筹活动、项目及成员管理',
    logo: '/image/wl_logo.png',
    link: 'https://mp.weixin.qq.com/s/xNU1MSK5w71nIZytQT6DOg',
  },
]

// 报名表单部门选项
export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((d) => d.name)

// 活动展示
export const ACTIVITIES = [
  { img: '/image/pobing.png', title: '破冰迎新', desc: '欢迎新成员的破冰' },
  { img: '/image/peixun.png', title: '线下培训', desc: '协会线下培训' },
  { img: '/image/jiangzuo.jpg', title: '专题讲座', desc: '协会邀请王婷老师开展专题讲座' },
  { img: '/image/quanganhui.jpg', title: '全体干事会议', desc: '人工智能协会开展全体干事会议' },
  { img: '/image/ruikang.png', title: '赛事支持', desc: '为睿康赛事提供培训支持' },
  { img: '/image/tuanjian.png', title: '团建活动', desc: '协会进行团建活动' },
  { img: '/image/sanxiaxiang.jpg', title: '三下乡', desc: '成员带上科创设备，走进乡村校园' },
]

// 招新流程
export const TIMELINE = [
  { phase: '01', title: '在线报名', date: '即日起开放' },
  { phase: '02', title: '简历初筛', date: '约 T+3 日' },
  { phase: '03', title: '线下面试', date: '另行通知' },
  { phase: '04', title: '录取通知', date: '面试后 3 日' },
]
