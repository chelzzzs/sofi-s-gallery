import { useEffect, useRef, useState } from 'react'
import { Carousel, type CarouselHandle } from './components/Carousel'
import { Intro } from './components/Intro'
import { Lightbox } from './components/Lightbox'
import { photos } from './photos'

export function App() {
  const carousel = useRef<CarouselHandle>(null)
  const [entered, setEntered] = useState(false)
  const [openAt, setOpenAt] = useState<number | null>(null)

  useEffect(() => {
    if (entered) carousel.current?.focusPhoto(0)
  }, [entered])

  const close = (lastIndex: number) => {
    setOpenAt(null)
    carousel.current?.focusPhoto(lastIndex)
  }

  return (
    <>
      <main inert={!entered}>
        <Carousel ref={carousel} photos={photos} onOpen={setOpenAt} keyboard={entered && openAt === null} />
        {openAt !== null && <Lightbox photos={photos} startIndex={openAt} onClose={close} />}
      </main>
      {!entered && <Intro onEnter={() => setEntered(true)} />}
    </>
  )
}
