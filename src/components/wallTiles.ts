export const COLUMNS = 3

// DriftWall lays item i into column i % COLUMNS, row floor(i / COLUMNS), and
// tags each tile "col-copy-row"; map that back to the photo index.
const indexOfTile = (tile: HTMLElement) => {
  const [col, , row] = tile.dataset.tileId!.split('-').map(Number)
  return row * COLUMNS + col
}

const imageRect = (tile: HTMLElement) => tile.querySelector('.drift-wall__inner')!.getBoundingClientRect()

const centreDistance = (r: DOMRect, x: number, y: number) =>
  Math.hypot(r.left + r.width / 2 - x, r.top + r.height / 2 - y)

// Nearest tile whose visible image covers the point. Parts of the tilted wall
// sit behind the page plane, where the browser's hit test lands on the section
// instead of the tile, so clicks there are resolved by geometry.
const tileUnder = (x: number, y: number) => {
  let best: HTMLElement | null = null
  let bestDist = Infinity
  document.querySelectorAll<HTMLElement>('[data-tile-id]').forEach((tile) => {
    const r = imageRect(tile)
    if (x < r.left || x > r.right || y < r.top || y > r.bottom) return
    const dist = centreDistance(r, x, y)
    if (dist < bestDist) {
      bestDist = dist
      best = tile
    }
  })
  return best
}

export const tileAt = (target: EventTarget, x?: number, y?: number) => {
  const tile =
    (target as Element).closest<HTMLElement>('[data-tile-id]') ??
    (x !== undefined && y !== undefined ? tileUnder(x, y) : null)
  return tile ? { index: indexOfTile(tile), rect: imageRect(tile) } : null
}

export type ReturnTarget = { tile: HTMLElement; rect: DOMRect }

// Where the lightbox flies back to: the tile that was clicked, still lifted
// under the open photo, if it shows this photo; otherwise the on-screen copy
// closest to the centre (the wall repeats every photo several times).
export const returnTarget = (index: number): ReturnTarget | null => {
  const active = document.querySelector<HTMLElement>('.drift-wall__tile.is-active')
  if (active && indexOfTile(active) === index) return { tile: active, rect: imageRect(active) }

  let best: ReturnTarget | null = null
  let bestDist = Infinity
  document.querySelectorAll<HTMLElement>('[data-tile-id]').forEach((tile) => {
    if (indexOfTile(tile) !== index) return
    const r = imageRect(tile)
    if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return
    const dist = centreDistance(r, innerWidth / 2, innerHeight / 2)
    if (dist < bestDist) {
      bestDist = dist
      best = { tile, rect: r }
    }
  })
  return best
}
