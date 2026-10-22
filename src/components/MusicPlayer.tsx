import { useState } from 'react'
import styles from './MusicPlayer.module.css'

// Official Spotify embeds: the tracks stay licensed through Spotify. Visitors
// signed in to Spotify hear the full song; everyone else gets a 30s preview.
// One embed at a time, so two songs never play over each other.
const TRACKS = [
  { id: '1ZNolq7VI7efGlh2hb2VVr', title: 'Into the Sun', artist: 'BTS' },
  { id: '5yvVYFDUpbnjcnRBgjwTzM', title: 'Dracula', artist: 'Tame Impala, JENNIE' },
  { id: '7CyPwkp0oE8Ro9Dd5CUDjW', title: 'One Of The Girls', artist: 'The Weeknd, JENNIE, Lily-Rose Depp' },
  { id: '2IFND3phjzIG1RcPnHh2hP', title: 'Like Animals', artist: 'BTS' },
]

export function MusicPlayer() {
  const [current, setCurrent] = useState(0)
  const track = TRACKS[current]

  return (
    <section className={styles.player} aria-label="Player de música">
      <div className={styles.box}>
        <div className={styles.tracks} role="group" aria-label="Escolher música">
          {TRACKS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              className={styles.track}
              aria-pressed={i === current}
              onClick={() => setCurrent(i)}
            >
              <span className={styles.title}>{t.title}</span>
              <span className={styles.artist}>{t.artist}</span>
            </button>
          ))}
        </div>

        <iframe
          key={track.id}
          className={styles.embed}
          title={`Player do Spotify: ${track.title}, ${track.artist}`}
          src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </section>
  )
}
