import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type Ref,
} from 'react'
import type { Photo } from '../photos'
import { Arrow } from './Arrow'
import styles from './Carousel.module.css'

export type CarouselHandle = { focusPhoto: (index: number) => void }

type Props = {
  photos: Photo[]
  onOpen: (index: number) => void
  keyboard: boolean
  ref?: Ref<CarouselHandle>
}

const DRAG_THRESHOLD = 6
const SWIPE_THRESHOLD = 60

export function Carousel({ photos, onOpen, keyboard, ref }: Props) {
  const track = useRef<HTMLDivElement>(null)
  const items = useRef<(HTMLButtonElement | null)[]>([])
  const target = useRef<number | null>(null)
  const drag = useRef({ down: false, moved: false, startX: 0, startScroll: 0, startIndex: 0 })
  const [active, setActive] = useState(0)
  const last = photos.length - 1

  const clamp = useCallback((i: number) => Math.max(0, Math.min(last, i)), [last])

  const scrollTo = useCallback((i: number, behavior: ScrollBehavior = 'smooth') => {
    const t = track.current
    const el = items.current[i]
    if (!t || !el) return
    t.scrollTo({ left: el.offsetLeft + el.offsetWidth / 2 - t.clientWidth / 2, behavior })
  }, [])

  const nearest = useCallback(() => {
    const t = track.current
    if (!t) return 0
    const center = t.scrollLeft + t.clientWidth / 2
    let best = 0
    let bestDist = Infinity
    items.current.forEach((el, i) => {
      if (!el) return
      const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    })
    return best
  }, [])

  const go = useCallback(
    (delta: number) => {
      const next = clamp((target.current ?? active) + delta)
      target.current = next
      scrollTo(next)
    },
    [active, clamp, scrollTo],
  )

  useImperativeHandle(
    ref,
    () => ({
      focusPhoto(i) {
        target.current = null
        scrollTo(i, 'instant')
        setActive(i)
        items.current[i]?.focus({ preventScroll: true })
      },
    }),
    [scrollTo],
  )

  useEffect(() => {
    const t = track.current
    if (!t) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const i = nearest()
        setActive(i)
        if (target.current === i) target.current = null
      })
    }
    t.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      t.removeEventListener('scroll', onScroll)
    }
  }, [nearest])

  useEffect(() => {
    if (!keyboard) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [keyboard, go])

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !track.current) return
    drag.current = {
      down: true,
      moved: false,
      startX: e.clientX,
      startScroll: track.current.scrollLeft,
      startIndex: active,
    }
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const t = track.current
    if (!d.down || !t) return
    const dx = e.clientX - d.startX
    if (!d.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      d.moved = true
      t.setPointerCapture(e.pointerId)
      t.dataset.dragging = ''
    }
    if (d.moved) t.scrollLeft = d.startScroll - dx
  }

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const t = track.current
    if (!d.down || !t) return
    d.down = false
    if (!d.moved) return
    delete t.dataset.dragging
    const dx = e.clientX - d.startX
    let next = nearest()
    if (next === d.startIndex && Math.abs(dx) > SWIPE_THRESHOLD) next = clamp(next - Math.sign(dx))
    target.current = next
    scrollTo(next)
  }

  const trackStyle = {
    '--r0': photos[0].ratio,
    '--rn': photos[last].ratio,
  } as CSSProperties

  return (
    <section className={styles.carousel} aria-roledescription="carrossel" aria-label="Fotos">
      <div
        ref={track}
        className={styles.track}
        style={trackStyle}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => {
          if (!drag.current.moved) return
          drag.current.moved = false
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            ref={(el) => {
              items.current[i] = el
            }}
            type="button"
            className={styles.item}
            data-active={i === active || undefined}
            style={{ '--r': photo.ratio } as CSSProperties}
            aria-label={`Abrir foto ${i + 1} de ${photos.length}: ${photo.alt}`}
            onClick={() => onOpen(i)}
          >
            <img
              src={photo.thumb.src}
              srcSet={photo.thumb.srcset}
              sizes={photo.ratio > 1 ? 'min(88vw, 108vh)' : 'min(88vw, 48vh)'}
              width={photo.thumb.w}
              height={photo.thumb.h}
              alt={photo.alt}
              loading={i < 3 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
            />
          </button>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.nav}
          onClick={() => go(-1)}
          disabled={active === 0}
          aria-label="Foto anterior"
        >
          <Arrow dir="left" />
        </button>
        <div className={styles.progress} aria-hidden="true">
          <span style={{ transform: `scaleX(${(active + 1) / photos.length})` }} />
        </div>
        <p className={styles.counter} aria-live="polite">
          <span>{String(active + 1).padStart(2, '0')}</span> / {String(photos.length).padStart(2, '0')}
        </p>
        <button
          type="button"
          className={styles.nav}
          onClick={() => go(1)}
          disabled={active === last}
          aria-label="Próxima foto"
        >
          <Arrow dir="right" />
        </button>
      </div>
    </section>
  )
}
