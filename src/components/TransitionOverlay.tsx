import { motion } from 'framer-motion'

const strips = ['#0A0A0A', '#E5001C', '#F5F5F0', '#0A0A0A', '#E5001C', '#F5F5F0', '#0A0A0A', '#E5001C']

export function TransitionOverlay({ phase, direction, reducedMotion, fade }: { phase: 'idle' | 'enter' | 'leave'; direction: 'forward' | 'back'; reducedMotion: boolean; fade: boolean }) {
  if (reducedMotion) return <div className={`transition-fade ${fade ? 'is-visible' : ''}`} aria-hidden="true" />
  if (phase === 'idle') return null
  return (
    <div className="shard-transition" aria-hidden="true">
      {strips.map((color, index) => (
        <motion.div
          key={index}
          className="transition-strip"
          style={{ left: `${index * 13 - 3}%`, backgroundColor: color, skewX: direction === 'back' ? 13 : -13 }}
          initial={{ x: direction === 'back' ? '135vw' : '-135vw' }}
          animate={{ x: phase === 'enter' ? '0vw' : direction === 'back' ? '-135vw' : '135vw' }}
          transition={{ duration: .23, ease: [0.22, 1, 0.36, 1], delay: phase === 'enter' ? (direction === 'back' ? 7 - index : index) * .025 : (direction === 'back' ? index : 7 - index) * .025 }}
        />
      ))}
      <div className="loading-mark"><span className="loading-star">✦</span><span>NOW LOADING</span></div>
    </div>
  )
}
