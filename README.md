# chat-distribuido-vercel-version
Discrição do projeto: Esse projeto é um Chat utilizando, node, firebase, vercel, worker, express e socket.io
o intuito é criar um chat online onde todos podem acessar e conversar tendo acesso ao historico das conversas
e sendo capaz de conversar em tempo real. E esse é o Projeto

Vale ressaltar que nas partes onde ficam informações sensiveis do servidor, estão vazias pois são dados sensiveis,
caso queiram executar o projeto na maquina de vcs, será necessario criar o proprio database no firebase e adicionar
as informações do database de voces no codigo.

As dependencias necessarias para utilizar a aplicação estão no packege.json
dependencies": {
    "express": "^4.18.2",
    "firebase-admin": "^11.9.0",
    "socket.io": "^4.6.2"
  }
  
Atualmente é possivel acessar o Chat atraves do link: "https://chat-distribuidos-vercel.vercel.app"
