# Roteiro de homologação autenticada

Este roteiro modifica o repositório apenas nos passos marcados como **escrita**. Execute-os somente após autorizar uma alteração controlada. Para cada alteração, confira o commit criado pelo Decap e reverta-o pelo GitHub caso seja necessário.

## Preparação

1. Acesse a URL publicada em uma janela anônima e abra `/admin`.
2. Confirme que aparece **Login with GitHub** e entre com uma conta que tenha somente acesso necessário ao repositório privado.
3. Após o login, abra **Perfil e aparência > Aparência do site** e confirme que o painel de prévia aparece.

## Aparência — leitura e prévia

Sem salvar, altere cada campo abaixo e confirme atualização imediata da prévia desktop e mobile:

1. Altere `Cores HEX > Fundo` para um valor temporário de alto contraste, por exemplo `#F4F4F5`.
2. Altere `Tipografia > Hero > Família`, `Tamanho` e `Peso` dentro dos limites exibidos.
3. Altere `Layout > Colunas`, `Espaço entre cards` e `Margem lateral`.
4. Restaure manualmente os valores anteriores sem salvar.

Resultado esperado: cor, tipografia, grid e espaçamento mudam no painel antes de qualquer publicação.

## Contraste — bloqueio de salvamento

**Escrita controlada.** Em Aparência do site:

1. Anote os valores originais de `Fundo` e `Texto`.
2. Defina temporariamente ambos como `#FFFFFF`.
3. Tente salvar.

Resultado esperado: o Decap bloqueia a gravação e informa os tokens envolvidos, a razão calculada e o mínimo exigido.

4. Restaure os valores originais e salve somente se desejar validar o caminho de sucesso.
5. Confira no GitHub o commit produzido. Se a alteração era apenas teste, reverta esse commit pelo GitHub antes de continuar.

## Projeto e Sobre

**Escrita controlada.** Use um campo textual reversível, nunca uma obra profissional existente.

1. Em um projeto de teste autorizado, acrescente o sufixo temporário `— validação` ao resumo e confira a atualização no preview.
2. Em Página Sobre, acrescente o mesmo sufixo à biografia curta e confira o preview editorial.
3. Restaure exatamente os textos originais antes de salvar, ou faça um commit de reversão explícito.

Para `getAsset()`, envie uma imagem descartável e não profissional em um projeto de teste autorizado. Confirme que a imagem aparece no preview antes de salvar. Remova-a antes da gravação ou faça um commit de reversão.

## Persistência e deploy

**Escrita real — requer autorização de publicação.**

1. Salve uma alteração válida e confira o commit no branch `main`.
2. Aguarde a conclusão do deploy automático no Cloudflare Pages.
3. Abra a URL pública em janela anônima, recarregue sem cache e confirme a alteração correspondente.
4. Revert a alteração de teste pelo GitHub e confira um novo deploy de reversão.

## Critérios de aceite

- Login concluído sem erro de callback.
- Prévia atualiza antes de salvar.
- Contraste inválido não cria commit.
- Alteração válida cria exatamente o commit esperado.
- Upload temporário aparece na prévia e pode ser removido sem deixar mídia órfã.
- Site público reflete o commit após o deploy automático.
