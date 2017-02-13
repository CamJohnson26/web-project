(() => {
  'use strict';

  const express = require('express');
  const app = express();
  const server = require('http').createServer(app);
  const io = require('socket.io')(server);


  app.set('port', (process.env.PORT || 8080));

  io.on('connection', (socket) => {
    socket.emit('test', 'testMessage');
    socket.on('time now there', () => {
      console.log('time now there');
      socket.emit('time now server', new Date());
    });
  });
  app.use(express.static(__dirname + '/public'));

  server.listen(app.get('port'), function() {
    console.log('Node app is running at localhost:' + app.get('port'));
  });
})();
