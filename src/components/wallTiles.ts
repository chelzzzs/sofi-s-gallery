export const COLUMNS = 3

// DriftWall lays item i into column i % COLUMNS, row floor(i / COLUMNS), and
// tags each tile "col-copy-row"; map that back to the photo index.
const indexOfTile = (tile: HTMLElement) => {
  const [col, , row] = tile.dataset.tileId!.split('-').map(Number)
  return row * COLUMNS + col
}

const imageRect = (tile: HTMLElement) => tile.querySelector('.drift-wall__inner')!.getBoundingClientRect()

export const tileAt = (target: EventTarget) => {
  const tile = (target as Element).closest<HTMLElement>('[data-tile-id]')
  return tile ? { index: indexOfTile(tile), rect: imageRect(tile) } : null
}

// The wall repeats every photo several times; pick the on-screen copy closest
// to the centre so the lightbox can fly back into it.
export const tileRect = (index: number): DOMRect | null => {
  let best: DOMRect | null = null
  let bestDist = Infinity
  document.querySelectorAll<HTMLElement>('[data-tile-id]').forEach((tile) => {
    if (indexOfTile(tile) !== index) return
    const r = imageRect(tile)
    if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return
    const dist = Math.hypot(r.left + r.width / 2 - innerWidth / 2, r.top + r.height / 2 - innerHeight / 2)
    if (dist < bestDist) {
      bestDist = dist
      best = r
    }
  })
  return best
}
