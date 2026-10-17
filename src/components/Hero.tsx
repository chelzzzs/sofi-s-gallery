import { Arrow } from './Arrow'
import DitherVeil from './DitherVeil'
import styles from './Hero.module.css'

export const HERO_SRC =
  'https://images.unsplash.com/photo-1595942548948-77efc2e0b619?q=80&w=1400&auto=format&fit=crop'

export function Hero({ onNext }: { onNext: () => void }) {
  return (
    <section className={styles.hero} aria-label="Câmera fotográfica">
      <div className={styles.layer}>
        <DitherVeil
          src={HERO_SRC}
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
          contrast={1.35}
          brightness={-0.07}
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
