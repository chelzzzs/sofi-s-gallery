import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { carouselPhotos } from '../photos'
import styles from './PhotoCarousel.module.css'

// The carousel sits at the very bottom of the page: its code (WebGL) and its
// 13 photos are only fetched once the section gets within about a screen of
// the viewport, so they don't compete with the intro and the top sections.
const FlexCarousel = lazy(() => import('./FlexCarousel'))

type Props = {
  // Off during the intro: the sculpture isn't on the page yet, so the carousel
  // sits much higher than it will and would look "near" too early.
  watch: boolean
}

export function PhotoCarousel({ watch }: Props) {
  const section = useRef<HTMLElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    if (!watch) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setNear(true)
        io.disconnect()
      },
      { rootMargin: '100% 0px' },
    )
    io.observe(section.current!)
    return () => io.disconnect()
  }, [watch])

  return (
    <section ref={section} className={styles.carousel} aria-label="Mais fotos">
      <div className={styles.inner}>
        {near && (
          <Suspense fallback={null}>
            <FlexCarousel
              items={carouselPhotos}
              preset="liquid"
              intro="rise"
              cardHeight={0.5}
              gap={12}
              squeeze={0.2}
              focusOnClick
              captions
              fit="landscape"
              radius={0}
              lensWidth={0.74}
              lensHeight={1.18}
              tilt={62}
              roundness={1}
              bend={0.34}
              reach={0.38}
              curl="twist"
              dispersion={0.45}
              liquid={0}
              followCursor={false}
              autoplay={false}
              interval={4}
              captureWheel
            />
          </Suspense>
        )}
      </div>
    </section>
  )
}
