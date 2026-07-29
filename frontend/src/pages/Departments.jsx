import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionTitle from '../components/SectionTitle'
import { DEPARTMENTS } from '../data'

export default function Departments() {
  return (
    <>
      <PageHero
        eyebrow="部门总览"
        title="先认识每个部门的工作方式，再选择最适合你的方向"
        description="协会的四个部门分别对应组织节奏、项目实现、视觉传播和资源链接。你不需要一开始就完全确定，但可以先从最想尝试的方向走近一步。"
        actions={[
          { to: '/register', label: '直接报名' },
          { to: '/contact', label: '先联系咨询', variant: 'ghost' },
        ]}
      />

      <main className="page-stack">
        <section className="about-panel">
          <SectionTitle
            index="01"
            title="四个方向"
            desc="点击任意部门卡片，你都可以进入单独的详情页查看职责、适合人群、成长收获和项目示例。"
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
                <span className="dept-card-cta">进入详情页 →</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="split-panels">
          <section className="about-panel about-panel-compact">
            <SectionTitle
              index="02"
              title="如果你还不确定选哪个部门"
              desc="先从最愿意长期投入的方向选起，而不是只看哪个听起来更“厉害”。"
            />
            <ul className="bullet-list">
              <li>先想清楚你更喜欢组织事情、做作品、做传播，还是去链接更多资源。</li>
              <li>看看你希望自己在一个学期后，在哪种能力上最有明显成长感。</li>
              <li>报名后也可以在交流中调整，我们更关心你是否适合，而不是你是否一次选对。</li>
            </ul>
          </section>

          <section className="about-panel about-panel-compact">
            <SectionTitle
              index="03"
              title="部门之间并不是割裂的"
              desc="你加入的是一个部门，但会在合作中认识整个协会。"
            />
            <p className="info-copy">
              一场完整活动可能会同时需要运营部的节奏统筹、创智部的页面支持、宣传部的视觉包装和外联部的资源协调。真实协作本身，就是 AIU 最重要的学习场景之一。
            </p>
            <div className="panel-actions">
              <Link className="secondary-btn" to="/process">
                查看招新流程
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
