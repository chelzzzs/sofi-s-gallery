import { Arrow } from './Arrow'
import DitherVeil from './DitherVeil'
import styles from './Sculpture.module.css'
import { SCULPTURE_SRC } from '../photos'

export function Sculpture({ onNext }: { onNext: () => void }) {
  return (
    <section className={styles.hero} aria-label="Escultura">
      <div className={styles.layer}>
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
      </div>
      <button type="button" className={styles.next} onClick={onNext} aria-label="Ver as fotos">
        <Arrow dir="down" />
      </button>
    </section>
  )
}
