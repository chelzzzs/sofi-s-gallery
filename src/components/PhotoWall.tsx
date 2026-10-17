import type { KeyboardEvent, MouseEvent } from 'react'
import type { Photo } from '../photos'
import DriftWall from './DriftWall'
import styles from './PhotoWall.module.css'

const COLUMNS = 3

type Props = {
  photos: Photo[]
  onOpen: (index: number) => void
}

// DriftWall lays item i into column i % COLUMNS, row floor(i / COLUMNS), and
// tags each tile "col-copy-row"; map that back to the photo index.
const indexOf = (target: EventTarget) => {
  const tile = (target as Element).closest<HTMLElement>('[data-tile-id]')
  if (!tile) return null
  const [col, , row] = tile.dataset.tileId!.split('-').map(Number)
  return row * COLUMNS + col
}

export function PhotoWall({ photos, onOpen }: Props) {
  const items = photos.map((p) => ({ image: p.tile, title: p.alt }))

  const onClick = (e: MouseEvent) => {
    const i = indexOf(e.target)
    if (i !== null) onOpen(i)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    const i = indexOf(e.target)
    if (i === null) return
    e.preventDefault()
    onOpen(i)
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
          grayscale={false}
        />
      </div>
    </section>
  )
}
