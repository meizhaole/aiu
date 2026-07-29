import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { EMBLEM, NAV_ITEMS } from '../data'

function getNavClassName({ isActive }) {
  return `nav-btn ${isActive ? 'active' : ''}`
}

export default function SiteLayout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="page">
      <header className="hud-topbar">
        <NavLink className="brand" to="/">
          <img className="brand-emblem" src={EMBLEM} alt="AIU" />
          <span className="brand-text">
            <b>AIU</b>
            <i>人工智能协会</i>
          </span>
        </NavLink>

        <nav className="hud-nav" aria-label="主导航">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              className={getNavClassName}
              end={item.end}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink className="nav-btn nav-btn-cta" to="/register">
            立即报名
          </NavLink>
        </nav>
      </header>

      <div className="page-main">
        <Outlet />
      </div>
    </div>
  )
}
