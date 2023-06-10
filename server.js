const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { Worker } = require('worker_threads');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ''
});

const port = process.env.PORT || 3000;
const workers = {};

// Rota para servir o arquivo HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Inicie o servidor
server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

// Função para criar um novo worker
function createWorker(workerId) {
  const worker = new Worker('./worker.js');

  worker.on('message', (message) => {
    // Envia a mensagem recebida para o Firebase
    const messageData = {
      message: message
    };

    admin.database().ref('mensagens').push(messageData);
  });

  worker.on('error', (error) => {
    console.error(`Erro no worker ${workerId}:`, error);
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker ${workerId} saiu com código de saída ${code}`);
    }
  });

  workers[workerId] = worker;
}

// Rota para criar um novo worker
app.get('/worker', (req, res) => {
  const workerId = new Date().getTime().toString();
  createWorker(workerId);
  res.send(`Novo worker criado: ${workerId}`);
});

// Inicia um worker quando o servidor é iniciado
createWorker('default');

// Configura o Socket.io
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  // Busca todas as mensagens do Firebase e envia para o cliente conectado
  admin.database().ref('mensagens').on('value', (snapshot) => {
    const messages = snapshot.val();
    Object.values(messages).forEach((message) => {
      socket.emit('message', message);
    });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });

  socket.on('message', (message) => {
    // Envia a mensagem para o worker processar
    const workerIds = Object.keys(workers);
    if (workerIds.length > 0) {
      const workerId = workerIds[0];
      workers[workerId].postMessage(message);
    }
  });
});
