self.onmessage = function(event) {
    var messageData = event.data;
  
    // Simula um processamento de mensagem
    // Neste exemplo, apenas adicionamos um timestamp
    const processedMessage = {
      ...messageData,
      timestamp: new Date().toISOString()
    };
  
    self.postMessage(processedMessage);
  };
  