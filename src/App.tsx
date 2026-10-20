import { Suspense, lazy, useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Home } from './components/Home'
import { TransitionOverlay } from './components/TransitionOverlay'
import { menuItems, profile } from './content'
import { useSiteSettings } from './settings'

const SectionPage = lazy(() => import('./pages/SectionPage').then(module => ({ default: module.SectionPage })))
const ProjectDetail = lazy(() => import('./pages/SectionPage').then(module => ({ default: module.ProjectDetail })))

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const { highContrast, reducedMotion, playSound } = useSiteSettings()
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'enter' | 'leave'>('idle')
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'back'>('forward')
  const [confirming, setConfirming] = useState(false)
  const [flash, setFlash] = useState(false)
  const [fade, setFade] = useState(false)
  const busy = useRef(false)
  const timers = useRef<number[]>([])

  useEffect(() => {
    document.body.dataset.highContrast = String(highContrast)
    document.body.dataset.reducedMotion = String(reducedMotion)
  }, [highContrast, reducedMotion])

  useEffect(() => {
    const section = menuItems.find(item => item.path === location.pathname)
    document.title = section ? `${section.section} — ${profile.name}` : `${profile.name} — ${profile.role}`
    if (location.hash) {
      const frame = window.requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start', behavior: 'auto' }))
      return () => window.cancelAnimationFrame(frame)
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname, location.hash])

  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  const later = (callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay))
  }

  const transitionTo = useCallback((path: string, direction: 'forward' | 'back' = 'forward') => {
    if (path === location.pathname || busy.current) return
    busy.current = true
    setTransitionDirection(direction)
    if (path !== '/') void import('./pages/SectionPage')
    playSound('confirm')
    if (reducedMotion) {
      setFade(true)
      later(() => navigate(path), 75)
      later(() => { setFade(false); busy.current = false }, 160)
      return
    }
    setConfirming(true)
    later(() => {
      setConfirming(false)
      setFlash(true)
      later(() => setFlash(false), 24)
      setTransitionPhase('enter')
      later(() => navigate(path), 414)
      later(() => setTransitionPhase('leave'), 465)
      later(() => { setTransitionPhase('idle'); busy.current = false }, 890)
    }, 150)
  }, [location.pathname, navigate, playSound, reducedMotion])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && location.pathname !== '/') {
        event.preventDefault()
        transitionTo(location.pathname.startsWith('/mission/') ? '/mission' : '/', 'back')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [location.pathname, transitionTo])

  const interceptInternalLinks = (event: MouseEvent<HTMLElement>) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    const target = event.target
    if (!(target instanceof Element)) return
    const anchor = target.closest('a[href]')
    if (!anchor || anchor.hasAttribute('download') || anchor.getAttribute('target') === '_blank') return
    const href = anchor.getAttribute('href')
    if (!href) return
    const url = new URL(href, window.location.href)
    if (url.origin !== window.location.origin) return
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
    if (basePath && url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) return
    const routePath = basePath ? url.pathname.slice(basePath.length) || '/' : url.pathname
    if (routePath === location.pathname) return
    event.preventDefault()
    transitionTo(routePath + url.search + url.hash, anchor.hasAttribute('data-back') ? 'back' : 'forward')
  }

  return (
    <div className={`site-app ${confirming ? 'screen-shake' : ''}`} onClickCapture={interceptInternalLinks}>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mission/:slug" element={<ProjectDetailRoute />} />
          {menuItems.map(item => <Route key={item.id} path={item.path} element={<SectionPage sectionId={item.id} />} />)}
          <Route path="*" element={<NotFound onNavigate={transitionTo} />} />
        </Routes>
      </Suspense>
      <TransitionOverlay phase={transitionPhase} direction={transitionDirection} reducedMotion={reducedMotion} fade={fade} />
      {flash && <div className="screen-flash" aria-hidden="true" />}
    </div>
  )
}

function ProjectDetailRoute() {
  const slug = useLocation().pathname.split('/').filter(Boolean).at(-1) ?? ''
  return <ProjectDetail slug={slug} />
}

function NotFound({ onNavigate }: { onNavigate: (path: string) => void }) {
  return <main className="not-found"><span className="not-found-code">404</span><h1>COMMAND NOT FOUND</h1><p>That route isn’t on the menu.</p><button className="hard-button" onClick={() => onNavigate('/')}><span>BACK TO COMMAND</span></button></main>
}

function LoadingPage() {
  return <main className="route-loading" aria-live="polite"><span className="loading-star" aria-hidden="true">✦</span><p>NOW LOADING</p></main>
}
