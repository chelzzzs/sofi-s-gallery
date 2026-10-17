import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import type { Photo } from '../photos'
import { Arrow } from './Arrow'
import styles from './Lightbox.module.css'
import type { ReturnTarget } from './wallTiles'

type Props = {
  photos: Photo[]
  startIndex: number
  origin: DOMRect | null
  locate: (index: number) => ReturnTarget | null
  onClose: () => void
}

const SWIPE_THRESHOLD = 60
const TAP_THRESHOLD = 6
const TILE_RADIUS = 14
const EASE_OPEN = 'cubic-bezier(0.22, 1, 0.36, 1)'
const EASE_CLOSE = 'cubic-bezier(0.55, 0, 0.25, 1)'
const CLOSE_MS = 600

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Pose that makes the full-size image (at `to`) look exactly like the tile at
// `from`: scaled down to cover the tile, cropped to its box, corners rounded.
const asTile = (from: DOMRect, to: DOMRect): Keyframe => {
  const s = Math.max(from.width / to.width, from.height / to.height)
  const insetX = (to.width - from.width / s) / 2
  const insetY = (to.height - from.height / s) / 2
  const dx = from.left + from.width / 2 - (to.left + to.width / 2)
  const dy = from.top + from.height / 2 - (to.top + to.height / 2)
  return {
    transform: `translate(${dx}px, ${dy}px) scale(${s})`,
    clipPath: `inset(${insetY}px ${insetX}px round ${TILE_RADIUS / s}px)`,
  }
}

const settled: Keyframe = { transform: 'none', clipPath: 'inset(0px 0px round 0px)' }
const shrunk: Keyframe = { transform: 'scale(0.9)', opacity: 0 }

export function Lightbox({ photos, startIndex, origin, locate, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const backdrop = useRef<HTMLDivElement>(null)
  const chrome = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const swipe = useRef({ down: false, startX: 0, dx: 0 })
  const closing = useRef(false)
  const [index, setIndex] = useState(startIndex)
  const [dir, setDir] = useState(0)
  const n = photos.length
  const photo = photos[index]

  const go = (delta: number) => {
    if (closing.current) return
    setDir(delta)
    setIndex((i) => (i + delta + n) % n)
  }

  const close = async () => {
    if (closing.current) return
    closing.current = true
    const el = img.current
    const target = locate(index)
    // The clicked tile is still lit under the photo; any other copy is lit up
    // now so there is something bright to cross-fade into.
    const returning = target && !target.tile.classList.contains('is-active') ? target.tile : null
    if (returning) returning.dataset.returning = ''
    if (el && !reducedMotion()) {
      el.style.transform = ''
      const at = el.getBoundingClientRect()
      // The photo flies flat while the wall is tilted, so their shapes never
      // match exactly: the backdrop clears early to reveal the tile, and over
      // the second half of the flight the photo dissolves into it.
      const out: Keyframe[] = target
        ? [{ ...settled, opacity: 1 }, { opacity: 1, offset: 0.45 }, { ...asTile(target.rect, at), opacity: 0 }]
        : [{ transform: 'none', opacity: 1 }, shrunk]
      await Promise.all([
        el.animate(out, { duration: CLOSE_MS, easing: EASE_CLOSE, fill: 'forwards' }).finished,
        backdrop.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: CLOSE_MS * 0.6,
          easing: 'ease-out',
          fill: 'forwards',
        }).finished,
        chrome.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' }).finished,
      ])
    }
    dialog.current?.close()
    onClose()
    if (returning) setTimeout(() => delete returning.dataset.returning, 150)
  }

  useLayoutEffect(() => {
    dialog.current?.showModal()
    const el = img.current
    if (!el || reducedMotion()) return
    // Measure the resting box: a previous run of this effect (StrictMode) may
    // already have the image posed as the tile.
    for (const node of [el, backdrop.current, chrome.current]) node?.getAnimations().forEach((a) => a.cancel())
    const to = el.getBoundingClientRect()
    el.animate(origin ? [asTile(origin, to), settled] : [shrunk, { transform: 'none', opacity: 1 }], {
      duration: 640,
      easing: EASE_OPEN,
    })
    backdrop.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: 'ease-out' })
    chrome.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, delay: 300, fill: 'backwards' })
  }, [])

  useEffect(() => {
    for (const d of [-1, 1]) {
      const p = photos[(index + d + n) % n]
      const pre = new Image()
      pre.sizes = '100vw'
      pre.srcset = p.full.srcset
    }
  }, [index, n, photos])

  const setOffset = (dx: number, animate: boolean) => {
    if (!img.current) return
    img.current.style.transition = animate ? '' : 'none'
    img.current.style.transform = dx ? `translateX(${dx}px)` : ''
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || closing.current) return
    swipe.current = { down: true, startX: e.clientX, dx: 0 }
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = swipe.current
    if (!s.down) return
    s.dx = e.clientX - s.startX
    if (Math.abs(s.dx) > TAP_THRESHOLD) setOffset(s.dx, false)
  }

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const s = swipe.current
    if (!s.down) return
    s.down = false
    setOffset(0, true)
    if (Math.abs(s.dx) > SWIPE_THRESHOLD) go(s.dx < 0 ? 1 : -1)
    else if (Math.abs(s.dx) <= TAP_THRESHOLD && e.target === e.currentTarget) close()
  }

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-label="Visualização da foto"
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        else if (e.key === 'ArrowLeft') go(-1)
        else return
        e.preventDefault()
      }}
    >
      <div ref={backdrop} className={styles.backdrop} />

      <div
        className={styles.stage}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img
          key={photo.id}
          ref={img}
          className={styles.photo}
          data-dir={dir || undefined}
          style={
            { '--dir': dir, '--r': photo.full.w / photo.full.h, backgroundImage: `url(${photo.tile})` } as CSSProperties
          }
          src={photo.full.src}
          srcSet={photo.full.srcset}
          sizes="100vw"
          width={photo.full.w}
          height={photo.full.h}
          alt={photo.alt}
          draggable={false}
        />
      </div>

      <div ref={chrome} className={styles.chrome}>
        <p className={styles.counter} aria-live="polite">
          <span>{String(index + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')}
        </p>

        <button type="button" className={styles.close} onClick={close} aria-label="Fechar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <button
          type="button"
          className={`${styles.nav} ${styles.prev}`}
          onClick={() => go(-1)}
          aria-label="Foto anterior"
        >
          <Arrow dir="left" />
        </button>
        <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => go(1)} aria-label="Próxima foto">
          <Arrow dir="right" />
        </button>
      </div>
    </dialog>
  )
}
