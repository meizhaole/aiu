import { Link } from 'react-router-dom'

export default function PageHero({ eyebrow, title, description, actions = [], children }) {
  return (
    <section className="page-hero">
      <div className="about-panel page-hero-panel">
        <div className="page-hero-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-hero-description">{description}</p>

          {actions.length > 0 ? (
            <div className="page-hero-actions">
              {actions.map((action) => (
                <Link
                  key={`${action.to}-${action.label}`}
                  className={action.variant === 'ghost' ? 'secondary-btn' : 'primary-btn'}
                  to={action.to}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {children ? <div className="page-hero-side">{children}</div> : null}
      </div>
    </section>
  )
}
