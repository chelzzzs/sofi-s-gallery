# 001 — Galeria com carrossel e lightbox

Escopo: **Medium** · Status: implementada

## Contexto

Galeria pessoal de 15 fotos (2000×1333 paisagem e 1333×2000 retrato misturadas; tons quentes, clima de filme). Projeto novo em `C:\Users\miche\go\src\projects\photo-gallery`.

## Stack

- Vite + React 19 + TypeScript, CSS puro (CSS Modules)
- `vite-imagetools` (dev) pra gerar WebP em 2 tamanhos + `srcset`
- Sem libs de carrossel/lightbox

## User stories

- **US-1** Como visitante, navego pelas fotos num carrossel horizontal, arrastando no celular ou usando setas/teclado no desktop.
- **US-2** Como visitante, clico numa foto e ela abre em tela cheia (lightbox), onde navego entre as fotos e fecho quando quiser.

## Requisitos funcionais

| ID | Requisito |
|---|---|
| FR-001 | Carrossel horizontal com scroll-snap; cada foto mantém proporção original, altura fixa (~70vh desktop, ~55vh mobile). |
| FR-002 | Botões anterior/próximo e setas ← → do teclado movem uma foto; foto ativa centralizada. |
| FR-003 | Swipe nativo no toque; arrastar com mouse no desktop. |
| FR-004 | Indicador de posição (`03 / 15`) e barra de progresso fina. |
| FR-005 | Clique/Enter numa foto abre lightbox no índice dela. |
| FR-006 | Lightbox: foto em resolução cheia, `contain`, fundo quase preto; anterior/próximo, setas, swipe; Esc, botão ✕ e clique no fundo fecham. |
| FR-007 | Ao fechar o lightbox, o carrossel fica na última foto vista no lightbox. |
| FR-008 | Navegação circular (da 15 vai pra 1) no lightbox; no carrossel, para nas pontas. |
| FR-009 | Pré-carrega a foto anterior e a próxima no lightbox. |

## Não funcionais

| ID | Requisito |
|---|---|
| NFR-001 | Carrossel carrega variantes ≤1000px WebP; lightbox usa ~2000px WebP. |
| NFR-002 | Foco preso no lightbox enquanto aberto; foco volta pra foto de origem ao fechar. |
| NFR-003 | `prefers-reduced-motion` desliga transições. |
| NFR-004 | Sem scroll horizontal da página em 375px. |
| NFR-005 | `npm run build` sem erros de TS. |

## Fora de escopo

Filtros/categorias, grid/masonry, upload, CMS, roteamento por URL da foto, zoom com pinça, download, deploy.

## Perguntas em aberto

1. **Título da página / nome:** algo como seu nome de fotógrafo, ou sem título?
2. **Legendas:** quer texto por foto (local, data), ou só a imagem?
3. **Componentes de referência:** você mencionou componentes de referência — ainda vai mandar, ou sigo o desenho acima?
4. **Git:** só `git init` local, ou também criar repo no GitHub?

## Aceitação

- Todos FR/NFR verificados no browser (desktop e 375px), com screenshot.
- Teclado: Tab chega nas fotos, Enter abre, ←/→ navegam, Esc fecha e devolve o foco.
