import { useEffect, useRef, useState } from 'react'
import styles from './App.module.css'
import { Carousel, type CarouselHandle } from './components/Carousel'
import { Intro } from './components/Intro'
import { Lightbox } from './components/Lightbox'
import { SCULPTURE_SRC, Sculpture } from './components/Sculpture'
import { photos } from './photos'

type Phase = 'intro' | 'leaving' | 'done'

export function App() {
  const main = useRef<HTMLElement>(null)
  const gallery = useRef<HTMLDivElement>(null)
  const carousel = useRef<CarouselHandle>(null)
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

  const close = (lastIndex: number) => {
    setOpenAt(null)
    carousel.current?.focusPhoto(lastIndex)
  }

  return (
    <>
      <main ref={main} tabIndex={-1} className={styles.main} data-phase={phase} inert={phase === 'intro'}>
        {phase !== 'intro' && (
          <Sculpture onNext={() => gallery.current?.scrollIntoView({ behavior: 'smooth' })} />
        )}
        <div ref={gallery}>
          <Carousel ref={carousel} photos={photos} onOpen={setOpenAt} keyboard={phase === 'done' && openAt === null} />
        </div>
        {openAt !== null && <Lightbox photos={photos} startIndex={openAt} onClose={close} />}
      </main>
      {phase !== 'done' && (
        <Intro leaving={phase === 'leaving'} onLeave={() => setPhase('leaving')} onDone={() => setPhase('done')} />
      )}
    </>
  )
}
