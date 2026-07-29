import { ASSOCIATION, EMBLEM } from '../data'

export default function Home({ onNavigate }) {
  return (
    <main className="cover">
      <section className="cover-left">
        <p className="cover-eyebrow">{ASSOCIATION.enName} · STUDENT TECH SOCIETY</p>
        <h1 className="cover-title">{ASSOCIATION.name}</h1>
        <p className="cover-tagline">{ASSOCIATION.tagline}</p>
        <p className="cover-intro">{ASSOCIATION.intro}</p>

        <div className="cover-actions">
          <button type="button" className="primary-btn cover-btn" onClick={() => onNavigate('register')}>
            立即报名
          </button>
          <button type="button" className="secondary-btn cover-btn" onClick={() => onNavigate('about')}>
            了解我们
          </button>
        </div>
      </section>

      <section className="cover-right">
        <div className="emblem-ring" aria-hidden="true" />
        <img className="cover-emblem" src={EMBLEM} alt="人工智能协会会徽" />
      </section>
    </main>
  )
}
