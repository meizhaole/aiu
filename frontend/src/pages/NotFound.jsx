import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="page-stack">
      <section className="about-panel empty-state">
        <p className="eyebrow">404</p>
        <h1>你访问的页面暂时走丢了</h1>
        <p>可以先回到首页继续浏览，也可以直接去协会介绍或部门总览页看看。</p>
        <div className="page-hero-actions">
          <Link className="primary-btn" to="/">
            回到首页
          </Link>
          <Link className="secondary-btn" to="/departments">
            部门总览
          </Link>
        </div>
      </section>
    </main>
  )
}
