Chat Application
Este é um projeto de interface de chat desenvolvido com React e Firebase. O objetivo do projeto é simular a comunicação em tempo real entre diferentes usuários, com uma interface intuitiva, funcional e visualmente agradável. O projeto também serve como um teste de conhecimento e prática das tecnologias envolvidas.

Tecnologias Utilizadas
React: Biblioteca JavaScript para a criação da interface.
Firebase Firestore: Banco de dados NoSQL usado para gerenciar mensagens em tempo real.
Firebase Authentication: Autenticação para usuários.
Cloudinary: Serviço de armazenamento de arquivos, usado para upload de arquivos/imagens.
Funcionalidades
Requisitos Básicos
 Interface de Conversa:

Área de exibição de mensagens.
Área de entrada de texto para o envio de novas mensagens.
Diferenciação visual entre mensagens enviadas pelo usuário e mensagens recebidas.
Nome de usuário fictício e timestamp para simular conversas entre diferentes participantes.
 Envio de Mensagens:

Implementação do envio de mensagens exibindo imediatamente após o envio.
Simulação local de mensagens automáticas para criar uma conversa bidirecional.
 Design Responsivo:

Interface responsiva para funcionar bem em diferentes tamanhos de tela, incluindo dispositivos móveis e desktops.
 Anexar Arquivos ao Chat:

Suporte para anexar arquivos à conversa, utilizando arrastar e soltar (drag-and-drop) e seleção manual.
Requisitos Opcionais (Diferenciais)
 Notificações de "Digitando...":

Indicativo visual mostrando quando o outro usuário está "digitando".
 Notificações e Sons:

Notificações visuais e sonoras para novas mensagens recebidas, caso o usuário não esteja na tela do chat.
 Emojis e Reações:

Suporte para emojis e reações rápidas às mensagens. (Loading...)
 Modo Claro/Escuro:

Alternar entre modo claro e escuro. (Loading...)
 Personalização para a Marca:

Interface personalizada com detalhes, cores e logos referentes à marca Arizona.
 Drag and Drop:

Possibilidade de arrastar arquivos para a janela de chat para anexar à conversa.
Como Executar o Projeto
Pré-requisitos
Node.js (v14 ou superior)
Yarn ou NPM
Firebase (configurar o Firestore e Authentication)
Passos
Clone o repositório:

sh
Copiar código
git clone https://github.com/seu-usuario/chat-application.git
cd chat-application
Instale as dependências:

sh
Copiar código
npm install
# ou
yarn install
Crie um arquivo .env com as variáveis de ambiente do Firebase:

makefile
Copiar código
REACT_APP_FIREBASE_API_KEY=seu_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=seu_project_id
Inicie o projeto:

sh
Copiar código
npm start
# ou
yarn start
Funcionalidades em Destaque
Mensagens em Tempo Real: O chat foi desenvolvido utilizando Firebase Firestore, permitindo que as mensagens sejam exibidas em tempo real.
Indicador de Status: Indicadores de "online" e "digitando" adicionados para melhorar a experiência do usuário.
Upload de Arquivos: Usuários podem anexar arquivos ao chat, utilizando Cloudinary para armazenamento.
Melhorias Futuras
Modo Claro/Escuro: Implementação do modo claro e escuro para aprimorar a acessibilidade e as preferências de visualização dos usuários.
Emojis e Reações: Adicionar suporte para emojis e reações rápidas às mensagens.
