import { useEffect, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { NextIcon, PauseIcon, PlayIcon, PreviousIcon, VolumeHighIcon, VolumeLowIcon } from '@hugeicons/core-free-icons'
import { photos } from '../photos'
import ElasticSlider from './ElasticSlider'
import styles from './MusicPlayer.module.css'

// Visual only for now: there is no audio file yet, so "playing" just runs a
// clock over a placeholder duration. When the track arrives, `elapsed` and
// `DURATION` come from the <audio> element instead.
const DURATION = 216
const COVER = photos.find((p) => p.id === '14')!

const clock = (seconds: number) => {
  const s = Math.max(0, Math.round(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setElapsed((t) => (t + 0.25) % DURATION), 250)
    return () => clearInterval(id)
  }, [playing])

  return (
    <section className={styles.player} aria-label="Player de música">
      <div className={styles.card}>
        <img className={styles.cover} src={COVER.tile} alt="" />

        <div className={styles.head}>
          <p className={styles.title}>Trilha sonora</p>
          <p className={styles.artist}>Sofi’s Gallery</p>
        </div>

        <div className={styles.body}>
          <ElasticSlider
            className={styles.progress}
            ariaLabel="Posição da faixa"
            value={(elapsed / DURATION) * 100}
            onChange={(v: number) => setElapsed((v / 100) * DURATION)}
            formatValue={() => clock(elapsed)}
            leftIcon={null}
            rightIcon={null}
            valuePosition="none"
            thickness={5}
            activeThickness={9}
            maxStretch={24}
            restOpacity={1}
            trackColor="rgb(255 255 255 / 0.14)"
            rangeColor="rgb(255 255 255 / 0.82)"
          />
          <div className={styles.times}>
            <span>{clock(elapsed)}</span>
            <span>−{clock(DURATION - elapsed)}</span>
          </div>

          <div className={styles.controls}>
            <div className={styles.transport}>
              <button type="button" className={styles.skip} aria-label="Faixa anterior" onClick={() => setElapsed(0)}>
                <HugeiconsIcon icon={PreviousIcon} size={22} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                className={styles.toggle}
                aria-label={playing ? 'Pausar' : 'Tocar'}
                aria-pressed={playing}
                onClick={() => setPlaying((p) => !p)}
              >
                <HugeiconsIcon icon={playing ? PauseIcon : PlayIcon} size={24} strokeWidth={1.75} />
              </button>
              <button type="button" className={styles.skip} aria-label="Próxima faixa" onClick={() => setElapsed(0)}>
                <HugeiconsIcon icon={NextIcon} size={22} strokeWidth={1.75} />
              </button>
            </div>

            <ElasticSlider
              className={styles.volume}
              ariaLabel="Volume"
              defaultValue={70}
              leftIcon={<HugeiconsIcon icon={VolumeLowIcon} size={18} />}
              rightIcon={<HugeiconsIcon icon={VolumeHighIcon} size={18} />}
              maxStretch={60}
              bounce={0.5}
              growOnHover
              wheel={false}
              orientation="horizontal"
              iconPlacement="outside"
              valuePosition="none"
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
              trackColor="rgb(255 255 255 / 0.14)"
              rangeColor="rgb(255 255 255 / 0.82)"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
