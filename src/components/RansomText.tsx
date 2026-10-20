import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useSiteSettings } from '../settings'

const fonts = [
  'Anton', 'Bebas Neue', 'Rubik Mono One', 'Bungee',
  'Permanent Marker', 'Special Elite', 'Abril Fatface', 'Archivo Black',
]
const papers = [
  { background: '#0A0A0A', color: '#F5F5F0' },
  { background: '#F5F5F0', color: '#0A0A0A' },
  { background: '#E5001C', color: '#F5F5F0' },
]

function hashText(text: string) {
  let hash = 2166136261
  for (let i = 0; i < text.length; i += 1) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619)
  return hash >>> 0
}

function mulberry32(seed: number) {
  return () => {
    let value = seed += 0x6D2B79F5
    value = Math.imul(value ^ value >>> 15, value | 1)
    value ^= value + Math.imul(value ^ value >>> 7, value | 61)
    return ((value ^ value >>> 14) >>> 0) / 4294967296
  }
}

type Letter = { key: string; character: string; style?: CSSProperties; space?: boolean }

export function RansomText({ text, seed = 0, className = '' }: { text: string; seed?: number; className?: string }) {
  const { reducedMotion } = useSiteSettings()
  const [shuffle, setShuffle] = useState(0)
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])
  useEffect(() => {
    if (reducedMotion) timers.current.forEach(window.clearTimeout)
  }, [reducedMotion])

  const letters = useMemo<Letter[]>(() => {
    const random = mulberry32(hashText(text) ^ seed ^ Math.imul(shuffle + 1, 2654435761))
    return [...text].map((character, index) => {
      if (character === ' ') return { key: `${index}-space`, character: '\u00a0', space: true }
      const font = fonts[Math.floor(random() * fonts.length)]
      const paper = papers[Math.floor(random() * papers.length)]
      const rotation = random() * 16 - 8
      const offset = random() * 8 - 4
      const scale = random() * 0.35 + 0.9
      const top = Math.round(random() * 9)
      const right = Math.round(random() * 9)
      const bottom = Math.round(random() * 9)
      const left = Math.round(random() * 9)
      const clipPath = `polygon(${left}% ${top}%, ${100 - right}% 0%, 100% ${20 + right}%, ${100 - bottom}% ${100 - bottom}%, ${38 + left}% 100%, 0% ${100 - left}%, ${top}% 54%)`
      return {
        key: `${index}-${character}`,
        character,
        style: {
          fontFamily: `'${font}', Impact, sans-serif`, background: paper.background, color: paper.color,
          transform: `translateY(${offset.toFixed(1)}px) rotate(${rotation.toFixed(1)}deg) scale(${scale.toFixed(2)})`,
          clipPath,
        },
      }
    })
  }, [text, seed, shuffle])

  const reshuffle = () => {
    if (reducedMotion) return
    timers.current.forEach(window.clearTimeout)
    timers.current = [0, 60, 120].map(delay => window.setTimeout(() => setShuffle(value => value + 1), delay))
  }

  return (
    <span className={`ransom-text ${className}`} role="text" aria-label={text} onMouseEnter={reshuffle}>
      {letters.map(letter => letter.space
        ? <span key={letter.key} className="ransom-space" aria-hidden="true">{letter.character}</span>
        : <span key={letter.key} className="ransom-letter" style={letter.style} aria-hidden="true">{letter.character}</span>)}
    </span>
  )
}
