type ImgOutput = { src: string; srcset: string; w: number; h: number }

export type Photo = {
  id: string
  alt: string
  ratio: number
  thumb: ImgOutput
  full: ImgOutput
}

const thumbs = import.meta.glob<ImgOutput>('./photos/*.jpg', {
  query: '?w=700;1200&format=webp&as=img',
  import: 'default',
  eager: true,
})

const fulls = import.meta.glob<ImgOutput>('./photos/*.jpg', {
  query: '?w=1200;2000&format=webp&as=img',
  import: 'default',
  eager: true,
})

const alts: Record<string, string> = {
  '01': 'Laranjas empilhadas, uma delas cortada ao meio',
  '02': 'Prédio em construção iluminado de laranja atrás de fios elétricos',
  '03': 'Caminhonete Ford vermelha antiga estacionada, vista de frente',
  '04': 'Traseira de caminhonete Ford vermelha e branca',
  '05': 'Cachorro preto deitado em frente à porta de uma igreja com estátua de anjo',
  '06': 'Lua crescente no céu escuro',
  '07': 'Lua cheia alaranjada no céu escuro',
  '08': 'Caranguejo pequeno sobre uma pedra',
  '09': 'Rosa branca em preto e branco',
  '10': 'Close de gato cinza de olhos âmbar',
  '11': 'Gaivota voando diante de um morro coberto de mata',
  '12': 'Bandeira do Brasil rasgada contra nuvens carregadas',
  '13': 'Barraca de maçãs à beira da estrada',
  '14': 'Estrada sinuosa entre plantações',
  '15': 'Senhor de chapéu descansando num banco de praça',
}

export const photos: Photo[] = Object.keys(thumbs)
  .sort()
  .map((path) => {
    const id = path.match(/(\d+)\.jpg$/)![1]
    const full = fulls[path]
    return { id, alt: alts[id] ?? '', ratio: full.w / full.h, thumb: thumbs[path], full }
  })
