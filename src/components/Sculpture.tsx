import { Arrow } from './Arrow'
import DitherVeil from './DitherVeil'
import styles from './Sculpture.module.css'

export const SCULPTURE_SRC =
  'https://images.unsplash.com/photo-1737071371043-761e02b1ef95?q=80&w=1400&auto=format&fit=crop'

export function Sculpture({ onNext }: { onNext: () => void }) {
  return (
    <section className={styles.hero} aria-label="Escultura">
      <DitherVeil
        src={SCULPTURE_SRC}
        pattern="floyd"
        pixelSize={1}
        inkColor="#120f17"
        paperColor="#f4f1ea"
        revealRadius={185}
        softness={0.6}
        linger={1}
        fit="contain"
        rimColor="#a78bfa"
        palette="duotone"
        levels={2}
        contrast={1.15}
        brightness={0}
        rim={0}
        reverse={false}
        wander={false}
        clickBurst
      />
      <button type="button" className={styles.next} onClick={onNext} aria-label="Ver as fotos">
        <Arrow dir="down" />
      </button>
    </section>
  )
}
