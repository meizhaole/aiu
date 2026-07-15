import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const CLUBS = [
  { id: 'LIT', name: '文学社', en: 'LITERATURE', tag: '书写时代' },
  { id: 'PHO', name: '摄影协会', en: 'PHOTOGRAPHY', tag: '光影捕手' },
  { id: 'MUS', name: '音乐社', en: 'MUSIC', tag: '频率共振' },
  { id: 'DAN', name: '街舞社', en: 'STREET DANCE', tag: '身体即语言' },
  { id: 'COD', name: '编程俱乐部', en: 'CODE', tag: 'bit 之声' },
  { id: 'DEB', name: '辩论队', en: 'DEBATE', tag: '理性与锋芒' },
  { id: 'BSK', name: '篮球社', en: 'BASKETBALL', tag: '第 4 节反超' },
  { id: 'VOL', name: '志愿者协会', en: 'VOLUNTEER', tag: '到现场去' },
  { id: 'DRA', name: '戏剧社', en: 'DRAMA', tag: '第四面墙' },
  { id: 'ANI', name: '动漫社', en: 'ANIMATION', tag: '二三次元通行' },
]

const FIELDS = [
  { key: 'name', label: 'NAME / 姓名' },
  { key: 'studentId', label: 'STUDENT ID / 学号' },
  { key: 'college', label: 'COLLEGE / 学院' },
  { key: 'className', label: 'CLASS / 班级' },
  { key: 'phone', label: 'PHONE / 手机' },
  { key: 'email', label: 'EMAIL / 邮箱' },
  { key: 'club1', label: 'CHOICE 01 / 第一志愿' },
  { key: 'club2', label: 'CHOICE 02 / 第二志愿' },
]

const INITIAL = {
  name: '',
  studentId: '',
  college: '',
  className: '',
  gender: '男',
  phone: '',
  email: '',
  club1: '',
  club2: '',
  skills: '',
  bio: '',
  willing: true,
}

function validate(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'REQUIRED'
  if (!/^\d{6,12}$/.test(v.studentId.trim())) e.studentId = 'EXPECT 6–12 DIGITS'
  if (!v.college.trim()) e.college = 'REQUIRED'
  if (!v.className.trim()) e.className = 'REQUIRED'
  if (!/^1[3-9]\d{9}$/.test(v.phone.trim())) e.phone = 'INVALID PHONE'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'INVALID EMAIL'
  if (!v.club1) e.club1 = 'PICK ONE'
  if (v.club2 && v.club2 === v.club1) e.club2 = 'SAME AS CHOICE 01'
  return e
}

function pad(n) {
  return String(n).padStart(2, '0')
}

function clock() {
  const d = new Date()
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export default function App() {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null)
  const [now, setNow] = useState(clock())
  const [count, setCount] = useState(() =>
    JSON.parse(localStorage.getItem('aiu.signups') || '[]').length,
  )
  const formRef = useRef(null)

  useEffect(() => {
    const t = setInterval(() => setNow(clock()), 1000)
    return () => clearInterval(t)
  }, [])

  const update = (k, val) => {
    setForm((prev) => ({ ...prev, [k]: val }))
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev))
  }

  const filled = useMemo(
    () => FIELDS.filter((f) => String(form[f.key]).trim()).length,
    [form],
  )

  const onSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate(form)
    setErrors(e)
    if (Object.keys(e).length > 0) {
      const firstKey = Object.keys(e)[0]
      const el = formRef.current?.querySelector(`[name="${firstKey}"]`)
      el?.focus()
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSubmitting(true)
    const record = { ...form, submittedAt: new Date().toISOString(), seq: count + 1 }
    try {
      const list = JSON.parse(localStorage.getItem('aiu.signups') || '[]')
      list.push(record)
      localStorage.setItem('aiu.signups', JSON.stringify(list))
      setCount(list.length)
      console.log('%c[LOGGED] entry accepted', 'background:#c8ff00;color:#0a0a0a;font-weight:700;padding:2px 6px;', record)
      await new Promise((r) => setTimeout(r, 900))
      setDone(record)
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setForm(INITIAL)
    setErrors({})
    setDone(null)
  }

  if (done) return <Receipt record={done} onReset={reset} />

  return (
    <div className="page">
      <TopBar now={now} count={count} />

      <Hero filled={filled} total={FIELDS.length} />

      <main className="main" ref={formRef}>
        <aside className="rail">
          <div className="rail-head">
            <span className="dot" /> INDEX
          </div>
          <ul className="club-index">
            {CLUBS.map((c, i) => (
              <li
                key={c.id}
                className={`club-row ${
                  form.club1 === c.name || form.club2 === c.name ? 'is-picked' : ''
                }`}
              >
                <span className="club-num">{pad(i + 1)}</span>
                <div className="club-body">
                  <div className="club-en">{c.en}</div>
                  <div className="club-zh">{c.name}</div>
                </div>
                <span className="club-mark">
                  {form.club1 === c.name ? '01' : form.club2 === c.name ? '02' : ''}
                </span>
              </li>
            ))}
          </ul>
          <div className="rail-foot">
            <span>※ 共 {CLUBS.length} 个社团</span>
            <span>志愿不可重复</span>
          </div>
        </aside>

        <form className="form" onSubmit={onSubmit} noValidate>
          <header className="form-head">
            <h2>
              <span className="hash">№</span> 报名表
              <span className="form-head-en">/ APPLICATION FORM</span>
            </h2>
            <div className="progress">
              <span className="progress-num">
                {String(filled).padStart(2, '0')}/{String(FIELDS.length).padStart(2, '0')}
              </span>
              <span className="progress-bar">
                <i style={{ width: `${(filled / FIELDS.length) * 100}%` }} />
              </span>
            </div>
          </header>

          <Section title="BASIC INFO / 基本信息" no="01">
            <div className="grid-2">
              <TextInput
                no="01" name="name" label="NAME / 姓名" required
                value={form.name} error={errors.name}
                onChange={(v) => update('name', v)} placeholder="张小明"
              />
              <TextInput
                no="02" name="studentId" label="STUDENT ID / 学号" required
                value={form.studentId} error={errors.studentId}
                onChange={(v) => update('studentId', v)} placeholder="2024010101"
                inputMode="numeric"
              />
              <TextInput
                no="03" name="college" label="COLLEGE / 学院" required
                value={form.college} error={errors.college}
                onChange={(v) => update('college', v)} placeholder="计算机学院"
              />
              <TextInput
                no="04" name="className" label="CLASS / 班级" required
                value={form.className} error={errors.className}
                onChange={(v) => update('className', v)} placeholder="计科 2401"
              />
              <div className="cell">
                <Label no="05">GENDER / 性别</Label>
                <div className="seg">
                  {['男', '女'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`seg-item ${form.gender === g ? 'on' : ''}`}
                      onClick={() => update('gender', g)}
                    >
                      [{form.gender === g ? '×' : ' '}] {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section title="CONTACT / 联系方式" no="02">
            <div className="grid-2">
              <TextInput
                no="06" name="phone" label="PHONE / 手机号" required
                value={form.phone} error={errors.phone}
                onChange={(v) => update('phone', v)} placeholder="13800000000"
                inputMode="tel"
              />
              <TextInput
                no="07" name="email" label="EMAIL / 邮箱" required
                value={form.email} error={errors.email}
                onChange={(v) => update('email', v)} placeholder="you@edu.cn"
                type="email"
              />
            </div>
          </Section>

          <Section title="CHOICE / 志愿选择" no="03">
            <div className="grid-2">
              <SelectInput
                no="08" name="club1" label="CHOICE 01 / 第一志愿" required
                value={form.club1} error={errors.club1}
                onChange={(v) => {
                  update('club1', v)
                  if (form.club2 === v) update('club2', '')
                }}
                options={CLUBS}
                placeholder="— 选择社团 —"
              />
              <SelectInput
                no="09" name="club2" label="CHOICE 02 / 第二志愿"
                value={form.club2} error={errors.club2}
                onChange={(v) => update('club2', v)}
                options={CLUBS.filter((c) => c.name !== form.club1)}
                placeholder="— 不填报 —"
                disabled={!form.club1}
              />
            </div>
            <button
              type="button"
              className={`switch ${form.willing ? 'on' : ''}`}
              onClick={() => update('willing', !form.willing)}
            >
              <span className="switch-box">
                {form.willing ? '[×]' : '[ ]'}
              </span>
              <span className="switch-text">
                ACCEPT REASSIGNMENT / 服从调剂
              </span>
            </button>
          </Section>

          <Section title="ABOUT YOU / 更多关于你" no="04">
            <TextInput
              no="10" name="skills" label="SKILLS / 特长"
              value={form.skills}
              onChange={(v) => update('skills', v)}
              placeholder="吉他 / PS / 篮球 / Figma …"
              hint="选填"
            />
            <div className="cell textarea-cell">
              <Label no="11">BIO / 自我介绍 <span className="hint">选填 · 100 字以内</span></Label>
              <textarea
                className="text-area"
                rows={4}
                maxLength={100}
                name="bio"
                placeholder="> 说说你为什么想加入 _"
                value={form.bio}
                onChange={(e) => update('bio', e.target.value)}
              />
              <div className="counter-line">
                {form.bio.length}/100 CHAR
              </div>
            </div>
          </Section>

          <div className="submit-row">
            <p className="notice">
              ※ 提交即同意 <a href="#/agreement">《报名须知》</a>。
              本原型仅作演示，数据保存于本机浏览器 localStorage。
            </p>
            <div className="actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setForm(INITIAL)
                  setErrors({})
                }}
                disabled={submitting}
              >
                [ ESC ] CLEAR
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <span>SAVING<span className="dots">…</span></span>
                ) : (
                  <span>SUBMIT <span className="enter">[↵]</span></span>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>

      <footer className="bottom-bar">
        <span>CLUB.RECRUIT // v1.0.0</span>
        <span className="marquee">
          ▌ EST. 2026 ▌ 10 CLUBS, 1 FORM ▌ BE THERE OR BE SQUARE ▌ LOG = LOCAL ▌
        </span>
        <span>© 校园社团联合会</span>
      </footer>
    </div>
  )
}

/* ---------- Hero ---------- */
function Hero({ filled, total }) {
  return (
    <section className="hero">
      <div className="hero-top">
        <span className="tag">▌ BULLETIN / 招新公告</span>
        <span className="tag">№ 24–AUTUMN</span>
        <span className="tag">STATUS: <i className="live">OPEN</i></span>
      </div>
      <h1 className="hero-title">
        <span>JOIN</span>
        <span>THE <i className="hl">CLUB</i>.</span>
        <span className="hero-zh">找到 <em>属于你</em> 的那群人</span>
      </h1>
      <div className="hero-meta">
        <div>
          <span className="k">10</span>
          <span className="v">CLUBS</span>
        </div>
        <div>
          <span className="k">2</span>
          <span className="v">CHOICES</span>
        </div>
        <div>
          <span className="k">3′</span>
          <span className="v">TO FINISH</span>
        </div>
        <div>
          <span className="k">{String(filled).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
          <span className="v">FILLED</span>
        </div>
      </div>
      <div className="ascii-divider" aria-hidden>
        ═════════════════════════════════════════════════════════════════
      </div>
    </section>
  )
}

function TopBar({ now, count }) {
  return (
    <div className="topbar">
      <div className="topbar-cell">
        <span className="dot" /> SYSTEM ONLINE
      </div>
      <div className="topbar-cell">
        LOG / 本地登记 <strong>{String(count).padStart(3, '0')}</strong> ENTRIES
      </div>
      <div className="topbar-cell clock">
        {now}
      </div>
    </div>
  )
}

/* ---------- Section ---------- */
function Section({ no, title, children }) {
  return (
    <section className="section">
      <header className="section-head">
        <span className="section-no">[{no}]</span>
        <h3 className="section-title">{title}</h3>
        <span className="section-line" />
      </header>
      <div className="section-body">{children}</div>
    </section>
  )
}

function Label({ no, children }) {
  return (
    <span className="label">
      {no && <span className="label-no">[{no}]→</span>}
      {children}
    </span>
  )
}

function TextInput({ no, name, label, value, onChange, error, required, placeholder, hint, type = 'text', inputMode }) {
  return (
    <label className={`cell ${error ? 'has-err' : ''}`} data-invalid={error ? 'true' : 'false'}>
      <Label no={no}>
        {label} {required && <span className="req">*</span>}
        {hint && <span className="hint"> · {hint}</span>}
      </Label>
      <div className="input-wrap">
        <span className="prompt">&gt;</span>
        <input
          name={name}
          type={type}
          inputMode={inputMode}
          className="text-input"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {error && (
        <span className="err">
          <span className="err-mark">[!]</span> {error}
        </span>
      )}
    </label>
  )
}

function SelectInput({ no, name, label, value, onChange, error, required, options, placeholder, disabled }) {
  return (
    <label className={`cell ${error ? 'has-err' : ''}`}>
      <Label no={no}>
        {label} {required && <span className="req">*</span>}
      </Label>
      <div className="input-wrap select-wrap">
        <span className="prompt">▸</span>
        <select
          name={name}
          className="select"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.id} value={o.name}>
              {o.name} · {o.en}
            </option>
          ))}
        </select>
        <span className="select-bracket">▼</span>
      </div>
      {error && (
        <span className="err">
          <span className="err-mark">[!]</span> {error}
        </span>
      )}
    </label>
  )
}

/* ---------- Receipt ---------- */
function Receipt({ record, onReset }) {
  const club = CLUBS.find((c) => c.name === record.club1)
  return (
    <div className="page receipt-page">
      <div className="topbar">
        <div className="topbar-cell"><span className="dot" /> ENTRY ACCEPTED</div>
        <div className="topbar-cell">SEQ / <strong>#{String(record.seq).padStart(4, '0')}</strong></div>
        <div className="topbar-cell">{new Date(record.submittedAt).toLocaleString('zh-CN')}</div>
      </div>

      <main className="receipt">
        <div className="receipt-flash">
          <span className="stamp">LOGGED.</span>
          <span className="stamp-zh">登 记 完 成</span>
        </div>

        <div className="ticket">
          <div className="ticket-top">
            <span>▌ CLUB.RECRUIT</span>
            <span>№ {String(record.seq).padStart(4, '0')}</span>
          </div>
          <h2 className="ticket-title">
            WELCOME, <i>{record.name.toUpperCase()}</i>.
          </h2>
          <p className="ticket-sub">
            已收到你对 <strong>{club?.name}（{club?.en}）</strong> 的报名申请。
            <br />
            结果将于 7 个工作日内通过短信发送至 {record.phone}。
          </p>

          <dl className="ticket-grid">
            <div><dt>STUDENT ID</dt><dd>{record.studentId}</dd></div>
            <div><dt>COLLEGE/CLASS</dt><dd>{record.college} / {record.className}</dd></div>
            <div><dt>CHOICE 01</dt><dd>{record.club1}</dd></div>
            <div><dt>CHOICE 02</dt><dd>{record.club2 || '——'}</dd></div>
            <div><dt>REASSIGN</dt><dd>{record.willing ? 'YES' : 'NO'}</dd></div>
            <div><dt>SEQ</dt><dd>#{String(record.seq).padStart(4, '0')}</dd></div>
          </dl>

          <div className="ticket-perf" aria-hidden>
            • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •
          </div>

          <div className="ticket-foot">
            <span>※ 请妥善保存，作为现场签到凭证</span>
            <span>SIGNED BY / 校园社团联合会</span>
          </div>
        </div>

        <div className="receipt-actions">
          <a
            className="btn btn-ghost"
            href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(record, null, 2))}`}
            download={`signup-${record.studentId}.json`}
          >
            [ ↓ ] EXPORT .JSON
          </a>
          <button type="button" className="btn btn-primary" onClick={onReset}>
            AGAIN [↻]
          </button>
        </div>
      </main>
    </div>
  )
}
