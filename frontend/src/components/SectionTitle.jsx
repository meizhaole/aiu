export default function SectionTitle({ index, title, desc }) {
  return (
    <div className="section-title about-section-title">
      <h2>
        {index ? <span className="about-index">{index}</span> : null}
        {title}
      </h2>
      {desc ? <p>{desc}</p> : null}
    </div>
  )
}
