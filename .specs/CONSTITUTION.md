# Constitution — photo-gallery

Versão 1.0.0 · 2026-10-16

## Princípios

1. **Fotos em primeiro lugar.** A UI some em volta da imagem: fundo escuro neutro, controles discretos, nenhum corte que mude o enquadramento original (sem `object-fit: cover` em retrato/paisagem misturados).
2. **Dependências mínimas.** Runtime só React. Carrossel e lightbox feitos à mão com APIs nativas (scroll-snap, `<dialog>`, pointer events). Libs só em dev/build.
3. **Performance real.** Nada de carregar 15 JPEGs de 2000px de cara. Carrossel usa variantes reduzidas (WebP + `srcset`), lightbox carrega a resolução cheia sob demanda, com `loading="lazy"` fora da viewport.
4. **Acessível por teclado e toque.** Tudo que funciona com mouse funciona com teclado (setas, Esc, Tab) e com swipe no celular. `alt` em todas as fotos.
5. **Mobile como cidadão de primeira.** Layout testado em 375px; sem scroll horizontal da página.
6. **Simplicidade (YAGNI).** Sem backend, sem CMS, sem roteamento. Lista de fotos é um array tipado num arquivo.

## Governança

Mudança de princípio → bump de versão + nota em `.specs/project/STATE.md`.
