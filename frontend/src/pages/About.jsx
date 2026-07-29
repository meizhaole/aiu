import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionTitle from '../components/SectionTitle'
import TeamCarousel from '../components/TeamCarousel'
import { ASSOCIATION, EMBLEM, TEAM_BUILDING_ITEMS } from '../data'

export default function About() {
  const [showAllHonors, setShowAllHonors] = useState(false)
  const visibleHonors = showAllHonors ? ASSOCIATION.honors : ASSOCIATION.honors.slice(0, 6)

  return (
    <>
      <PageHero
        eyebrow="协会介绍"
        title="一个把技术热情、团队协作和校园表达连接起来的成长社群"
        description={ASSOCIATION.intro}
        actions={[
          { to: '/register', label: '立即报名' },
          { to: '/departments', label: '查看部门', variant: 'ghost' },
        ]}
      >
        <div className="hero-side-stack">
          <img className="preview-emblem preview-emblem--hero" src={EMBLEM} alt="人工智能协会会徽" />
          <div className="mini-stats">
            {ASSOCIATION.stats.map((item) => (
              <article className="mini-stat-card" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </div>
      </PageHero>

      <main className="page-stack">
        <section className="about-panel">
          <SectionTitle
            index="01"
            title="协会定位与核心使命"
            desc="我们希望把技术探索、团队协作与校园表达真正放到一个长期可参与的场景里。"
          />
          <div className="split-panels">
            <article className="info-card info-card--tall">
              <p className="info-copy">{ASSOCIATION.mission}</p>
            </article>
            <article className="info-card">
              <h3 className="info-card-title">加入 AIU，你会更常遇见这些体验</h3>
              <ul className="info-list">
                {ASSOCIATION.highlights.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    <span>{item.desc}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="about-panel">
          <SectionTitle
            index="02"
            title="团建活动"
            desc="在协作之外，也认真经营彼此之间的连接感。"
          />
          <TeamCarousel items={TEAM_BUILDING_ITEMS} />
        </section>

        <section className="about-panel">
          <SectionTitle
            index="03"
            title="成员竞赛荣誉"
            desc="把课堂里的兴趣，逐渐打磨成可以被看见的成果。"
          />
          <div className="honor-list">
            {visibleHonors.map((item) => (
              <article className="honor-item" key={`${item.year}-${item.title}`}>
                <div className="honor-item-meta">
                  <span className="honor-item-year">{item.year}</span>
                  {item.member ? <span className="honor-item-member">{item.member}</span> : null}
                </div>
                <div className="honor-item-body">
                  <h3>{item.title}</h3>
                  {item.detail ? <p>{item.detail}</p> : null}
                </div>
              </article>
            ))}
          </div>
          {ASSOCIATION.honors.length > 6 ? (
            <div className="panel-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setShowAllHonors((current) => !current)}
              >
                {showAllHonors ? '收起荣誉' : '查看更多荣誉'}
              </button>
            </div>
          ) : null}
        </section>

        <section className="about-panel">
          <SectionTitle
            index="04"
            title="品牌文化与加入收获"
            desc="这里既关注技术成长，也在意表达、协作和长期投入感。"
          />
          <div className="split-panels">
            <article className="info-card">
              <h3 className="info-card-title">品牌文化与团队氛围</h3>
              <ul className="bullet-list">
                {ASSOCIATION.culture.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="info-card">
              <h3 className="info-card-title">加入后你能收获什么</h3>
              <ul className="bullet-list">
                {ASSOCIATION.benefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <div className="about-cta">
          <p>如果你认同这种节奏，欢迎把你的故事写进报名表。</p>
          <div className="cover-actions">
            <Link className="primary-btn cover-btn" to="/register">
              立即报名
            </Link>
            <Link className="secondary-btn cover-btn" to="/departments">
              查看部门总览
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
