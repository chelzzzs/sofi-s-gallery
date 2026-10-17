import type { KeyboardEvent, MouseEvent } from 'react'
import type { Photo } from '../photos'
import DriftWall from './DriftWall'
import styles from './PhotoWall.module.css'
import { COLUMNS, tileAt } from './wallTiles'

type Props = {
  photos: Photo[]
  paused: boolean
  onOpen: (index: number, origin: DOMRect) => void
}

export function PhotoWall({ photos, paused, onOpen }: Props) {
  const items = photos.map((p) => ({ image: p.tile, title: p.alt }))

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
    <section className={styles.wall} aria-label="Fotos" onClick={onClick} onKeyDown={onKeyDown}>
      <div className={styles.inner}>
        <DriftWall
          items={items}
          columns={COLUMNS}
          tileWidth={228}
          tileHeight={132}
          gap={18}
          tilt={30}
          turn={-14}
          perspective={1200}
          depth={120}
          speed={42}
          direction="up"
          variance={0.45}
          parallax={1.1}
          lift={64}
          fade={0.4}
          dim={0.55}
          overlayColor="#000000"
          radius={14}
          roll={0}
          pauseOnHover={false}
          paused={paused}
          grayscale={false}
        />
      </div>
    </section>
  )
}
