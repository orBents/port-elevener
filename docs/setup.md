# Desenvolvimento local

## Pré-requisitos

- Node.js 20.12 ou superior (veja `.nvmrc`)
- npm 10 ou superior

## Instalação

```powershell
npm install
npm run dev
```

O site público estará em `http://localhost:4321`. A rota administrativa é `http://localhost:4321/admin`.

Para testar Functions junto ao build estático, use `npm run pages:dev`; nesse modo, abra o site em `http://localhost:8788` e configure temporariamente `public/admin/config.yml` para usar esse domínio. O OAuth só funcionará após configurar uma aplicação OAuth GitHub e as variáveis locais descritas em [oauth.md](./oauth.md).

## Conteúdo da POC

Os projetos ficam em `src/data/projects`. Cada arquivo Markdown é validado por `src/content.config.ts` durante o build. A coleção já prevê animação, storyboard, sketchbook, ilustração, projeto autoral, capa e uma lista de mídias.

O arquivo `public/admin/config.yml` já aponta para o repositório e domínio publicados. Para um repositório privado, ele usa `auth_scope: repo`, exigido pelo GitHub para criar commits privados. Não altere essa configuração ao testar somente o site público localmente.
