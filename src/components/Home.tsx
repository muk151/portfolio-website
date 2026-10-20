import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { about, experience, menuItems, profile, projects, skills } from '../content'
import { useSiteSettings } from '../settings'
import { publicAssetUrl } from '../urls'
import { RansomText } from './RansomText'
import '../styles/home.css'

const featuredProjects = projects.slice(0, 3)
const featuredSkills = skills.slice(0, 5)
const featuredExperience = experience.slice(0, 2)
const previewPortfolio = profile.name === 'YOUR NAME' || profile.role === 'YOUR ROLE'

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { reducedMotion } = useSiteSettings()
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reducedMotion ? 0 : 0.42, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({ number, label, title, note }: { number: string; label: string; title: string; note?: string }) {
  return (
    <div className="home-section-heading">
      <div className="home-section-id"><span>{number}</span><span>{label}</span></div>
      <div className="home-section-title-row"><h2>{title}</h2><span className="home-heading-star" aria-hidden="true">✦</span></div>
      {note && <p>{note}</p>}
    </div>
  )
}

function ProjectArtwork({ visual, number }: { visual: string; number: string }) {
  return (
    <div className={'home-project-art home-project-art-' + visual} aria-hidden="true">
      <span className="project-art-grid" />
      <span className="project-art-shape" />
      <span className="project-art-orbit" />
      <span className="project-art-number">{number}</span>
      <span className="project-art-spark">✦</span>
    </div>
  )
}

export function Home() {
  const { reducedMotion } = useSiteSettings()
  const aboutPreview = about.paragraphs[0].startsWith('This is a placeholder')
    ? 'A closer look at the person behind the work, the problems they care about, and the way they collaborate.'
    : about.paragraphs[0]

  return (
    <div className="home-site" id="top">
      <header className="home-header">
        <div className="home-header-inner">
          <a href="#top" className="home-brand" aria-label="Portfolio, back to top"><span className="home-brand-star" aria-hidden="true">✦</span><span>PORTFOLIO<span className="brand-period">.</span></span></a>
          <nav className="home-primary-nav" aria-label="Primary navigation">
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
          </nav>
          <Link to="/equip" className="home-header-resume">Resume <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </header>

      <main id="main-content" className="home-main">
        <section className="home-hero" aria-labelledby="home-title">
          <div className="hero-copy">
            <div className="hero-eyebrow"><span className="hero-eyebrow-star" aria-hidden="true">✦</span> CREATIVE PORTFOLIO <span className="hero-eyebrow-line" /></div>
            <h1 id="home-title"><span className="hero-hello">Hello, I'm</span><span className="hero-name">{profile.name}</span><span className="hero-role">{profile.role}</span></h1>
            <p className="hero-intro">A clear path through my work, skills, and experience. Start with the projects, then explore the story behind them.</p>
            <div className="hero-actions">
              <a href="#work" className="home-button home-button-primary">See selected work <ArrowDown size={19} aria-hidden="true" /></a>
              <Link to="/equip" className="home-button home-button-secondary">View resume <ArrowUpRight size={19} aria-hidden="true" /></Link>
            </div>
            {previewPortfolio && <p className="hero-preview-note">Portfolio preview · Sample content is clearly marked below.</p>}
            <a href="#work" className="hero-scroll-cue">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
          </div>

          <motion.div className="hero-art" aria-hidden="true" initial={reducedMotion ? false : { opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
            <div className="hero-art-pattern" />
            <div className="hero-art-red-cut" />
            <img className="hero-art-gesture" src={publicAssetUrl('hero-gesture.svg')} alt="" fetchPriority="high" />
            <img className="hero-art-portrait" src={publicAssetUrl(profile.portraitUrl || 'portrait-placeholder.svg')} alt="" fetchPriority="high" />
            <div className="hero-art-issue">01 <span>/ 09</span></div>
            <div className="hero-art-label"><RansomText text="PORTFOLIO" seed={22} /><span>WORK · PROCESS · PEOPLE</span></div>
          </motion.div>
        </section>

        <section className="home-work home-content-section" id="work" aria-labelledby="work-heading">
          <div className="home-container">
            <Reveal><div id="work-heading"><SectionTitle number="01" label="THE WORK" title="Selected projects" note="A quick look at the work. Open a project for its challenge, approach, and outcome." /></div></Reveal>
            <div className="home-project-grid">
              {featuredProjects.map((project, index) => (
                <Reveal key={project.slug} delay={index * 0.06} className="home-project-wrap">
                  <Link className="home-project-card" to={'/mission/' + project.slug} aria-label={'View ' + project.title + ' project'}>
                    <ProjectArtwork visual={project.visual} number={project.number} />
                    <div className="home-project-body">
                      <div className="home-project-meta"><span>{project.category}</span><span>{project.sample ? 'SAMPLE PROJECT' : project.year}</span></div>
                      <div className="home-project-title"><h3>{project.title}</h3><ArrowUpRight size={24} aria-hidden="true" /></div>
                      <p>{project.summary}</p>
                      <div className="home-project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
            <Reveal className="home-section-tail"><Link to="/mission" className="home-text-link">Explore all projects <ArrowRight size={18} aria-hidden="true" /></Link></Reveal>
          </div>
        </section>

        <section className="home-about home-content-section" id="about" aria-labelledby="about-heading">
          <div className="home-container home-about-grid">
            <Reveal className="home-about-copy">
              <div id="about-heading"><SectionTitle number="02" label="THE PERSON" title="More than a title" /></div>
              <p className="home-about-lead">{aboutPreview}</p>
              <Link to="/persona" className="home-text-link">Get to know me <ArrowRight size={18} aria-hidden="true" /></Link>
            </Reveal>
            <Reveal className="home-skills-panel" delay={0.08}>
              <div className="home-skills-top"><span>03 / CORE SKILLS</span><span aria-hidden="true">✦</span></div>
              <h3>What I bring</h3>
              <ul>{featuredSkills.map(skill => <li key={skill.name}><span className="skill-glyph" aria-hidden="true">{skill.glyph}</span><span>{skill.name}</span><span className="skill-category">{skill.category}</span></li>)}</ul>
              <Link to="/skill" className="home-text-link">See all skills <ArrowRight size={18} aria-hidden="true" /></Link>
            </Reveal>
          </div>
        </section>

        <section className="home-experience home-content-section" id="experience" aria-labelledby="experience-heading">
          <div className="home-container">
            <Reveal><div id="experience-heading"><SectionTitle number="04" label="THE JOURNEY" title="Experience at a glance" note="A short timeline, with more detail one click away." /></div></Reveal>
            <div className="home-experience-list">
              {featuredExperience.map((entry, index) => (
                <Reveal className="home-experience-row" key={entry.role + index} delay={index * 0.05}>
                  <span className="experience-period">{entry.period}</span>
                  <div><h3>{entry.role}</h3><p>{entry.company} <span aria-hidden="true">·</span> {entry.location}</p></div>
                  <span className="experience-row-number" aria-hidden="true">0{index + 1}</span>
                </Reveal>
              ))}
            </div>
            <Reveal className="home-section-tail"><Link to="/party" className="home-text-link">View full experience <ArrowRight size={18} aria-hidden="true" /></Link></Reveal>
          </div>
        </section>

        <section className="home-contact home-content-section" id="contact" aria-labelledby="contact-heading">
          <div className="home-container home-contact-inner">
            <Reveal>
              <span className="home-contact-kicker">05 / NEXT STEP</span>
              <h2 id="contact-heading">Have a role or project in mind?</h2>
              <p>Let's make the conversation easy. Share a little about what you're looking for, and I'll take it from there.</p>
            </Reveal>
            <Reveal delay={0.08}><Link to="/contact" className="home-contact-action"><RansomText text="LET'S TALK" seed={54} /><ArrowUpRight size={29} aria-hidden="true" /></Link></Reveal>
          </div>
        </section>
      </main>

      <footer className="home-site-footer">
        <div className="home-container home-footer-grid">
          <div className="footer-identity"><span className="footer-mark" aria-hidden="true">✦</span><strong>{profile.name}</strong><span>{profile.role}</span></div>
          <nav aria-label="More portfolio pages"><span className="footer-nav-label">EXPLORE MORE</span>{menuItems.filter(item => !['mission', 'persona', 'party', 'contact'].includes(item.id)).map(item => <Link key={item.id} to={item.path}>{item.section} <span aria-hidden="true">↗</span></Link>)}</nav>
          <a className="back-to-top" href="#top">Back to top <span aria-hidden="true">↑</span></a>
        </div>
      </footer>
    </div>
  )
}
