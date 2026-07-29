import PageHero from '../components/PageHero'
import SectionTitle from '../components/SectionTitle'
import { CONTACT_INFO } from '../data'

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="联系我们"
        title="如果你想进一步了解协会，欢迎直接来找我们"
        description={CONTACT_INFO.description}
        actions={[
          { to: '/register', label: '直接报名' },
          { to: '/about', label: '先看协会介绍', variant: 'ghost' },
        ]}
      />

      <main className="page-stack">
        <section className="about-panel">
          <SectionTitle
            index="01"
            title="招新群"
            desc="扫码加入招新群，获取最新通知与后续安排。"
          />
          <figure className="contact-image-card">
            <img className="contact-image" src="/image/招新群.jpg" alt="人工智能协会招新群" />
          </figure>
        </section>

        <div className="split-panels">
          <section className="about-panel about-panel-compact">
            <SectionTitle
              index="02"
              title="适合什么时候联系"
              desc="这些情况都很适合先来和我们聊一聊。"
            />
            <ul className="bullet-list">
              <li>想进一步了解协会氛围，但还没准备好报名时。</li>
              <li>对部门方向不确定，希望有人帮你一起判断时。</li>
              <li>想参观实验室、了解活动安排或咨询合作机会时。</li>
            </ul>
          </section>

          <section className="about-panel about-panel-compact">
            <SectionTitle
              index="03"
              title="补充信息"
              desc="如果你更习惯线下交流，也欢迎在值班时间到实验室来看看。"
            />
            <p className="info-copy">{CONTACT_INFO.socialNote}</p>
            <p className="info-copy">
              和学长学姐面对面聊一聊，通常会比只看文字更容易感受到协会的真实节奏。
            </p>
          </section>
        </div>
      </main>
    </>
  )
}
