/**
 * Edit this file to make the portfolio yours. All people, projects, results,
 * dates, proficiency values, and quotes below are clearly marked examples.
 * Leave a URL empty until you have a real destination for it.
 */

export type MenuId =
  | 'mission'
  | 'persona'
  | 'skill'
  | 'item'
  | 'equip'
  | 'party'
  | 'cooperation'
  | 'contact'
  | 'system'

export interface MenuItem {
  id: MenuId
  number: string
  label: string
  section: string
  flavor: string
  description: string
  path: string
}

export const menuItems: MenuItem[] = [
  { id: 'mission', number: '01', label: 'MISSION', section: 'Projects', flavor: 'SELECT A BRIEF', description: 'Explore selected work and the thinking behind it.', path: '/mission' },
  { id: 'persona', number: '02', label: 'PERSONA', section: 'About me', flavor: 'THE PERSON', description: 'A quick introduction to the human behind the work.', path: '/persona' },
  { id: 'skill', number: '03', label: 'SKILL', section: 'Skills', flavor: 'CORE ABILITIES', description: 'See the abilities I bring to a team.', path: '/skill' },
  { id: 'item', number: '04', label: 'ITEM', section: 'Tools & tech', flavor: 'INVENTORY', description: 'Browse the tools in my creative inventory.', path: '/item' },
  { id: 'equip', number: '05', label: 'EQUIP', section: 'Resume', flavor: 'THE LOADOUT', description: 'Get a concise summary or request my CV.', path: '/equip' },
  { id: 'party', number: '06', label: 'PARTY', section: 'Experience', flavor: 'THE JOURNEY', description: 'Follow the roles and teams that shaped my work.', path: '/party' },
  { id: 'cooperation', number: '07', label: 'COOPERATION', section: 'Testimonials', flavor: 'ALLIES', description: 'Read feedback from people I have worked with.', path: '/cooperation' },
  { id: 'contact', number: '08', label: 'CONTACT', section: 'Contact', flavor: 'SEND A CARD', description: 'Start a conversation about your next idea.', path: '/contact' },
  { id: 'system', number: '09', label: 'SYSTEM', section: 'Settings', flavor: 'MAKE IT YOURS', description: 'Adjust sound, motion, and contrast.', path: '/system' },
]

export const profile = {
  name: 'YOUR NAME',
  role: 'YOUR ROLE',
  location: 'YOUR CITY',
  email: 'hello@example.com',
  availability: 'AVAILABILITY: UPDATE ME',
  statLabel: 'PROJECTS SHIPPED',
  statValue: '--',
  statFootnote: 'STAT COMING SOON',
  portraitUrl: '',
  resumeUrl: '',
  contactEndpoint: '',
  // Replace these platform home pages with your own profiles before publishing.
  socials: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
}

export type ProjectStatus = 'CONCEPT' | 'IN PROGRESS' | 'SHIPPED' | 'ARCHIVED'

export interface Project {
  slug: string
  number: string
  title: string
  category: string
  year: string
  summary: string
  objective: string
  reward: string
  status: ProjectStatus
  tags: string[]
  tech: string[]
  visual: 'signal' | 'orbit' | 'pulse'
  sample: boolean
  links: Array<{ label: string; url: string }>
}

export const projects: Project[] = [
  {
    slug: 'signal-studio', number: '01', title: 'Signal Studio', category: 'Web app', year: '20XX',
    summary: 'Example project: a workspace for turning scattered ideas into a clear plan.',
    objective: 'Replace this with the problem, audience, and your approach.',
    reward: 'Add a real, verifiable outcome or lesson learned.', status: 'CONCEPT',
    tags: ['Product design', 'Frontend'], tech: ['React', 'TypeScript', 'CSS'],
    visual: 'signal', sample: true, links: [],
  },
  {
    slug: 'orbit-archive', number: '02', title: 'Orbit Archive', category: 'Digital experience', year: '20XX',
    summary: 'Example project: an expressive archive with an easy way to discover stories.',
    objective: 'Explain what you built and why it mattered to the people using it.',
    reward: 'Replace this with a measured result, feedback, or insight.', status: 'CONCEPT',
    tags: ['Interaction', 'Editorial'], tech: ['React', 'Motion', 'SVG'],
    visual: 'orbit', sample: true, links: [],
  },
  {
    slug: 'pulse-kit', number: '03', title: 'Pulse Kit', category: 'Design system', year: '20XX',
    summary: 'Example project: a flexible UI kit that keeps a growing product consistent.',
    objective: 'Describe the design or engineering challenge this work addressed.',
    reward: 'Add evidence of impact when this becomes a real case study.', status: 'CONCEPT',
    tags: ['Systems', 'Accessibility'], tech: ['Figma', 'React', 'Tokens'],
    visual: 'pulse', sample: true, links: [],
  },
]

export interface Strength {
  label: string
  score: number
}

export const about = {
  eyebrow: 'A HUMAN, NOT A HANDLE',
  heading: 'MAKE IT MEAN SOMETHING',
  paragraphs: [
    'This is a placeholder bio. Tell visitors what you care about, the problems you enjoy solving, and how you work with others.',
    'Add one vivid detail that sounds like you. A useful bio gives people a reason to remember both your work and your point of view.',
  ],
  facts: [
    { label: 'BASE', value: 'YOUR CITY' },
    { label: 'FOCUS', value: 'YOUR SPECIALTY' },
    { label: 'STATUS', value: 'UPDATE ME' },
  ],
  strengths: [
    { label: 'Design', score: 4 },
    { label: 'Build', score: 4 },
    { label: 'Strategy', score: 3 },
    { label: 'Story', score: 4 },
    { label: 'Teamwork', score: 5 },
  ] satisfies Strength[],
}

export interface Skill {
  name: string
  glyph: string
  category: string
  level: number
  description: string
}

export const skills: Skill[] = [
  { name: 'Interface craft', glyph: '✦', category: 'DESIGN', level: 4, description: 'Example: shaping clear, expressive interfaces from rough ideas.' },
  { name: 'Frontend build', glyph: '⌁', category: 'CODE', level: 4, description: 'Example: building responsive, accessible interactions for the web.' },
  { name: 'Motion language', glyph: '↗', category: 'MOTION', level: 3, description: 'Example: using movement to add clarity and character.' },
  { name: 'Creative direction', glyph: '◈', category: 'IDEAS', level: 4, description: 'Example: finding a strong visual point of view for a product.' },
  { name: 'Collaboration', glyph: '⊕', category: 'TEAM', level: 5, description: 'Example: turning feedback and shared goals into better work.' },
]

export interface ToolItem {
  name: string
  mark: string
  group: string
  note: string
}

export const tools: ToolItem[] = [
  { name: 'React', mark: 'R', group: 'BUILD', note: 'Component based interface work.' },
  { name: 'TypeScript', mark: 'TS', group: 'BUILD', note: 'Safer, clearer application code.' },
  { name: 'CSS', mark: 'CSS', group: 'BUILD', note: 'Layouts, details, and responsive systems.' },
  { name: 'Figma', mark: 'F', group: 'DESIGN', note: 'Exploration, prototypes, and handoff.' },
  { name: 'SVG', mark: '◇', group: 'MOTION', note: 'Sharp, flexible vector artwork.' },
  { name: 'Motion', mark: '↗', group: 'MOTION', note: 'Purposeful transitions and feedback.' },
]

export const resume = {
  heading: 'READY FOR THE NEXT MISSION',
  summary: 'Replace this summary with the kind of work you want to do next and the strengths your CV demonstrates.',
  highlights: [
    'Highlight a relevant specialty or accomplishment.',
    'Highlight the kinds of teams or projects you work best with.',
    'Highlight a concrete strength supported by your experience.',
  ],
}

export interface ExperienceEntry {
  period: string
  role: string
  company: string
  location: string
  description: string
  level: string
}

export const experience: ExperienceEntry[] = [
  { period: '20XX — NOW', role: 'YOUR CURRENT ROLE', company: 'COMPANY NAME', location: 'LOCATION', description: 'Describe your responsibilities and one meaningful contribution.', level: '--' },
  { period: '20XX — 20XX', role: 'YOUR PREVIOUS ROLE', company: 'COMPANY NAME', location: 'LOCATION', description: 'Describe the work, collaborators, and what you learned.', level: '--' },
  { period: '20XX — 20XX', role: 'YOUR EARLY ROLE', company: 'COMPANY NAME', location: 'LOCATION', description: 'Add the experience that best explains your path here.', level: '--' },
]

export interface Testimonial {
  quote: string
  name: string
  role: string
  rank: number
  sample: boolean
}

export const testimonials: Testimonial[] = [
  { quote: 'Replace this example with a real quote from someone who worked with you.', name: 'COLLABORATOR NAME', role: 'ROLE / COMPANY', rank: 0, sample: true },
  { quote: 'A useful quote describes your contribution and what working together felt like.', name: 'CLIENT NAME', role: 'ROLE / COMPANY', rank: 0, sample: true },
]

export const contact = {
  heading: 'SEND A CALLING CARD',
  intro: 'Have a project, a role, or an interesting question? Leave a note and I will get back to you.',
  availability: 'Availability details coming soon.',
  subject: 'Portfolio inquiry',
}
