import { useMemo, useState } from 'react'
import './App.css'

const INITIAL_FORM = {
  name: '',
  college: '',
  gradeMajorClass: '',
  phone: '',
  firstChoiceDepartment: '',
  secondChoiceDepartment: '',
  isOpenToAdjustment: false,
  hobbiesOrSpecialties: '',
  reasonToJoin: '',
  selfIntroduction: '',
  hasTechExperience: false,
  techExperienceDetails: '',
}

const DEPARTMENT_OPTIONS = ['组织部', '宣传部', '技术部', '外联部', '文艺部', '其他']

function validate(form) {
  const nextErrors = {}

  if (!form.name.trim()) nextErrors.name = '请填写姓名'
  if (!form.college.trim()) nextErrors.college = '请填写学院'
  if (!form.gradeMajorClass.trim()) nextErrors.gradeMajorClass = '请填写年级/专业/班级'
  if (!/^1[3-9]\d{9}$/.test(form.phone.trim())) nextErrors.phone = '请输入正确的中国大陆手机号'
  if (!form.firstChoiceDepartment.trim()) nextErrors.firstChoiceDepartment = '请填写第一志愿部门'
  if (form.hasTechExperience && !form.techExperienceDetails.trim()) {
    nextErrors.techExperienceDetails = '请补充科创经历详情'
  }

  return nextErrors
}

function Field({ label, required, error, children, hint }) {
  return (
    <label className={`field ${error ? 'has-error' : ''}`}>
      <div className="field-label">
        <span>
          {label}
          {required ? <b className="required">*</b> : null}
        </span>
        {hint ? <span className="field-hint">{hint}</span> : null}
      </div>
      {children}
      {error ? <div className="field-error">{error}</div> : null}
    </label>
  )
}

function TextArea({ name, value, onChange, placeholder, rows = 4, maxLength, autoComplete = 'off' }) {
  return (
    <textarea
      id={name}
      name={name}
      autoComplete={autoComplete}
      className="textarea"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
    />
  )
}

function TextInput({ name, value, onChange, placeholder, type = 'text', inputMode, autoComplete = 'off' }) {
  return (
    <input
      id={name}
      name={name}
      autoComplete={autoComplete}
      className="input"
      type={type}
      inputMode={inputMode}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  )
}

function Topbar() {
  return (
    <header className="hud-topbar">
      <div className="hud-left">
        <span className="hud-dot" />
        <span>SYS://AIU_RECRUIT_2026 · 终端在线</span>
      </div>
      <div className="hud-right">
        <span>
          NODE <b>AIU-01</b>
        </span>
        <span>
          VER <b>2.6.0</b>
        </span>
        <span>人工智能协会 · 招新通道</span>
      </div>
    </header>
  )
}

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)
  const [submitError, setSubmitError] = useState('')

  const filledCount = useMemo(() => {
    return [
      form.name,
      form.college,
      form.gradeMajorClass,
      form.phone,
      form.firstChoiceDepartment,
      form.secondChoiceDepartment,
      form.hobbiesOrSpecialties,
      form.reasonToJoin,
      form.selfIntroduction,
      form.techExperienceDetails,
      form.isOpenToAdjustment,
      form.hasTechExperience,
    ].filter(Boolean).length
  }, [form])

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      if (!current[key]) return current
      const nextErrors = { ...current }
      delete nextErrors[key]
      return nextErrors
    })
    setSubmitError('')
  }

  const handleReset = () => {
    setForm(INITIAL_FORM)
    setErrors({})
    setSubmitResult(null)
    setSubmitError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    const payload = {
      name: form.name.trim(),
      college: form.college.trim(),
      gradeMajorClass: form.gradeMajorClass.trim(),
      phone: form.phone.trim(),
      firstChoiceDepartment: form.firstChoiceDepartment.trim(),
      secondChoiceDepartment: form.secondChoiceDepartment.trim(),
      isOpenToAdjustment: form.isOpenToAdjustment,
      hobbiesOrSpecialties: form.hobbiesOrSpecialties.trim(),
      reasonToJoin: form.reasonToJoin.trim(),
      selfIntro: form.selfIntroduction.trim(),
      hasTechExperience: form.hasTechExperience,
      experience: form.hasTechExperience ? form.techExperienceDetails.trim() : '',
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json().catch(() => null)

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || '提交失败，请稍后重试')
      }

      setSubmitResult(result.data)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '提交失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitResult) {
    return (
      <div className="page">
        <Topbar />
        <main className="shell result-shell">
          <section className="hero-card success-card">
            <p className="eyebrow">提交成功</p>
            <h1>你的报名信息已进入审核队列</h1>
            <p className="hero-copy">
              系统已成功接收本次报名。请保留下方编号，后续如需核对信息或补充说明时可以直接使用。
            </p>
            <div className="result-grid">
              <div>
                <span>报名编号</span>
                <strong>#{String(submitResult.id).padStart(4, '0')}</strong>
              </div>
              <div>
                <span>提交时间</span>
                <strong>{new Date(submitResult.created_at).toLocaleString('zh-CN')}</strong>
              </div>
            </div>
            <button type="button" className="primary-btn" onClick={handleReset}>
              继续填写下一份
            </button>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="page">
      <Topbar />
      <main className="shell">
        <section className="hero-card">
          <p className="eyebrow">招新报名 // 2026</p>
          <h1>加入 AIU，与智能未来同行</h1>
          <p className="hero-copy">
            人工智能协会 (AIU) 招新通道已开启。请按字段逐项填写，带星号为必填项，提交后将直达后台数据库进入审核流程。
          </p>
          <div className="hero-note">
            请尽量使用真实、可联系的信息；如果你有科创经历，也欢迎在对应栏目里写得更具体一些。
          </div>
          <div className="hero-stats">
            <div>
              <span>当前进度</span>
              <strong>{filledCount}</strong>
            </div>
            <div>
              <span>必填字段</span>
              <strong>已启用</strong>
            </div>
            <div>
              <span>提交方式</span>
              <strong>/api/register</strong>
            </div>
          </div>
        </section>

        <section className="form-card">
          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="form-banner">
              本页为正式报名表，请确认信息准确后再提交。标记为“可选”的内容可按需填写。
            </div>

            <div className="section-title">
              <h2>基本信息</h2>
              <p>用于识别报名者身份与后续联系。</p>
            </div>

            <div className="grid-2">
              <Field label="姓名" required error={errors.name}>
                <TextInput
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(value) => updateField('name', value)}
                  placeholder="请输入姓名"
                />
              </Field>

              <Field label="学院" required error={errors.college}>
                <TextInput
                  name="college"
                  autoComplete="organization"
                  value={form.college}
                  onChange={(value) => updateField('college', value)}
                  placeholder="例如：计算机学院"
                />
              </Field>

              <Field label="年级 / 专业 / 班级" required error={errors.gradeMajorClass}>
                <TextInput
                  name="gradeMajorClass"
                  autoComplete="off"
                  value={form.gradeMajorClass}
                  onChange={(value) => updateField('gradeMajorClass', value)}
                  placeholder="例如：2024级 软件工程 1班"
                />
              </Field>

              <Field label="手机号" required error={errors.phone}>
                <TextInput
                  name="phone"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(value) => updateField('phone', value)}
                  placeholder="请输入中国大陆手机号"
                  inputMode="tel"
                />
              </Field>
            </div>

            <div className="section-title">
              <h2>部门志愿</h2>
              <p>请根据你的意向选择第一志愿，第二志愿可选。</p>
            </div>

            <div className="grid-2">
              <Field label="第一志愿部门" required error={errors.firstChoiceDepartment}>
                <select
                  id="firstChoiceDepartment"
                  name="firstChoiceDepartment"
                  autoComplete="off"
                  className="input select"
                  value={form.firstChoiceDepartment}
                  onChange={(event) => updateField('firstChoiceDepartment', event.target.value)}
                >
                  <option value="">请选择部门</option>
                  {DEPARTMENT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="第二志愿部门" hint="可选">
                <select
                  id="secondChoiceDepartment"
                  name="secondChoiceDepartment"
                  autoComplete="off"
                  className="input select"
                  value={form.secondChoiceDepartment}
                  onChange={(event) => updateField('secondChoiceDepartment', event.target.value)}
                >
                  <option value="">不填写</option>
                  {DEPARTMENT_OPTIONS.filter((option) => option !== form.firstChoiceDepartment).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="check-group">
              <label className="check-item">
                <input
                  id="isOpenToAdjustment"
                  name="isOpenToAdjustment"
                  autoComplete="off"
                  type="checkbox"
                  checked={form.isOpenToAdjustment}
                  onChange={(event) => updateField('isOpenToAdjustment', event.target.checked)}
                />
                <span>是否服从调剂</span>
              </label>

              <label className="check-item">
                <input
                  id="hasTechExperience"
                  name="hasTechExperience"
                  autoComplete="off"
                  type="checkbox"
                  checked={form.hasTechExperience}
                  onChange={(event) => {
                    const checked = event.target.checked
                    updateField('hasTechExperience', checked)
                    if (!checked) {
                      updateField('techExperienceDetails', '')
                    }
                  }}
                />
                <span>是否有科创经历</span>
              </label>
            </div>

            <div className="section-title">
              <h2>个人补充</h2>
              <p>这些内容将帮助我们更全面地了解你。</p>
            </div>

            <div className="stack">
              <Field label="特长 / 爱好" hint="可选">
                <TextArea
                  name="hobbiesOrSpecialties"
                  autoComplete="off"
                  value={form.hobbiesOrSpecialties}
                  onChange={(value) => updateField('hobbiesOrSpecialties', value)}
                  placeholder="例如：摄影、剪辑、吉他、写作等"
                  rows={3}
                  maxLength={300}
                />
              </Field>

              <Field label="加入原因" hint="可选">
                <TextArea
                  name="reasonToJoin"
                  autoComplete="off"
                  value={form.reasonToJoin}
                  onChange={(value) => updateField('reasonToJoin', value)}
                  placeholder="为什么想加入我们？"
                  rows={4}
                  maxLength={500}
                />
              </Field>

              <Field label="自我介绍" hint="可选">
                <TextArea
                  name="selfIntroduction"
                  autoComplete="off"
                  value={form.selfIntroduction}
                  onChange={(value) => updateField('selfIntroduction', value)}
                  placeholder="简单介绍一下自己"
                  rows={4}
                  maxLength={500}
                />
              </Field>

              <Field
                label="科创经历详情"
                hint={form.hasTechExperience ? '请填写' : '勾选“是否有科创经历”后填写'}
                error={errors.techExperienceDetails}
              >
                <TextArea
                  name="techExperienceDetails"
                  autoComplete="off"
                  value={form.techExperienceDetails}
                  onChange={(value) => updateField('techExperienceDetails', value)}
                  placeholder="例如：参加过哪些比赛、项目、训练营，担任什么角色"
                  rows={5}
                  maxLength={800}
                />
              </Field>
            </div>

            {submitError ? <div className="submit-error">{submitError}</div> : null}

            <div className="actions">
              <button type="button" className="secondary-btn" onClick={handleReset} disabled={isSubmitting}>
                重置
              </button>
              <button type="submit" className="primary-btn" disabled={isSubmitting}>
                {isSubmitting ? '提交中...' : '提交报名'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}