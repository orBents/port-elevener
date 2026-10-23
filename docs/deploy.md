# Publicação no Cloudflare Pages

Não execute publicação antes de concluir a configuração OAuth descrita em [oauth.md](./oauth.md).

1. Crie um repositório GitHub e envie este projeto para a branch `main`.
2. Em Cloudflare Dashboard, crie um projeto Pages conectado ao repositório.
3. Configure:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node: `20` ou superior
4. Cadastre as variáveis e secrets de produção.
5. Configure a OAuth App com a URL final da Pages ou do domínio próprio.
6. Faça um deploy inicial; então valide `/`, `/about`, `/admin`, OAuth, criação de projeto no CMS e o deploy disparado pelo commit do Decap.

Não use `wrangler deploy` nem `wrangler pages deploy` para esta POC com Git integration. O push no GitHub é o gatilho de publicação.
