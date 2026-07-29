import { Link } from 'react-router-dom'
import FaqAccordion from '../components/FaqAccordion'
import PageHero from '../components/PageHero'
import SectionTitle from '../components/SectionTitle'
import { FAQS } from '../data'

export default function Faq() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="把常见顾虑提前说清楚，让你做决定时更轻松"
        description="以下是招新阶段最常被问到的问题。如果你还有自己的顾虑，也欢迎直接通过联系页面找到我们。"
        actions={[
          { to: '/register', label: '我已经想好了，去报名' },
          { to: '/contact', label: '我还有别的问题', variant: 'ghost' },
        ]}
      />

      <main className="page-stack">
        <section className="about-panel">
          <SectionTitle
            index="01"
            title="常见问题"
            desc="如果你的问题不在列表里，也欢迎直接联系协会。真实沟通往往比猜测更快。"
          />
          <FaqAccordion items={FAQS} />
        </section>

        <div className="about-cta">
          <p>还是拿不准？那就再看看协会介绍和部门详情。</p>
          <div className="cover-actions">
            <Link className="secondary-btn cover-btn" to="/about">
              查看协会介绍
            </Link>
            <Link className="primary-btn cover-btn" to="/departments">
              查看部门总览
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
