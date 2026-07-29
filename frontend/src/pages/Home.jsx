import { Link } from 'react-router-dom'
import FaqAccordion from '../components/FaqAccordion'
import SectionTitle from '../components/SectionTitle'
import {
  ASSOCIATION,
  DEPARTMENTS,
  EMBLEM,
  FAQS,
  PROCESS_STEPS,
} from '../data'

export default function Home() {
  return (
    <>
      <section className="cover">
        <section className="cover-left">
          <p className="cover-eyebrow">{ASSOCIATION.enName} · STUDENT TECH SOCIETY</p>
          <h1 className="cover-title">{ASSOCIATION.name}</h1>
          <p className="cover-tagline">{ASSOCIATION.tagline}</p>
          <p className="cover-intro">{ASSOCIATION.intro}</p>

          <div className="cover-actions">
            <Link className="primary-btn cover-btn" to="/register">
              立即报名
            </Link>
            <Link className="secondary-btn cover-btn" to="/about">
              了解我们
            </Link>
          </div>
        </section>

        <section className="cover-right">
          <div className="emblem-ring" aria-hidden="true" />
          <img className="cover-emblem" src={EMBLEM} alt="人工智能协会会徽" />
        </section>
      </section>

      <div className="home-stack">
        <section className="about-panel">
          <SectionTitle
            index="01"
            title="协会介绍"
            desc="先快速了解 AIU 的定位、使命与成长氛围"
          />
          <div className="about-intro">
            <div className="about-intro-text">
              <p>{ASSOCIATION.preview}</p>
              <div className="about-highlights">
                {ASSOCIATION.highlights.map((item) => (
                  <div className="about-highlight" key={item.title}>
                    <b>{item.title}</b>
                    <span>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="preview-side">
              <img className="preview-emblem" src={EMBLEM} alt="人工智能协会会徽" />
              <div className="mini-stats">
                {ASSOCIATION.stats.map((item) => (
                  <article className="mini-stat-card" key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div className="panel-actions">
            <Link className="secondary-btn" to="/about">
              查看详细介绍
            </Link>
          </div>
        </section>

        <section className="about-panel">
          <SectionTitle
            index="02"
            title="部门总览"
            desc="先看清四个方向，再选择真正适合你的成长入口"
          />
          <div className="dept-grid">
            {DEPARTMENTS.map((department) => (
              <Link className="dept-card" key={department.key} to={`/departments/${department.key}`}>
                <div className="dept-card-logo">
                  <img src={department.logo} alt={`${department.name} logo`} loading="lazy" />
                </div>
                <div className="dept-card-body">
                  <span className="dept-card-name">{department.name}</span>
                  <span className="dept-card-desc">{department.shortSummary}</span>
                </div>
                <div className="dept-card-tags">
                  {department.tags.map((tag) => (
                    <span className="dept-card-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="dept-card-cta">查看部门详情 →</span>
              </Link>
            ))}
          </div>
          <div className="panel-actions">
            <Link className="secondary-btn" to="/departments">
              查看全部部门
            </Link>
          </div>
        </section>

        <section className="about-panel">
          <SectionTitle
            index="03"
            title="招新流程"
            desc="从报名到加入，每一步都尽量轻量、透明且友好"
          />
          <div className="process-grid">
            {PROCESS_STEPS.map((step) => (
              <article className="process-card-extended" key={step.phase}>
                <div className="process-card-head">
                  <span className="process-card-phase">{step.phase}</span>
                  <span className="process-card-date">{step.date}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>
          <div className="panel-actions">
            <Link className="secondary-btn" to="/process">
              查看完整流程
            </Link>
          </div>
        </section>

        <section className="about-panel">
          <SectionTitle
            index="04"
            title="FAQ"
            desc="先回答最常见的几个顾虑，帮助你更轻松地做判断"
          />
          <FaqAccordion items={FAQS.slice(0, 3)} />
          <div className="panel-actions">
            <Link className="secondary-btn" to="/faq">
              查看更多问题
            </Link>
          </div>
        </section>

        <div className="about-cta">
          <p>如果你已经对 AIU 产生兴趣，现在就把你的故事写进报名表。</p>
          <div className="cover-actions">
            <Link className="primary-btn cover-btn" to="/register">
              去报名
            </Link>
            <Link className="secondary-btn cover-btn" to="/contact">
              先联系咨询
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
