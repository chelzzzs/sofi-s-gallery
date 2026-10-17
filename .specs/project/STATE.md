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
