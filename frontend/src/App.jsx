import { useState } from 'react'
import './App.css'
import { EMBLEM } from './data'
import Home from './pages/Home'
import About from './pages/About'
import Register from './pages/Register'

const NAV_ITEMS = [
  { key: 'home', label: '首页' },
  { key: 'about', label: '了解我们' },
]

function Topbar({ view, onNavigate }) {
  return (
    <header className="hud-topbar">
      <button type="button" className="brand" onClick={() => onNavigate('home')}>
        <img className="brand-emblem" src={EMBLEM} alt="AIU" />
        <span className="brand-text">
          <b>AIU</b>
          <i>人工智能协会</i>
        </span>
      </button>

      <nav className="hud-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`nav-btn ${view === item.key ? 'active' : ''}`}
            onClick={() => onNavigate(item.key)}
          >
            {item.label}
          </button>
        ))}
        <button type="button" className="nav-btn nav-btn-cta" onClick={() => onNavigate('register')}>
          立即报名
        </button>
      </nav>
    </header>
  )
}

export default function App() {
  const [view, setView] = useState('home')

  const go = (next) => {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page">
      <Topbar view={view} onNavigate={go} />
      {view === 'home' && <Home onNavigate={go} />}
      {view === 'about' && <About onNavigate={go} />}
      {view === 'register' && <Register onNavigate={go} />}
    </div>
  )
}
