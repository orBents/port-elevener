# Pré-visualização no Decap CMS

## Como usar

No painel `/admin`, abra um projeto, **Página Sobre** ou **Aparência do site**. O painel de prévia do Decap é atualizado à medida que os campos são alterados, antes de salvar.

- **Projetos:** mostra categoria, título, resumo, capa, texto, galeria, legendas e vídeos. Imagens selecionadas mas ainda não salvas são resolvidas com `getAsset()`.
- **Página Sobre:** mostra o cabeçalho editorial, retrato, biografia, especialidades, formação, trajetória e contato. As chaves de visibilidade continuam sendo respeitadas.
- **Aparência do site:** mostra simultaneamente um quadro desktop e outro de 390 px. Cores, famílias, escalas, espaçamentos, bordas, raios, sombra e quantidade de colunas respondem à edição atual, sem exigir publicação.

Para alterar a aparência, use apenas os campos guiados em **Aparência do site**. Ao salvar, o CMS verifica o formato `#RRGGBB` e os pares de contraste obrigatórios. Uma combinação inválida interrompe o salvamento e mostra o token, a razão medida e o mínimo exigido.

## Arquitetura

`src/pages/admin.astro` inicializa o Decap manualmente e registra templates React compatíveis com a API pública do CMS (`registerPreviewTemplate`). Como `site` é uma coleção baseada em arquivos, o Decap escolhe o template pelo nome de cada arquivo: `about` e `theme`. Eles usam o helper `getAsset`, portanto não dependem da imagem já existir no repositório.

Os valores são centralizados em `src/lib/design-system.ts`: defaults, normalização tipográfica, padrão HEX e `contrastMessage`. O site Astro os transforma em custom properties no layout; o preview React consome exatamente os mesmos defaults, função tipográfica, nomes de tokens e limites. A configuração publicada de aparência é embutida pelo build em `/admin`, para que Projeto e Sobre usem os tokens que estão no site público. `src/styles/decap-preview.css` usa a mesma camada de propriedades `--color-*`, `--layout-*`, `--font-*` e `--radius` adotada por `src/styles/design-tokens.css`.

A validação contextual de aparência é registrada no evento `preSave`. Ela reutiliza `contrastMessage` e bloqueia o commit do CMS caso haja HEX inválido ou contraste insuficiente. A validação Zod em `src/content.config.ts` continua sendo a proteção equivalente do build.

## Limitações conhecidas

O Decap renderiza previews em React; componentes `.astro` não podem ser renderizados diretamente nele. Por isso a estrutura do preview é uma implementação leve que compartilha tokens e regras de layout, não uma montagem dos componentes Astro em tempo real.

O preview de projeto não abre o lightbox, e os filtros da prévia de aparência são representativos, não interativos. Iframes externos de YouTube/Vimeo dependem das permissões do navegador e podem exibir bloqueios do provedor dentro do painel. O preview de Projeto e Sobre usa os valores publicados de aparência como base; enquanto a tela **Aparência do site** está aberta, somente ela consegue representar as configurações ainda não salvas.

Essas limitações não afetam o conteúdo publicado: o build Astro permanece a fonte de renderização do site público.
