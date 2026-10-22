import { useEffect, useRef, useState } from 'react'
import { loadSpotifyApi, type EmbedController } from '../spotify'
import styles from './MusicPlayer.module.css'

// Official Spotify embed: the tracks stay licensed through Spotify. Visitors
// signed in to Spotify hear the full song; everyone else gets a 30s preview.
const TRACKS = [
  { id: '1B9HE8h6ZnljGk0LZ2H30D', title: 'Heaven', artist: 'RM' },
  { id: '62HKW77nt6tudsIHXT2A0M', title: 'Come back to me', artist: 'RM' },
  { id: '2N0SPREDYqILVEFSsWF5N5', title: 'Love Me Again', artist: 'V' },
  { id: '1ZNolq7VI7efGlh2hb2VVr', title: 'Into the Sun', artist: 'BTS' },
  { id: '5yvVYFDUpbnjcnRBgjwTzM', title: 'Dracula', artist: 'Tame Impala, JENNIE' },
  { id: '7CyPwkp0oE8Ro9Dd5CUDjW', title: 'One Of The Girls', artist: 'The Weeknd, JENNIE, Lily-Rose Depp' },
  { id: '2IFND3phjzIG1RcPnHh2hP', title: 'Like Animals', artist: 'BTS' },
  { id: '2chbuybiy6aDDBC985tJcP', title: 'ZEN', artist: 'JENNIE' },
  { id: '6T17ZI0glfM2IGLdUwtnLK', title: 'JoyRide', artist: 'CORTIS' },
]

const uri = (id: string) => `spotify:track:${id}`

type Props = {
  // Browsers only allow sound after the visitor interacts with the page; the
  // click on the intro button is that interaction, so playback starts then.
  autoPlay: boolean
}

export function MusicPlayer({ autoPlay }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const controller = useRef<EmbedController | null>(null)
  const loaded = useRef(TRACKS[0].id)
  const playing = useRef(false)
  const advancing = useRef(false)
  const [ready, setReady] = useState(false)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const box = host.current!
    const slot = document.createElement('div')
    box.appendChild(slot)
    let alive = true
    let made: EmbedController | null = null

    loadSpotifyApi().then((api) => {
      if (!alive) return
      api.createController(slot, { uri: uri(loaded.current), width: '100%', height: '100%' }, (c) => {
        if (!alive) return c.destroy()
        made = c
        controller.current = c
        c.addListener('ready', () => setReady(true))
        c.addListener('playback_update', ({ data }) => {
          // Move on to the next song when one finishes.
          const ended = data.duration > 0 && data.position >= data.duration - 500
          if (ended && !advancing.current) {
            advancing.current = true
            setCurrent((i) => (i + 1) % TRACKS.length)
          }
        })
      })
    })

    return () => {
      alive = false
      made?.destroy()
      controller.current = null
      setReady(false)
      box.replaceChildren()
    }
  }, [])

  useEffect(() => {
    if (!autoPlay || !ready || playing.current) return
    playing.current = true
    controller.current?.play()
  }, [autoPlay, ready])

  // Keep the current song's button in view, scrolling only the row (never the
  // page), e.g. when the player moves on to the next track by itself.
  useEffect(() => {
    const row = list.current
    const button = row?.children[current] as HTMLElement | undefined
    if (!row || !button) return
    const left = button.offsetLeft - row.offsetLeft
    if (left < row.scrollLeft || left + button.offsetWidth > row.scrollLeft + row.clientWidth * 0.85)
      row.scrollTo({ left: left - 8, behavior: 'smooth' })
  }, [current])

  useEffect(() => {
    const c = controller.current
    const { id } = TRACKS[current]
    if (!c || !ready || loaded.current === id) return
    loaded.current = id
    advancing.current = false
    c.loadUri(uri(id))
    if (playing.current) c.play()
  }, [current, ready])

  return (
    <section className={styles.player} aria-label="Player de música">
      <div className={styles.box}>
        <div ref={list} className={styles.tracks} role="group" aria-label="Escolher música">
          {TRACKS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              className={styles.track}
              aria-pressed={i === current}
              onClick={() => {
                playing.current = true
                setCurrent(i)
              }}
            >
              <span className={styles.title}>{t.title}</span>
              <span className={styles.artist}>{t.artist}</span>
            </button>
          ))}
        </div>

        <div ref={host} className={styles.embed} />
      </div>
    </section>
  )
}
