import { useEffect, useRef, useState, type PointerEvent } from 'react'
import type { Photo } from '../photos'
import { Arrow } from './Arrow'
import styles from './Lightbox.module.css'

type Props = {
  photos: Photo[]
  startIndex: number
  onClose: (lastIndex: number) => void
}

const SWIPE_THRESHOLD = 60
const TAP_THRESHOLD = 6

export function Lightbox({ photos, startIndex, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const swipe = useRef({ down: false, startX: 0, dx: 0 })
  const [index, setIndex] = useState(startIndex)
  const n = photos.length
  const photo = photos[index]

  const go = (delta: number) => setIndex((i) => (i + delta + n) % n)

  const close = () => {
    dialog.current?.close()
    onClose(index)
  }

  useEffect(() => {
    dialog.current?.showModal()
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
    if (e.button !== 0) return
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
          src={photo.full.src}
          srcSet={photo.full.srcset}
          sizes="100vw"
          width={photo.full.w}
          height={photo.full.h}
          alt={photo.alt}
          draggable={false}
        />
      </div>

      <p className={styles.counter} aria-live="polite">
        <span>{String(index + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')}
      </p>

      <button type="button" className={styles.close} onClick={close} aria-label="Fechar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => go(-1)} aria-label="Foto anterior">
        <Arrow dir="left" />
      </button>
      <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => go(1)} aria-label="Próxima foto">
        <Arrow dir="right" />
      </button>
    </dialog>
  )
}
