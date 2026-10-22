import type { CSSProperties, JSX } from 'react'

export type FlexCarouselItem = { src: string; alt?: string; title?: string; subtitle?: string }

export type FlexCarouselProps = {
  items?: FlexCarouselItem[]
  preset?: 'liquid' | 'ribbon' | 'vortex' | 'arch'
  intro?: 'rise' | 'bloom' | 'spin' | 'deal' | 'fade' | 'none'
  cardHeight?: number
  gap?: number
  radius?: number
  fit?: 'natural' | 'portrait' | 'square' | 'landscape'
  lensWidth?: number
  lensHeight?: number
  tilt?: number
  roundness?: number
  bend?: number
  reach?: number
  curl?: 'twist' | 'rise' | 'fall'
  dispersion?: number
  liquid?: number
  followCursor?: boolean
  squeeze?: number
  focusOnClick?: boolean
  autoplay?: boolean
  interval?: number
  captions?: boolean
  captureWheel?: boolean
  onChange?: (index: number, item: FlexCarouselItem) => void
  onSelect?: (index: number, item: FlexCarouselItem) => void
  className?: string
  style?: CSSProperties
}

declare const FlexCarousel: (props: FlexCarouselProps) => JSX.Element
export default FlexCarousel
