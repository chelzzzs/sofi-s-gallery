import { useRef, useState } from 'react'
import { Carousel, type CarouselHandle } from './components/Carousel'
import { Lightbox } from './components/Lightbox'
import { photos } from './photos'

export function App() {
  const carousel = useRef<CarouselHandle>(null)
  const [openAt, setOpenAt] = useState<number | null>(null)

  const close = (lastIndex: number) => {
    setOpenAt(null)
    carousel.current?.focusPhoto(lastIndex)
  }

  return (
    <main>
      <Carousel ref={carousel} photos={photos} onOpen={setOpenAt} keyboard={openAt === null} />
      {openAt !== null && <Lightbox photos={photos} startIndex={openAt} onClose={close} />}
    </main>
  )
}
