import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { RansomText } from '../components/RansomText'
import {
  about, contact, experience, menuItems, profile, projects, resume, skills,
  testimonials, tools, type MenuId, type Project, type Strength,
} from '../content'
import { useSiteSettings } from '../settings'
import { publicAssetUrl } from '../urls'
import './sections.css'

function Reveal({ children, index = 0, className = '' }: { children: ReactNode; index?: number; className?: string }) {
  const { reducedMotion } = useSiteSettings()
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, x: index % 2 ? 54 : -54, rotate: index % 2 ? 2 : -2 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={reducedMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 500, damping: 27, delay: Math.min(index, 8) * 0.06 }}
    >
      {children}
    </motion.div>
  )
}

function SectionShell({ sectionId, children, title, subtitle, backTo = '/' }: {
  sectionId: MenuId
  children: ReactNode
  title?: string
  subtitle?: string
  backTo?: string
}) {
  const item = menuItems.find(entry => entry.id === sectionId) ?? menuItems[0]

  return (
    <main className={`section-screen section-${sectionId}`} id="main-content">
      <div className="section-backdrop" aria-hidden="true" />
      <div className="section-shard section-shard-one" aria-hidden="true" />
      <div className="section-shard section-shard-two" aria-hidden="true" />
      <div className="section-frame">
        <header className="section-header">
          <div className="section-topline">
            <Link to="/" data-back className="section-home-link"><span aria-hidden="true">←</span><span>HOME / OVERVIEW</span></Link>
            <span className="section-topline-context">{item.section.toUpperCase()} / {item.number}</span>
          </div>
          <Reveal className="section-title-wrap">
            <h1 className="section-title"><RansomText text={(title ?? item.section).toUpperCase()} seed={Number(item.number)} /></h1>
          </Reveal>
          <p className="section-subtitle">{subtitle ?? item.description}</p>
        </header>

        <div className="section-body">{children}</div>

        <aside className="section-rail" aria-label="Quick navigation">
          <div className="section-rail-heading">EXPLORE PORTFOLIO</div>
          <Link to="/" data-back className="section-rail-home"><span aria-hidden="true">←</span><strong>Home</strong><small>Overview</small></Link>
          <nav aria-label="Portfolio sections">
            {menuItems.map(entry => (
              <Link
                key={entry.id}
                to={entry.path}
                aria-current={entry.id === sectionId && backTo === '/' ? 'page' : undefined}
                className={`section-rail-link ${entry.id === sectionId ? 'is-active' : ''}`}
              >
                <span className="section-rail-number" aria-hidden="true">{entry.number}</span>
                <span className="section-rail-copy"><strong>{entry.section}</strong><small>{entry.label}</small></span>
              </Link>
            ))}
          </nav>
        </aside>

        <footer className="section-footer">
          <span className="section-footer-help">{item.description}</span>
          <Link to={backTo} data-back className="section-back-link" aria-label={backTo === '/' ? 'Back to home overview' : 'Back to projects'}>
            <kbd>ESC</kbd><span>{backTo === '/' ? 'BACK TO HOME' : 'BACK TO PROJECTS'}</span><span aria-hidden="true">←</span>
          </Link>
        </footer>
      </div>
    </main>
  )
}

function ProjectVisual({ project, large = false }: { project: Project; large?: boolean }) {
  return (
    <div className={`project-visual project-visual-${project.visual} ${large ? 'project-visual-large' : ''}`} aria-hidden="true">
      <span className="project-visual-grid" />
      <span className="project-visual-disc" />
      <span className="project-visual-line" />
      <span className="project-visual-star">✦</span>
      <span className="project-visual-index">{project.number}</span>
    </div>
  )
}

function MissionSection() {
  const filters = ['ALL', ...new Set(projects.map(project => project.category.toUpperCase()))]
  const hasSampleProjects = projects.some(project => project.sample)
  const [filter, setFilter] = useState('ALL')
  const visibleProjects = filter === 'ALL' ? projects : projects.filter(project => project.category.toUpperCase() === filter)

  return (
    <div className="mission-section">
      <Reveal className="section-intro-panel">
        <span className="section-kicker">SELECT A MISSION</span>
        <p>{hasSampleProjects
          ? 'Sample case studies are marked below. Replace their details and outcomes with your real work.'
          : 'Explore selected work, the challenge behind each project, and the outcome.'}</p>
      </Reveal>
      <div className="project-filters" role="group" aria-label="Filter projects">
        {filters.map(category => (
          <button key={category} type="button" className={`project-filter ${filter === category ? 'is-active' : ''}`} aria-pressed={filter === category} onClick={() => setFilter(category)}>
            <span>{category}</span>
          </button>
        ))}
      </div>
      <div className="project-grid">
        {visibleProjects.map((project, index) => (
          <Reveal key={project.slug} index={index} className="project-card-wrap">
            <Link to={`/mission/${project.slug}`} className="project-card">
              <ProjectVisual project={project} />
              <div className="project-card-body">
                <div className="project-card-meta"><span>MISSION {project.number}</span><span>{project.year}</span></div>
                <h2>{project.title}</h2>
                <p>{project.summary}</p>
                <div className="project-card-bottom">
                  <span className="project-sample-tag">{project.sample ? 'SAMPLE PROJECT' : project.status}</span>
                  <span aria-hidden="true">↗</span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function polygonPoints(count: number, radius: number, scores?: number[]) {
  return Array.from({ length: count }, (_, index) => {
    const angle = (-Math.PI / 2) + (index * Math.PI * 2 / count)
    const distance = radius * (scores?.[index] ?? 1)
    return `${160 + Math.cos(angle) * distance},${160 + Math.sin(angle) * distance}`
  }).join(' ')
}

function RadarChart({ strengths }: { strengths: Strength[] }) {
  const { reducedMotion } = useSiteSettings()
  const scores = strengths.map(strength => Math.max(0, Math.min(5, strength.score)) / 5)
  return (
    <div className="radar-panel">
      <span className="section-kicker">CORE STRENGTHS</span>
      <svg className="radar-chart" viewBox="0 0 320 320" role="img" aria-label={`Strength levels: ${strengths.map(item => `${item.label} ${item.score} of 5`).join(', ')}`}>
        {[0.25, 0.5, 0.75, 1].map(scale => <polygon key={scale} points={polygonPoints(5, 111 * scale)} className="radar-ring" />)}
        {strengths.map((strength, index) => {
          const angle = (-Math.PI / 2) + (index * Math.PI * 2 / strengths.length)
          return <line key={strength.label} x1="160" y1="160" x2={160 + Math.cos(angle) * 111} y2={160 + Math.sin(angle) * 111} className="radar-axis" />
        })}
        <motion.polygon
          points={polygonPoints(5, 111, scores)}
          className="radar-value"
          style={{ transformOrigin: '160px 160px' }}
          initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reducedMotion ? { duration: 0.15 } : { duration: 0.48, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
        <circle cx="160" cy="160" r="5" fill="var(--black)" />
      </svg>
      <ul className="radar-legend">
        {strengths.map(strength => <li key={strength.label}><span>{strength.label}</span><strong>{String(strength.score).padStart(2, '0')} / 05</strong></li>)}
      </ul>
    </div>
  )
}

function PersonaSection() {
  return (
    <div className="persona-grid">
      <Reveal className="persona-portrait-panel">
        <img src={publicAssetUrl(profile.portraitUrl || 'portrait-placeholder.svg')} alt={profile.portraitUrl ? `Portrait of ${profile.name}` : 'Placeholder portrait silhouette'} loading="lazy" className="persona-portrait-image" />
        <span className="persona-portrait-stamp">{profile.portraitUrl ? 'PERSONA / PORTRAIT' : 'PORTRAIT / ADD YOUR PHOTO'}</span>
      </Reveal>
      <Reveal index={1} className="persona-copy-panel">
        <span className="section-kicker">{about.eyebrow}</span>
        <h2>{about.heading}</h2>
        {about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        <div className="persona-facts">
          {about.facts.map(fact => <div key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong></div>)}
        </div>
      </Reveal>
      <Reveal index={2} className="persona-radar-wrap"><RadarChart strengths={about.strengths} /></Reveal>
    </div>
  )
}

function SkillsSection() {
  const [selected, setSelected] = useState(0)
  const rowRefs = useRef<HTMLButtonElement[]>([])
  const selectWithArrow = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const next = (index + (event.key === 'ArrowDown' ? 1 : -1) + skills.length) % skills.length
    setSelected(next)
    rowRefs.current[next]?.focus()
  }
  return (
    <div className="skills-section">
      <Reveal className="section-intro-panel"><span className="section-kicker">ABILITY LIST</span><p>Select a row to read more about each ability.</p></Reveal>
      <div className="skills-list" role="group" aria-label="Skills">
        {skills.map((skill, index) => (
          <Reveal key={skill.name} index={index}>
            <button
              ref={node => { if (node) rowRefs.current[index] = node }}
              type="button"
              className={`skill-row ${selected === index ? 'is-selected' : ''}`}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
              onFocus={() => setSelected(index)}
              onKeyDown={event => selectWithArrow(event, index)}
            >
              <span className="skill-glyph" aria-hidden="true">{skill.glyph}</span>
              <span className="skill-name"><strong>{skill.name}</strong><small>{skill.category}</small></span>
              <SegmentGauge level={skill.level} label={`Level ${skill.level} of 5`} />
              <span className="skill-rank">LV <StepCount value={skill.level} /></span>
            </button>
          </Reveal>
        ))}
      </div>
      <div className="skill-help" role="status" aria-live="polite"><span>HELP</span><p>{skills[selected].description}</p></div>
    </div>
  )
}

function SegmentGauge({ level, label }: { level: number; label: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const { reducedMotion } = useSiteSettings()
  return <span ref={ref} className={`skill-segments ${inView || reducedMotion ? 'is-visible' : ''}`} aria-label={label}>
    {Array.from({ length: 5 }, (_, segment) => <span key={segment} className={segment < level ? 'is-filled' : ''} style={{ animationDelay: `${segment * 70}ms` }} />)}
  </span>
}

function StepCount({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const { reducedMotion } = useSiteSettings()
  const [display, setDisplay] = useState(reducedMotion ? value : 0)
  useEffect(() => {
    if (!inView || reducedMotion) return
    let current = 0
    const timer = window.setInterval(() => {
      current += 1
      setDisplay(Math.min(current, value))
      if (current >= value) window.clearInterval(timer)
    }, 75)
    return () => window.clearInterval(timer)
  }, [inView, reducedMotion, value])
  return <span ref={ref}>{String(reducedMotion ? value : display).padStart(2, '0')}</span>
}

function ToolsSection() {
  return (
    <div className="tools-section">
      <Reveal className="section-intro-panel"><span className="section-kicker">INVENTORY / TOOLS</span><p>Focus each item to see how it fits into the work.</p></Reveal>
      <div className="tools-grid">
        {tools.map((tool, index) => (
          <Reveal key={tool.name} index={index}>
            <button type="button" className="tool-tile" aria-describedby={`tool-note-${index}`}>
              <span className="tool-category">{tool.group}</span>
              <span className="tool-mark" aria-hidden="true">{tool.mark}</span>
              <strong>{tool.name}</strong>
              <span className="tool-tooltip" id={`tool-note-${index}`} role="tooltip">{tool.note}</span>
            </button>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function EquipSection() {
  const hasResume = Boolean(profile.resumeUrl.trim())
  return (
    <div className="equip-section">
      <Reveal className="equip-card">
        <div className="equip-card-top"><span>LOADOUT / 01</span><span>CV</span></div>
        <div className="equip-emblem" aria-hidden="true">★</div>
        <div className="equip-card-copy">
          <span className="section-kicker">YOUR NEXT MOVE</span>
          <h2>{resume.heading}</h2>
          <p>{resume.summary}</p>
          <ul>{resume.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
          {hasResume
            ? <a className="section-action" href={publicAssetUrl(profile.resumeUrl)} download><span>DOWNLOAD CV</span><span aria-hidden="true">↓</span></a>
            : <a className="section-action" href={`mailto:${profile.email}?subject=${encodeURIComponent('CV request')}`}><span>REQUEST MY CV</span><span aria-hidden="true">↗</span></a>}
          {!hasResume && <small className="equip-note">Direct download coming soon. A request opens your email app.</small>}
        </div>
      </Reveal>
    </div>
  )
}

function PartySection() {
  return (
    <div className="party-section">
      <Reveal className="section-intro-panel"><span className="section-kicker">ROSTER / EXPERIENCE</span><p>The roles, teams, and milestones that shaped my work.</p></Reveal>
      <ol className="experience-list">
        {experience.map((entry, index) => (
          <li key={`${entry.period}-${index}`}>
            <Reveal index={index} className="experience-entry">
              <div className="experience-level"><span>LV</span><strong>{entry.level}</strong></div>
              <div className="experience-main"><span className="experience-period">{entry.period}</span><h2>{entry.role}</h2><strong>{entry.company}</strong><p>{entry.description}</p></div>
              <span className="experience-location">{entry.location}</span>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  )
}

function CooperationSection() {
  const hasSampleTestimonials = testimonials.some(testimonial => testimonial.sample)
  return (
    <div className="cooperation-section">
      <Reveal className="section-intro-panel"><span className="section-kicker">WORDS FROM ALLIES</span><p>{hasSampleTestimonials
        ? 'Sample cards are marked below. Replace them with approved quotes and names before publishing.'
        : 'Thoughts from people I have worked with.'}</p></Reveal>
      <div className="testimonial-grid">
        {testimonials.map((testimonial, index) => (
          <Reveal key={index} index={index} className="testimonial-card">
            <div className="testimonial-top"><span>CO-OP / {String(index + 1).padStart(2, '0')}</span><span>{testimonial.sample ? 'EXAMPLE' : 'ENDORSEMENT'}</span></div>
            <blockquote>“{testimonial.quote}”</blockquote>
            <div className="testimonial-person"><strong>{testimonial.name}</strong><span>{testimonial.role}</span></div>
            <div className="testimonial-rank"><span>RANK {testimonial.sample ? 'PENDING' : `${testimonial.rank}/5`}</span><div aria-label={testimonial.sample ? 'Rank pending' : `Rank ${testimonial.rank} of 5`}>{Array.from({ length: 5 }, (_, segment) => <span key={segment} className={segment < testimonial.rank ? 'is-filled' : ''}>★</span>)}</div></div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function ContactSection() {
  const { reducedMotion } = useSiteSettings()
  const [status, setStatus] = useState<'idle' | 'opening' | 'sending' | 'received' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    if (profile.contactEndpoint.trim()) {
      setStatus('sending')
      try {
        const response = await fetch(profile.contactEndpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
        })
        if (!response.ok) throw new Error('Message service unavailable')
        setStatus('received')
        setForm({ name: '', email: '', message: '' })
      } catch {
        setErrorMessage('The message could not be sent. Please email me directly instead.')
        setStatus('error')
      }
      return
    }
    const body = `From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    const href = `mailto:${profile.email}?subject=${encodeURIComponent(contact.subject)}&body=${encodeURIComponent(body)}`
    setStatus('opening')
    window.location.href = href
  }

  return (
    <div className="contact-section">
      <Reveal className="contact-aside"><span className="section-kicker">MAKE CONTACT</span><h2>{contact.heading}</h2><p>{contact.intro}</p><span className="contact-availability">{contact.availability}</span><a href={`mailto:${profile.email}`} className="contact-email">{profile.email} ↗</a></Reveal>
      <motion.div
        className="calling-card"
        initial={reducedMotion ? false : { opacity: 0, x: 90, rotate: 18, scale: 0.8, clipPath: 'polygon(0 0,100% 0,100% 20%,0 20%)' }}
        animate={{ opacity: 1, x: 0, rotate: -1.5, scale: 1, clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)' }}
        transition={reducedMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 360, damping: 20, delay: 0.12, clipPath: { duration: 0.5, delay: 0.35 } }}
      >
        <div className="calling-card-head"><span>CALLING CARD</span><span>NO. 08</span></div>
        <form onSubmit={submit}>
          <label htmlFor="contact-name">YOUR NAME<input id="contact-name" name="name" autoComplete="name" required maxLength={100} value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Your name" /></label>
          <label htmlFor="contact-email">YOUR EMAIL<input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={160} value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label>
          <label htmlFor="contact-message">YOUR MESSAGE<textarea id="contact-message" name="message" required maxLength={5000} rows={5} value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} placeholder="Tell me what you're thinking..." /></label>
          <button type="submit" className="section-action" disabled={status === 'sending'}><span>{status === 'sending' ? 'SENDING...' : 'SEND THE CARD'}</span><span aria-hidden="true">↗</span></button>
        </form>
        {status === 'received' && <div className="contact-stamp" role="status">RECEIVED</div>}
        {status === 'opening' && <p className="contact-form-status" role="status">Your email app is opening. Send the message there to finish.</p>}
        {status === 'error' && <p className="contact-form-status is-error" role="alert">{errorMessage}</p>}
        {status === 'idle' && !profile.contactEndpoint && <p className="contact-form-status">This form opens your email app to send the message.</p>}
      </motion.div>
    </div>
  )
}

function SettingRow({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <div className="setting-row"><div><h2>{title}</h2><p>{description}</p></div><div className="setting-control">{children}</div></div>
}

function SystemSection() {
  const { sound, motion: motionLevel, highContrast, setSound, setMotion, setHighContrast } = useSiteSettings()
  return (
    <div className="system-section">
      <Reveal className="section-intro-panel"><span className="section-kicker">PERSONALIZE THE INTERFACE</span><p>Your choices are saved in this browser. Your device’s reduced motion setting also takes priority.</p></Reveal>
      <Reveal index={1} className="settings-panel">
        <SettingRow title="Sound" description="Optional synthesized interface clicks. Off by default.">
          <button type="button" className={`setting-toggle ${sound ? 'is-on' : ''}`} role="switch" aria-checked={sound} aria-label="Sound" onClick={() => setSound(!sound)}><span>{sound ? 'ON' : 'OFF'}</span><i aria-hidden="true" /></button>
        </SettingRow>
        <SettingRow title="Motion" description="Choose the intensity of transitions and ambient movement.">
          <div className="setting-choice" role="group" aria-label="Motion intensity">
            <button type="button" aria-pressed={motionLevel === 'full'} className={motionLevel === 'full' ? 'is-active' : ''} onClick={() => setMotion('full')}>FULL</button>
            <button type="button" aria-pressed={motionLevel === 'reduced'} className={motionLevel === 'reduced' ? 'is-active' : ''} onClick={() => setMotion('reduced')}>REDUCED</button>
          </div>
        </SettingRow>
        <SettingRow title="High contrast" description="Increase separation between ink, paper, and red.">
          <button type="button" className={`setting-toggle ${highContrast ? 'is-on' : ''}`} role="switch" aria-checked={highContrast} aria-label="High contrast" onClick={() => setHighContrast(!highContrast)}><span>{highContrast ? 'ON' : 'OFF'}</span><i aria-hidden="true" /></button>
        </SettingRow>
      </Reveal>
    </div>
  )
}

export function SectionPage({ sectionId }: { sectionId: MenuId }) {
  let section: ReactNode
  switch (sectionId) {
    case 'mission': section = <MissionSection />; break
    case 'persona': section = <PersonaSection />; break
    case 'skill': section = <SkillsSection />; break
    case 'item': section = <ToolsSection />; break
    case 'equip': section = <EquipSection />; break
    case 'party': section = <PartySection />; break
    case 'cooperation': section = <CooperationSection />; break
    case 'contact': section = <ContactSection />; break
    case 'system': section = <SystemSection />; break
  }
  return <SectionShell sectionId={sectionId}>{section}</SectionShell>
}

export function ProjectDetail({ slug }: { slug: string }) {
  const project = projects.find(entry => entry.slug === slug)
  if (!project) {
    return <SectionShell sectionId="mission" title="MISSION UNKNOWN" subtitle="This brief could not be found." backTo="/mission"><div className="missing-project"><p>No project matches this address.</p><Link className="section-action" to="/mission"><span>VIEW PROJECTS</span><span aria-hidden="true">↗</span></Link></div></SectionShell>
  }
  return (
    <SectionShell sectionId="mission" title="MISSION BRIEF" subtitle={project.title} backTo="/mission">
      <article className="project-detail">
        <Reveal className="project-detail-head">
          <ProjectVisual project={project} large />
          <div className="project-detail-title"><span className="section-kicker">MISSION {project.number} / {project.sample ? 'SAMPLE PROJECT' : project.category.toUpperCase()}</span><h2><RansomText text={project.title.toUpperCase()} seed={Number(project.number) + 80} /></h2><p>{project.summary}</p><div className="project-detail-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
        </Reveal>
        <div className="briefing-grid">
          <Reveal index={1} className="briefing-field"><span>TARGET</span><h3>Tools & methods</h3><p>{project.tech.join(' / ')}</p></Reveal>
          <Reveal index={2} className="briefing-field"><span>OBJECTIVE</span><h3>The challenge</h3><p>{project.objective}</p></Reveal>
          <Reveal index={3} className="briefing-field"><span>REWARD</span><h3>Outcome & impact</h3><p>{project.reward}</p></Reveal>
          <Reveal index={4} className="briefing-field"><span>STATUS</span><h3>{project.status}</h3><p>{project.sample ? 'Example case study. Replace with your real project details.' : `Updated ${project.year}.`}</p>{project.status === 'SHIPPED' && !project.sample && <strong className="mission-cleared">MISSION CLEARED</strong>}</Reveal>
        </div>
        <div className="project-detail-links">
          {project.links.length ? project.links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="section-action"><span>{link.label}</span><span aria-hidden="true">↗</span></a>) : <p>Project links will appear here when available.</p>}
        </div>
      </article>
    </SectionShell>
  )
}
