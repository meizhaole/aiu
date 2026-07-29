import { ASSOCIATION, DEPARTMENTS, ACTIVITIES, EMBLEM } from '../data'

function SectionTitle({ index, title, desc }) {
  return (
    <div className="section-title about-section-title">
      <h2>
        <span className="about-index">{index}</span>
        {title}
      </h2>
      <p>{desc}</p>
    </div>
  )
}

export default function About({ onNavigate }) {
  return (
    <main className="about">
      {/* 协会介绍 */}
      <section className="about-panel">
        <SectionTitle index="01" title="协会介绍" desc="关于人工智能协会" />
        <div className="about-intro">
          <div className="about-intro-text">
            <p>{ASSOCIATION.intro}</p>
            <div className="about-highlights">
              {ASSOCIATION.highlights.map((item) => (
                <div className="about-highlight" key={item.title}>
                  <b>{item.title}</b>
                  <span>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="about-intro-emblem">
            <img src={EMBLEM} alt="人工智能协会会徽" />
          </div>
        </div>
      </section>

      {/* 部门介绍 */}
      <section className="about-panel">
        <SectionTitle
          index="02"
          title="部门介绍"
          desc="点击部门图片查看对应招新宣传推文"
        />
        <div className="dept-grid">
          {DEPARTMENTS.map((dept) => (
            <a
              className="dept-card"
              key={dept.key}
              href={dept.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="dept-card-logo">
                <img src={dept.logo} alt={`${dept.name} logo`} loading="lazy" />
              </div>
              <div className="dept-card-body">
                <span className="dept-card-name">{dept.name}</span>
                <span className="dept-card-desc">{dept.desc}</span>
              </div>
              <span className="dept-card-cta">查看招新推文 →</span>
            </a>
          ))}
        </div>
      </section>

      {/* 活动展示 */}
      <section className="about-panel">
        <SectionTitle index="03" title="活动展示" desc="我们的日常与高光时刻" />
        <div className="activity-grid">
          {ACTIVITIES.map((item) => (
            <figure className="activity-card" key={item.img}>
              <img src={item.img} alt={item.title} loading="lazy" />
              <figcaption>
                <b>{item.title}</b>
                <span>{item.desc}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="about-cta">
        <p>找到心仪的部门了？</p>
        <button type="button" className="primary-btn" onClick={() => onNavigate('register')}>
          立即报名
        </button>
      </div>
    </main>
  )
}
