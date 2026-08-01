import { useEffect, useRef, useState } from 'react'

const AUTO_PLAY_DELAY = 7000
const FADE_DURATION = 800

export default function TeamCarousel({ items }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState(null)
  const fadeTimeoutRef = useRef(null)

  const goToIndex = (nextIndex) => {
    if (items.length === 0 || nextIndex === activeIndex) {
      return
    }

    if (fadeTimeoutRef.current) {
      window.clearTimeout(fadeTimeoutRef.current)
    }

    setPreviousIndex(activeIndex)
    setActiveIndex(nextIndex)

    fadeTimeoutRef.current = window.setTimeout(() => {
      setPreviousIndex(null)
      fadeTimeoutRef.current = null
    }, FADE_DURATION)
  }

  useEffect(() => {
    if (items.length <= 1) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      const nextIndex = (activeIndex + 1) % items.length

      if (fadeTimeoutRef.current) {
        window.clearTimeout(fadeTimeoutRef.current)
      }

      setPreviousIndex(activeIndex)
      setActiveIndex(nextIndex)

      fadeTimeoutRef.current = window.setTimeout(() => {
        setPreviousIndex(null)
        fadeTimeoutRef.current = null
      }, FADE_DURATION)
    }, AUTO_PLAY_DELAY)

    return () => window.clearInterval(intervalId)
  }, [activeIndex, items.length])

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        window.clearTimeout(fadeTimeoutRef.current)
      }
    }
  }, [])

  if (items.length === 0) {
    return null
  }

  const activeItem = items[activeIndex]
  const previousItem = previousIndex === null ? null : items[previousIndex]

  return (
    <div className="team-carousel">
      <div className="team-carousel-media">
        {previousItem ? (
          <img
            className="team-carousel-image team-carousel-image-exit"
            src={previousItem.img}
            alt={previousItem.title}
            loading="lazy"
          />
        ) : null}
        <img
          className={`team-carousel-image ${previousItem ? 'team-carousel-image-enter' : 'team-carousel-image-visible'}`}
          key={activeIndex}
          src={activeItem.img}
          alt={activeItem.title}
          loading="lazy"
        />
      </div>

      <div className="team-carousel-content">
        <div className="team-carousel-copy" key={activeIndex}>
          <p className="team-carousel-count">
            {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </p>
          <h3>{activeItem.title}</h3>
          <p>{activeItem.detail}</p>
        </div>

        <div className="team-carousel-controls">
          <button
            aria-label="查看上一项团建活动"
            className="secondary-btn team-carousel-button"
            type="button"
            onClick={() => goToIndex((activeIndex - 1 + items.length) % items.length)}
          >
            上一项
          </button>
          <button
            aria-label="查看下一项团建活动"
            className="secondary-btn team-carousel-button"
            type="button"
            onClick={() => goToIndex((activeIndex + 1) % items.length)}
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
              onClick={() => goToIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
