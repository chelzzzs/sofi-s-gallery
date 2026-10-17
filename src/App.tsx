import { useEffect, useRef, useState } from 'react'
import styles from './App.module.css'
import { Intro } from './components/Intro'
import { Lightbox } from './components/Lightbox'
import { PhotoWall } from './components/PhotoWall'
import { SCULPTURE_SRC, Sculpture } from './components/Sculpture'
import { photos } from './photos'

type Phase = 'intro' | 'leaving' | 'done'

export function App() {
  const main = useRef<HTMLElement>(null)
  const gallery = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>('intro')
  const [openAt, setOpenAt] = useState<number | null>(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = SCULPTURE_SRC
  }, [])

  useEffect(() => {
    if (phase === 'done') main.current?.focus({ preventScroll: true })
  }, [phase])

  return (
    <>
      <main ref={main} tabIndex={-1} className={styles.main} data-phase={phase} inert={phase === 'intro'}>
        {phase !== 'intro' && (
          <Sculpture onNext={() => gallery.current?.scrollIntoView({ behavior: 'smooth' })} />
        )}
        <div ref={gallery}>
          <PhotoWall photos={photos} onOpen={setOpenAt} />
        </div>
        {openAt !== null && <Lightbox photos={photos} startIndex={openAt} onClose={() => setOpenAt(null)} />}
      </main>
      {phase !== 'done' && (
        <Intro leaving={phase === 'leaving'} onLeave={() => setPhase('leaving')} onDone={() => setPhase('done')} />
      )}
    </>
  )
}
