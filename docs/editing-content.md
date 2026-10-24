# Guia do painel administrativo

Abra `/admin` e entre com a conta GitHub autorizada. Cada salvamento cria um commit no repositório e o Cloudflare Pages reconstrói o site automaticamente.

## Projetos e galerias

Use **Projetos e galerias** para criar, editar ou excluir uma obra. Preencha título, categoria, resumo, ordem e publicação. Uma obra só aparece no site quando **Publicar no site** estiver ativado.

- Envie a capa no campo **Imagem de capa**.
- Em **Galeria e vídeos**, escolha o tipo de item antes de preencher. Imagens usam upload; vídeos usam URL pública do YouTube ou Vimeo.
- Arraste itens da lista para mudar a ordem da galeria.
- Remover um item da galeria não apaga o arquivo enviado. Excluir uma obra pede confirmação no próprio Decap e não apaga automaticamente os arquivos de mídia.

## Categorias

Use **Categorias** para criar, ocultar, reordenar ou excluir filtros. O identificador da categoria não deve ser alterado depois de atribuído a obras já publicadas. Ocultar uma categoria retira o filtro público, mas não remove as obras associadas.

## Organizar página inicial

A galeria principal de obras sempre aparece imediatamente abaixo do menu. Em **Organizar página inicial**, adicione as seções seguintes e arraste-as para alterar a ordem:

- galeria de artes;
- projetos destacados;
- lista de categorias;
- texto editorial;
- imagem;
- vídeo;
- chamada para ação.

Cada seção tem um controle de visibilidade. Remover uma seção só remove aquela composição da página: projetos, imagens e vídeos continuam salvos. A prévia mostra a galeria principal e as seções da edição atual antes do salvamento.

## Sobre o artista

Em **Sobre o artista**, edite nome, apresentação, retrato, biografias, formação, trajetória, competências, contatos e currículo. Os controles de visibilidade escondem áreas sem apagar seus dados.

## Personalizar layout

Em **Personalizar layout**, altere cores HEX, tipografia, colunas de desktop e celular, espaçamentos, largura, cantos, bordas, sombra, comportamento das capas, rodapé e parâmetros da página Sobre. A prévia muda enquanto os campos são editados.

Combinações de cor sem o contraste mínimo necessário são bloqueadas ao salvar. O painel mostra os tokens envolvidos, a razão de contraste calculada e o valor mínimo exigido.

## Publicação e segurança

O painel não substitui o histórico do Git: cada operação de salvamento é um commit rastreável. A prévia permite revisar mudanças antes de salvar; a autenticação OAuth e o deploy automático exigem que o ambiente publicado esteja configurado e que a conta tenha acesso ao repositório.
