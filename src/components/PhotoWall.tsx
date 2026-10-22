import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import type { Photo } from '../photos'
import DriftWall from './DriftWall'
import styles from './PhotoWall.module.css'
import { COLUMNS, tileAt } from './wallTiles'

type Props = {
  photos: Photo[]
  paused: boolean
  releaseKey: number
  onOpen: (index: number, origin: DOMRect) => void
}

export function PhotoWall({ photos, paused, releaseKey, onOpen }: Props) {
  // Must stay the same array across renders: DriftWall resets every column to
  // its starting position whenever `items` changes identity.
  const items = useMemo(() => photos.map((p) => ({ image: p.tile, title: p.alt })), [photos])

  // On phones the desktop tiles fill the screen with the middle column and cut
  // off the outer two; smaller tiles keep all three columns in view.
  const [narrow, setNarrow] = useState(() => matchMedia('(max-width: 600px)').matches)
  useEffect(() => {
    const mq = matchMedia('(max-width: 600px)')
    const onChange = () => setNarrow(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  // The sideways turn also pulls the right column toward the viewer and off a
  // narrow screen, so phones get a gentler turn too.
  const size = narrow
    ? { width: 124, height: 72, gap: 10, radius: 10, lift: 36, turn: -5 }
    : { width: 228, height: 132, gap: 18, radius: 14, lift: 64, turn: -14 }

  // The wall animates every frame; stop it while it's scrolled out of view.
  const section = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    io.observe(section.current!)
    return () => io.disconnect()
  }, [])

  const onClick = (e: MouseEvent) => {
    const tile = tileAt(e.target, e.clientX, e.clientY)
    if (tile) onOpen(tile.index, tile.rect)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    const tile = tileAt(e.target)
    if (!tile) return
    e.preventDefault()
    onOpen(tile.index, tile.rect)
  }

  return (
    <section ref={section} className={styles.wall} aria-label="Fotos" onClick={onClick} onKeyDown={onKeyDown}>
      <div className={styles.inner}>
        <DriftWall
          items={items}
          columns={COLUMNS}
          tileWidth={size.width}
          tileHeight={size.height}
          gap={size.gap}
          tilt={30}
          turn={size.turn}
          perspective={1200}
          depth={120}
          speed={42}
          direction="up"
          variance={0.45}
          parallax={1.1}
          lift={size.lift}
          fade={0.4}
          dim={0.55}
          overlayColor="#000000"
          radius={size.radius}
          roll={0}
          pauseOnHover={false}
          paused={paused || !visible}
          releaseKey={releaseKey}
          grayscale={false}
        />
      </div>
    </section>
  )
}
