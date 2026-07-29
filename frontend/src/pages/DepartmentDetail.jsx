import { Link, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionTitle from '../components/SectionTitle'
import { DEPARTMENT_MAP } from '../data'

export default function DepartmentDetail() {
  const { departmentId } = useParams()
  const department = DEPARTMENT_MAP[departmentId]

  if (!department) {
    return (
      <main className="page-stack">
        <section className="about-panel empty-state">
          <p className="eyebrow">未找到部门</p>
          <h1>这个部门页面暂时不存在</h1>
          <p>
            可能是链接有误，或者你访问的部门还没有公开展示。可以先回到部门总览重新选择。
          </p>
          <div className="page-hero-actions">
            <Link className="primary-btn" to="/departments">
              返回部门总览
            </Link>
            <Link className="secondary-btn" to="/">
              回到首页
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <>
      <PageHero
        eyebrow="部门详情"
        title={department.name}
        description={department.heroIntro}
        actions={[
          { to: '/departments', label: '返回部门总览', variant: 'ghost' },
          { to: '/register', label: '报名加入' },
        ]}
      >
        <div className="dept-hero-card">
          <div className="dept-card-logo dept-card-logo-hero">
            <img src={department.logo} alt={`${department.name} logo`} />
          </div>
          <div className="dept-card-tags">
            {department.tags.map((tag) => (
              <span className="dept-card-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <a
            className="secondary-btn dept-external-link"
            href={department.link}
            rel="noopener noreferrer"
            target="_blank"
          >
            查看招新推文
          </a>
        </div>
      </PageHero>

      <main className="page-stack">
        <div className="split-panels">
          <section className="about-panel about-panel-compact">
            <SectionTitle index="01" title="我们主要在做什么" />
            <ul className="bullet-list">
              {department.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="about-panel about-panel-compact">
            <SectionTitle index="02" title="适合怎样的你" />
            <ul className="bullet-list">
              {department.fitFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="about-panel">
          <SectionTitle
            index="03"
            title="成长收获"
            desc="这不只是一个岗位，也是一条清晰的成长路径。"
          />
          <div className="feature-grid">
            {department.growthPoints.map((item) => (
              <article className="feature-card" key={item}>
                <h3>你会逐渐掌握</h3>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-panel">
          <SectionTitle
            index="04"
            title="项目示例"
            desc="这些事情，就是你未来可能真正参与到的内容。"
          />
          <div className="feature-grid">
            {department.projects.map((project) => (
              <article className="feature-card feature-card-accent" key={project.name}>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="about-cta">
          <p>如果这个方向让你有共鸣，现在就去报名。</p>
          <div className="cover-actions">
            <Link className="primary-btn cover-btn" to="/register">
              报名 {department.name}
            </Link>
            <Link className="secondary-btn cover-btn" to="/contact">
              先联系咨询
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
