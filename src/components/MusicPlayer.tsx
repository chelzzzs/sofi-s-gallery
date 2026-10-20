import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { PauseIcon, PlayIcon, VolumeHighIcon, VolumeLowIcon } from '@hugeicons/core-free-icons'
import ElasticSlider from './ElasticSlider'
import styles from './MusicPlayer.module.css'

// Visual only for now: no audio is wired up yet, so play/pause and the volume
// slider change what is on screen and nothing else.
export function MusicPlayer() {
  const [playing, setPlaying] = useState(false)

  return (
    <section className={styles.player} aria-label="Player de música">
      <div className={styles.card} data-playing={playing || undefined}>
        <button
          type="button"
          className={styles.play}
          aria-label={playing ? 'Pausar' : 'Tocar'}
          aria-pressed={playing}
          onClick={() => setPlaying((p) => !p)}
        >
          <HugeiconsIcon icon={playing ? PauseIcon : PlayIcon} size={22} strokeWidth={1.75} />
        </button>

        <div className={styles.info}>
          <span className={styles.title}>Trilha sonora</span>
          <span className={styles.bars} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
        </div>

        <ElasticSlider
          className={styles.volume}
          ariaLabel="Volume"
          defaultValue={50}
          leftIcon={<HugeiconsIcon icon={VolumeLowIcon} size={20} />}
          rightIcon={<HugeiconsIcon icon={VolumeHighIcon} size={20} />}
          maxStretch={60}
          bounce={0.5}
          growOnHover
          wheel={false}
          orientation="horizontal"
          iconPlacement="outside"
          valuePosition="top"
          thickness={6}
          activeThickness={12}
          radius={40}
          restOpacity={0.7}
          fillFrom={0}
          isStepped={false}
          stepSize={10}
          ticks={false}
          thumb={false}
          jumpToClick
          rangeColor="#ffffff"
        />
      </div>
    </section>
  )
}
