type ImgOutput = { src: string; srcset: string; w: number; h: number }

export type Photo = {
  id: string
  alt: string
  tile: string
  full: ImgOutput
}

const tiles = import.meta.glob<string>('./photos/*.jpg', {
  query: '?w=600&format=webp',
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

export const photos: Photo[] = Object.keys(fulls)
  .sort()
  .map((path) => {
    const id = path.match(/(\d+)\.jpg$/)![1]
    return { id, alt: alts[id] ?? '', tile: tiles[path], full: fulls[path] }
  })

// Second set, shown in the carousel under the music player.
export type CarouselPhoto = { src: string; alt: string; title: string }

const carouselSources = import.meta.glob<string>('./photos-2/*.jpg', {
  query: '?w=1400&format=webp',
  import: 'default',
  eager: true,
})

const carouselText: Record<string, [title: string, alt: string]> = {
  '01': ['Galpão', 'Galpão de madeira ao lado de um cacto, iluminado pelo sol'],
  '02': ['Galpão e cacto', 'Galpão de madeira com um cacto e palmeiras ao fundo'],
  '03': ['Bananeira', 'Cacho de bananas verdes contra o céu azul'],
  '04': ['Gaivota', 'Gaivota voando no céu azul'],
  '05': ['Veleiros', 'Dois veleiros ancorados diante de um morro'],
  '06': ['Companhia', 'Mulher de costas com um cachorro pomerânia no ombro, olhando a água'],
  '07': ['Barco de pesca', 'Barco de pesca colorido com a bandeira do Brasil'],
  '08': ['Reflexos', 'Reflexos dourados do sol na água'],
  '09': ['Bandeira', 'Bandeira do Brasil num barco, com montanhas ao fundo no fim de tarde'],
  '10': ['Abraço', 'Mulher de óculos abraçando um cachorro pomerânia'],
  '11': ['Pasto', 'Bois no pasto, um deitado em primeiro plano'],
  '12': ['Guará', 'Guará vermelho voando no céu azul'],
  '13': ['Guará em voo', 'Guará vermelho em voo, de asas abertas'],
}

export const carouselPhotos: CarouselPhoto[] = Object.keys(carouselSources)
  .sort()
  .map((path) => {
    const id = path.match(/(\d+)\.jpg$/)![1]
    const [title, alt] = carouselText[id] ?? ['', '']
    return { src: carouselSources[path], alt, title }
  })
