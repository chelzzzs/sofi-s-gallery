import { useEffect, useRef, useState } from 'react'
import styles from './App.module.css'
import { Intro } from './components/Intro'
import { Lightbox } from './components/Lightbox'
import { MusicPlayer } from './components/MusicPlayer'
import { PhotoCarousel } from './components/PhotoCarousel'
import { PhotoWall } from './components/PhotoWall'
import { SCULPTURE_SRC, Sculpture } from './components/Sculpture'
import { returnTarget } from './components/wallTiles'
import { photos } from './photos'

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

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = SCULPTURE_SRC
  }, [])

  useEffect(() => {
    if (phase === 'done') main.current?.focus({ preventScroll: true })
  }, [phase])

  useEffect(() => () => clearTimeout(thaw.current), [])

  const openPhoto = (index: number, origin: DOMRect) => {
    clearTimeout(thaw.current)
    setFrozen(true)
    setOpen({ index, origin })
  }

  const closePhoto = () => {
    setOpen(null)
    thaw.current = window.setTimeout(() => setFrozen(false), SETTLE_MS)
  }

  return (
    <>
      <main ref={main} tabIndex={-1} className={styles.main} data-phase={phase} inert={phase === 'intro'}>
        {phase !== 'intro' && (
          <Sculpture onNext={() => gallery.current?.scrollIntoView({ behavior: 'smooth' })} />
        )}
        <div ref={gallery}>
          <PhotoWall photos={photos} paused={frozen} onOpen={openPhoto} />
        </div>
        <MusicPlayer />
        <PhotoCarousel />
        {open && (
          <Lightbox
            photos={photos}
            startIndex={open.index}
            origin={open.origin}
            locate={returnTarget}
            onClose={closePhoto}
          />
        )}
      </main>
      {phase !== 'done' && (
        <Intro leaving={phase === 'leaving'} onLeave={() => setPhase('leaving')} onDone={() => setPhase('done')} />
      )}
    </>
  )
}
