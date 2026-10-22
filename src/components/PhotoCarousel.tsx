import { carouselPhotos } from '../photos'
import FlexCarousel from './FlexCarousel'
import styles from './PhotoCarousel.module.css'

export function PhotoCarousel() {
  return (
    <section className={styles.carousel} aria-label="Mais fotos">
      <div className={styles.inner}>
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
      </div>
    </section>
  )
}
