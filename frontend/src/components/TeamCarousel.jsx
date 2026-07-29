import { useEffect, useState } from 'react'

export default function TeamCarousel({ items }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (items.length <= 1) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % items.length)
    }, 4500)

    return () => window.clearInterval(intervalId)
  }, [items.length])

  if (items.length === 0) {
    return null
  }

  const activeItem = items[activeIndex]

  return (
    <div className="team-carousel">
      <div className="team-carousel-media">
        <img src={activeItem.img} alt={activeItem.title} loading="lazy" />
      </div>

      <div className="team-carousel-content">
        <p className="team-carousel-count">
          {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </p>
        <h3>{activeItem.title}</h3>
        <p>{activeItem.detail}</p>

        <div className="team-carousel-controls">
          <button
            aria-label="查看上一项团建活动"
            className="secondary-btn team-carousel-button"
            type="button"
            onClick={() => setActiveIndex((current) => (current - 1 + items.length) % items.length)}
          >
            上一项
          </button>
          <button
            aria-label="查看下一项团建活动"
            className="secondary-btn team-carousel-button"
            type="button"
            onClick={() => setActiveIndex((current) => (current + 1) % items.length)}
          >
            下一项
          </button>
        </div>

        <div className="team-carousel-dots" aria-label="团建活动切换">
          {items.map((item, index) => (
            <button
              key={item.title}
              aria-label={`查看 ${item.title}`}
              className={`team-carousel-dot ${index === activeIndex ? 'is-active' : ''}`}
              type="button"
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
