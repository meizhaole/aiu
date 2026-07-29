import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionTitle from '../components/SectionTitle'
import { PROCESS_STEPS } from '../data'

const PROCESS_TIPS = [
  '面试和体验任务更重视你的思考方式、热情和表达，不要求你已经非常成熟。',
  '如果你对部门选择还不确定，也可以在交流过程中和我们一起再判断。',
  '录取后会有老成员带你熟悉节奏，不会把新人直接扔进复杂任务里。',
]

export default function Process() {
  return (
    <>
      <PageHero
        eyebrow="招新流程"
        title="我们希望你在加入前，就能感受到清晰、友好和被尊重"
        description="我们不希望把招新做成高压筛选，而是希望它成为一次双向了解的过程。"
        actions={[
          { to: '/register', label: '立即报名' },
          { to: '/faq', label: '先看 FAQ', variant: 'ghost' },
        ]}
      />

      <main className="page-stack">
        <section className="about-panel">
          <SectionTitle
            index="01"
            title="流程一览"
            desc="从报名到加入，每一步都尽量轻量而透明。"
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
        </section>

        <div className="split-panels">
          <section className="about-panel about-panel-compact">
            <SectionTitle
              index="02"
              title="给报名同学的小建议"
              desc="最好的准备方式不是包装自己，而是认真思考你的兴趣与期待。"
            />
            <ul className="bullet-list">
              {PROCESS_TIPS.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </section>

          <section className="about-panel about-panel-compact">
            <SectionTitle
              index="03"
              title="如果你已经准备好了"
              desc="现在就可以把你的兴趣、方向和期待告诉我们。"
            />
            <p className="info-copy">
              你不需要一开始就“足够厉害”，只要愿意尝试、愿意表达、愿意和团队一起做成一些事情，我们就很期待认识你。
            </p>
            <div className="panel-actions">
              <Link className="primary-btn" to="/register">
                去填写报名表
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
