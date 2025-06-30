 # API rest para "publicar" fotos como em uma rede social

### Projeto para a disciplina de Banco de Dados, API Rest com front-end e banco de dados MongoDB com ReplicaSet.
#### 1. Objetivo do Projeto
Cada grupo irá modelar a estrutura de dados de uma mini-rede social e configurar um
replica set funcional com 3 nós MongoDB, simulando um sistema distribuído.
 O grupo 4 ficou responsável por cuidar da parte do "publicação" de fotos cuidando dos comentários e das legendas.

##### 2. Tecnologias Utilizadas
Backend:
Python 3;
Flask (framework web);
PyMongo (integração com MongoDB);
Flask-CORS (controle de políticas CORS);
MongoDB (banco de dados NoSQL);

Frontend:
HTML;
Tailwind CSS (estilização utilitária);
Font Awesome (ícones);
JavaScript (lógica de interação).

#### 3. Funcionalidades Implementadas
*Publicação de Imagens:*
Upload de arquivos de imagem com legenda e nome de usuário.
Armazenamento da imagem em uma pasta local (uploads/) e dados no MongoDB.

*Exibição de Feed:*
Feed dinâmico com listagem de fotos, legendas e nome de quem postou.
As fotos são carregadas do backend e renderizadas dinamicamente com JavaScript.

*Comentários:*
Cada publicação pode receber comentários de outros usuários.
Os comentários são armazenados diretamente no documento da foto no MongoDB.
Renderização imediata do novo comentário após envio.

*Curtidas:*
Sistema básico de "like" com alternância do ícone e contagem de curtidas.

*Interface Estética:*
Layout inspirado no Instagram com barra de navegação, stories, feed, e modal de upload.
Uso de Tailwind CSS para responsividade e estilo visual consistente.

