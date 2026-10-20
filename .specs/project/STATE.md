# STATE — photo-gallery

## Feito
- 001-galeria: carrossel (scroll-snap + drag de mouse) e lightbox (`<dialog>`, swipe, circular). Verificado em desktop e 375px.

## Decisões
- Sem título, sem legendas, sem libs de UI. Fotos em `src/photos/NN.jpg`, alt em `src/photos.ts`.
- `vite-imagetools` gera WebP 700/1200 (carrossel) e 1200/2000 (lightbox).

## Próximos passos possíveis
- Deploy (fora do escopo da 001).

## 002 — Tela inicial (2026-10-16)
- `Intro` com `LightPillar` (WebGL2, código fornecido pela usuária) + botão "Sofi’s Gallery"; clique faz fade e libera a galeria (`inert` até entrar).
- Fix no LightPillar: removido `loseContext()` do cleanup — com StrictMode o efeito re-roda no mesmo canvas e o contexto ficava perdido (tela branca).

## 003 — Transição + escultura (2026-10-16)
- Fases no App: `intro` → `leaving` → `done`. No clique o pilar escala/desfoca ("atravessar a luz"), o botão se dissolve e a galeria sai de zoom+blur.
- Seção da escultura (`Sculpture` + `DitherVeil`, dep `ogl`) em 100svh acima do carrossel; montada só no `leaving` pra a animação de dither tocar na entrada. Imagem (Unsplash, hotlink) pré-carregada durante a intro.

## 004 — DriftWall no lugar do carrossel (2026-10-16)
- Carrossel removido. `PhotoWall` envolve o `DriftWall` (código da usuária, intacto) com as 15 fotos em tiles WebP 600px.
- Lightbox mantido: clique/Enter num tile abre a foto (índice = linha × 3 + coluna, a partir do `data-tile-id`).
- Tiles cortam as fotos em 228×132 (decisão da usuária; contraria o princípio 1 da Constitution pro mural, o lightbox mostra a foto inteira).
- Em 375px só a coluna central aparece inteira; avaliar tileWidth menor no mobile.

## 005 — Parallax scrolling (2026-10-16)
- CSS scroll-driven animations (`view-timeline`), sem JS: escultura afunda a ~meia velocidade e escurece ao sair; mural sobe mais rápido e endireita ao entrar; seta some no primeiro quarto.
- Só com `prefers-reduced-motion: no-preference` e `@supports (animation-timeline: view())`; sem suporte (Firefox sem a flag) a página só rola normal.

## 007 — Lightbox com transição de voo (2026-10-17)
- Abrir: a foto sai do tile clicado (mesma posição, recorte "cover" e cantos de 14px via clip-path) e cresce até o centro; fundo escurece, controles aparecem depois.
- Fechar: volta pro tile visível mais perto do centro com aquela foto (`tileRect` em `wallTiles.ts`) e some no fim; sem tile visível, encolhe e some.
- Trocar foto: desliza na direção da navegação.
- A foto do lightbox tem tamanho pela proporção (`cqw/cqh`), não pelo arquivo: antes media 0×0 até carregar e a animação quebrava. O tile (600px) fica de fundo até a imagem grande chegar.
- Lição: efeitos que medem e animam precisam cancelar animações anteriores (StrictMode roda o efeito 2×).

## 008 — Cliques no mural e pausa com foto aberta (2026-10-17)
- Bug: ~metade dos cliques caía no `.drift-wall__track` (mesmo plano 3D dos tiles) ou, no topo inclinado, na própria seção → nada abria. Fix: plano/coluna/trilho com `pointer-events: none` (DriftWall.css) + fallback geométrico em `tileAt` (tile cuja imagem cobre o ponto).
- DriftWall ganhou prop `paused`: congela colunas e inclinação; ao soltar, as colunas aceleram de novo do zero. App pausa enquanto o lightbox está montado (inclui a animação de fechar, pra foto pousar exatamente no tile).

## 009 — Cross fade ao fechar (2026-10-17)
- Problema: a foto voa reta e o mural é inclinado, e o tile clicado "apagava" ao abrir (pointerleave/blur) e reacendia ao fechar (foco restaurado) → piscada.
- DriftWall pausado não solta o tile ativo (release/pointerleave ignorados) → o tile clicado fica aceso por baixo da foto.
- Fechar (600ms): fundo some nos primeiros ~60%, a foto se dissolve na segunda metade do voo até sumir em cima do tile. Se a foto mudou, a cópia de destino é acesa com `data-returning` e depois volta ao normal.
- Depois de fechar, o mural segue congelado mais 600ms (`SETTLE_MS` em App) até o tile assentar; abrir outra foto nesse intervalo cancela o descongelamento.
- Bug do "corte" ao descongelar: `items` do PhotoWall era um array novo a cada render; o DriftWall reseta os offsets das colunas quando `items` muda de identidade. Agora `useMemo`. Lição: props de array/objeto pro DriftWall precisam ser estáveis.

## 010 — Player de música (só visual) (2026-10-20)
- `MusicPlayer` abaixo do mural: play/pausa (só troca ícone e anima o equalizador), título "Trilha sonora" e o `ElasticSlider` (código da usuária) de volume. Sem áudio ainda — falta o arquivo da música.
- Deps: `@hugeicons/react`, `@hugeicons/core-free-icons`.
- Mural ganhou degradê no pé (`.wall::after`) pra não cortar a última linha em cima do player.
- Player redesenhado no layout do template enviado (capa, título/artista, progresso com tempos, anterior/play/próxima, volume). Ainda visual: "tocar" roda um relógio sobre duração fictícia (`DURATION` 3:36), progresso arrastável; capa = foto 14.
- Bug do ElasticSlider: o cleanup cancelava o rAF sem zerar `m.raf`; após o remount do StrictMode `kick()` nunca mais agendava quadro e a barra não acompanhava o arrasto. Fix: `m.raf = 0` no cleanup.
