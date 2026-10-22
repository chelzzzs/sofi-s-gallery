import { useEffect, useRef } from 'react'
import LightPillar from './LightPillar'
import styles from './Intro.module.css'

// Length of the fade-out (350ms delay + 900ms in Intro.module.css), plus slack.
const LEAVE_MS = 1400

type Props = {
  leaving: boolean
  onLeave: () => void
  onDone: () => void
}

export function Intro({ leaving, onLeave, onDone }: Props) {
  // transitionend never fires if the tab is hidden mid-fade; don't leave the
  // gallery waiting behind the intro in that case.
  const done = useRef(onDone)
  done.current = onDone
  useEffect(() => {
    if (!leaving) return
    const id = setTimeout(() => done.current(), LEAVE_MS)
    return () => clearTimeout(id)
  }, [leaving])

  return (
    <div
      className={styles.intro}
      data-leaving={leaving || undefined}
      onTransitionEnd={(e) => {
        if (leaving && e.target === e.currentTarget && e.propertyName === 'opacity') onDone()
      }}
    >
      <LightPillar
        className={styles.pillar}
        topColor="#ff4d1a"
        bottomColor="#ffd166"
        intensity={1.1}
        glowAmount={0.002}
        bloom={0.3}
        pillarWidth={3}
        pillarHeight={0.4}
        pillarRotation={4}
        rotationSpeed={0.3}
        interactive
        clickPulse
        intro
        quality="high"
        mixBlendMode="screen"
        twist={0.4}
        detail={3}
        flow={1.35}
        noiseIntensity={1.95}
        fade={0}
        lightMode={false}
      />
      <button type="button" className={styles.enter} onClick={onLeave} disabled={leaving}>
        Sofi’s Gallery
      </button>
    </div>
  )
}
