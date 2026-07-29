import { useState } from 'react'

export default function FaqAccordion({ items, defaultOpen = 0 }) {
  const [openIndex, setOpenIndex] = useState(items.length > 0 ? defaultOpen : null)

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = openIndex === index

        return (
          <article className={`faq-item ${isOpen ? 'is-open' : ''}`} key={item.question}>
            <button
              aria-controls={`faq-panel-${index}`}
              aria-expanded={isOpen}
              className="faq-question"
              type="button"
              onClick={() => setOpenIndex((current) => (current === index ? null : index))}
            >
              <span>{item.question}</span>
              <span className="faq-symbol" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <div className="faq-answer" hidden={!isOpen} id={`faq-panel-${index}`}>
              <p>{item.answer}</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}
