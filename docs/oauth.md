# OAuth GitHub para o Decap CMS

## Modelo de segurança

O Decap CMS recebe, na sessão do administrador, um token OAuth GitHub necessário para criar commits pelo backend `github`. O segredo do aplicativo OAuth nunca é entregue ao navegador: ele fica apenas nas variáveis protegidas das Pages Functions.

O acesso administrativo é autorizado pelo GitHub: somente colaboradores com permissão de escrita no repositório podem persistir conteúdo. Mantenha 2FA ativo e conceda acesso apenas ao artista e administradores necessários.

## Configuração de produção

1. Crie uma OAuth App no GitHub em **Settings > Developer settings > OAuth Apps**.
2. Defina a callback URL exatamente como `https://SEU-DOMINIO/api/callback`; não habilite curinga.
3. No Cloudflare Pages, em **Settings > Variables and Secrets**, defina para produção:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET` (Secret)
   - `OAUTH_ALLOWED_ORIGIN=https://SEU-DOMINIO`
   - `OAUTH_REDIRECT_URI=https://SEU-DOMINIO/api/callback`
4. Edite `public/admin/config.yml` e substitua `YOUR_GITHUB_OWNER/YOUR_REPOSITORY` e `YOUR-PAGES-DOMAIN`.
5. Faça novo deploy e teste login, criação de conteúdo e publicação.

Para um repositório privado, a autorização deve solicitar o escopo `repo`. É a permissão mínima disponível no OAuth clássico do GitHub para gravar em repositórios privados, mas não fica restrita a um único repositório. Limite a conta autorizada a administradores necessários, mantenha 2FA ativo e revogue o token após a homologação se ele não for mais necessário.

As Functions validam, em toda tentativa, que a origem da requisiÃ§Ã£o Ã© igual a `OAUTH_ALLOWED_ORIGIN` e que `OAUTH_REDIRECT_URI` aponta para essa mesma origem em `/api/callback`. O `state` fica em cookie `HttpOnly`, `SameSite=Lax`, limitado a 10 minutos e Ã© invalidado na callback. Em HTTPS o cookie usa o prefixo `__Host-` e `Secure`; o fallback sem esse prefixo Ã© exclusivo para `http://localhost`.

## Desenvolvimento local

Copie `.env.example` para `.dev.vars`, preencha valores de desenvolvimento e não versione esse arquivo. A callback local deve corresponder exatamente à configurada na OAuth App. O cookie `Secure` é aplicado automaticamente para URLs HTTPS e fica ausente apenas em `http://localhost`, para permitir o teste local. Use uma OAuth App separada para desenvolvimento e produção sempre que possível.

## Recuperação e revogação

- Remova o colaborador GitHub para revogar o acesso ao CMS.
- Revogue tokens em GitHub **Settings > Applications**.
- Em caso de suspeita de exposição, gere um novo Client Secret, atualize o Secret no Cloudflare e invalide o anterior no GitHub.
