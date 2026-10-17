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

## 006 — Câmera no lugar da escultura (2026-10-16)
- `Sculpture` → `Hero`. Imagem: câmera em fundo preto (Unsplash photo-1595942548948-77efc2e0b619, licença Unsplash, hotlink).
- Fundo da foto é tecido cinza, não preto: `contrast` 1.35 / `brightness` -0.07 e máscara radial na camada pra não aparecer a borda retangular.
