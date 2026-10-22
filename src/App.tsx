import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import styles from './App.module.css'
import { Intro } from './components/Intro'
import { MusicPlayer } from './components/MusicPlayer'
import { PhotoCarousel } from './components/PhotoCarousel'
import { PhotoWall } from './components/PhotoWall'
import { returnTarget } from './components/wallTiles'
import { photos, SCULPTURE_SRC } from './photos'

// Split out of the main bundle so the intro screen loads less code. Both are
// fetched ahead of time (see below), before they are actually needed.
const loadSculpture = () => import('./components/Sculpture')
const loadLightbox = () => import('./components/Lightbox')
const Sculpture = lazy(() => loadSculpture().then((m) => ({ default: m.Sculpture })))
const Lightbox = lazy(() => loadLightbox().then((m) => ({ default: m.Lightbox })))

const whenIdle = (fn: () => void) =>
  'requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 600)

type Phase = 'intro' | 'leaving' | 'done'

// After the photo has dissolved into its tile, the wall stays still a moment
// longer (the tile's own highlight eases out over ~0.4s) before drifting again.
const SETTLE_MS = 600

export function App() {
  const main = useRef<HTMLElement>(null)
  const gallery = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>('intro')
  const [open, setOpen] = useState<{ index: number; origin: DOMRect } | null>(null)
  const [frozen, setFrozen] = useState(false)
  const thaw = useRef(0)

  // While the intro plays: warm up the sculpture's code and image, then the
  // lightbox's code, so neither waits on the network when it's first shown.
  useEffect(() => {
    whenIdle(() => {
      loadSculpture()
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = SCULPTURE_SRC
      whenIdle(loadLightbox)
    })
  }, [])

  useEffect(() => {
    if (phase === 'done') main.current?.focus({ preventScroll: true })
  }, [phase])

  useEffect(() => () => clearTimeout(thaw.current), [])

  // How the visitor is interacting right now: touch, mouse or keyboard.
  const lastInput = useRef<'touch' | 'mouse' | 'keyboard'>('mouse')
  useEffect(() => {
    const onPointer = (e: PointerEvent) => (lastInput.current = e.pointerType === 'mouse' ? 'mouse' : 'touch')
    const onKey = () => (lastInput.current = 'keyboard')
    addEventListener('pointerdown', onPointer, true)
    addEventListener('keydown', onKey, true)
    return () => {
      removeEventListener('pointerdown', onPointer, true)
      removeEventListener('keydown', onKey, true)
    }
  }, [])

  // Bumped to make the wall drop its lit, lifted tile (see closePhoto).
  const [releaseKey, setReleaseKey] = useState(0)

  const openPhoto = (index: number, origin: DOMRect) => {
    clearTimeout(thaw.current)
    setFrozen(true)
    setOpen({ index, origin })
  }

  const closePhoto = () => {
    setOpen(null)
    thaw.current = window.setTimeout(() => {
      setFrozen(false)
      // A mouse moving off the tile is what normally un-lights it; a finger
      // never does, so after a tap the wall lets go of it itself.
      if (lastInput.current === 'touch') setReleaseKey((k) => k + 1)
    }, SETTLE_MS)
  }

  return (
    <>
      <main ref={main} tabIndex={-1} className={styles.main} data-phase={phase} inert={phase === 'intro'}>
        {phase !== 'intro' && (
          <Suspense fallback={<div className={styles.placeholder} />}>
            <Sculpture onNext={() => gallery.current?.scrollIntoView({ behavior: 'smooth' })} />
          </Suspense>
        )}
        <div ref={gallery}>
          <PhotoWall
            photos={photos}
            paused={frozen || phase === 'intro'}
            releaseKey={releaseKey}
            onOpen={openPhoto}
          />
        </div>
        <MusicPlayer autoPlay={phase !== 'intro'} />
        <PhotoCarousel watch={phase === 'done'} />
        {open && (
          <Suspense fallback={null}>
            <Lightbox
              photos={photos}
              startIndex={open.index}
              origin={open.origin}
              locate={returnTarget}
              keepFocus={() => lastInput.current === 'keyboard'}
              onClose={closePhoto}
            />
          </Suspense>
        )}
      </main>
      {phase !== 'done' && (
        <Intro leaving={phase === 'leaving'} onLeave={() => setPhase('leaving')} onDone={() => setPhase('done')} />
      )}
    </>
  )
}
