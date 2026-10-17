import type { CSSProperties, JSX } from 'react'

export type DitherVeilProps = {
  src?: string
  fit?: 'contain' | 'cover'
  pattern?: 'bayer' | 'noise' | 'lines' | 'atkinson' | 'floyd'
  pixelSize?: number
  levels?: number
  palette?: 'duotone' | 'rgb'
  inkColor?: string
  paperColor?: string
  contrast?: number
  brightness?: number
  revealRadius?: number
  softness?: number
  linger?: number
  rimColor?: string
  rim?: number
  reverse?: boolean
  wander?: boolean
  clickBurst?: boolean
  className?: string
  style?: CSSProperties
}

declare const DitherVeil: (props: DitherVeilProps) => JSX.Element
export default DitherVeil
