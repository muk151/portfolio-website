import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type MotionLevel = 'full' | 'reduced'

type SettingsContextValue = {
  sound: boolean
  motion: MotionLevel
  highContrast: boolean
  reducedMotion: boolean
  setSound: (value: boolean) => void
  setMotion: (value: MotionLevel) => void
  setHighContrast: (value: boolean) => void
  playSound: (kind?: 'select' | 'confirm') => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

function readSetting<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(`command-${key}`)
    return stored === null ? fallback : JSON.parse(stored) as T
  } catch {
    return fallback
  }
}

function saveSetting<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(`command-${key}`, JSON.stringify(value))
  } catch {
    // The site still works when storage is disabled.
  }
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [sound, setSoundState] = useState(() => readSetting('sound', false))
  const [motion, setMotionState] = useState<MotionLevel>(() => readSetting('motion', 'full'))
  const [highContrast, setHighContrastState] = useState(() => readSetting('contrast', false))
  const [systemReducedMotion, setSystemReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const reducedMotion = systemReducedMotion || motion === 'reduced'

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setSystemReducedMotion(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const setSound = useCallback((value: boolean) => { setSoundState(value); saveSetting('sound', value) }, [])
  const setMotion = useCallback((value: MotionLevel) => { setMotionState(value); saveSetting('motion', value) }, [])
  const setHighContrast = useCallback((value: boolean) => { setHighContrastState(value); saveSetting('contrast', value) }, [])

  const playSound = useCallback((kind: 'select' | 'confirm' = 'select') => {
    if (!sound) return
    try {
      const AudioContextClass = window.AudioContext
      const context = new AudioContextClass()
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const now = context.currentTime
      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(kind === 'confirm' ? 280 : 460, now)
      oscillator.frequency.exponentialRampToValueAtTime(kind === 'confirm' ? 640 : 680, now + 0.075)
      gain.gain.setValueAtTime(0.025, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(now)
      oscillator.stop(now + 0.09)
      oscillator.onended = () => { void context.close() }
    } catch {
      // Browsers can block audio before a user gesture.
    }
  }, [sound])

  const value = useMemo(() => ({
    sound, motion, highContrast, reducedMotion,
    setSound, setMotion, setHighContrast, playSound,
  }), [sound, motion, highContrast, reducedMotion, setSound, setMotion, setHighContrast, playSound])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

// The provider and its hook intentionally share one context module.
// eslint-disable-next-line react-refresh/only-export-components
export function useSiteSettings() {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSiteSettings must be used inside SiteSettingsProvider')
  return context
}
