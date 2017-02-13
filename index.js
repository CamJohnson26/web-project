(() => {
  'use strict';

  const express = require('express');
  const app = express();
  const server = require('http').createServer(app);
  const io = require('socket.io')(server);
  let names = []; // lets call this a non-persistant database


  app.set('port', (process.env.PORT || 8080));

  io.on('connection', (socket) => {
    socket.emit('test', 'testMessage');
    socket.on('time now there', () => {
      console.log('time now there');
      socket.emit('time now server', new Date());
    });
    socket.on('newName', (name) => {
      if(typeof name !== 'string') return Promise.reject();
      names.push.apply(names, [name]);
      if(names.length > 10) {
        names = names.slice(names.length - 10);
      }
      console.log('coool names is now', names, name);
      socket.emit('new name list', names);
    });
    socket.on('get name list', () => socket.emit('new name list', names));
  });
  app.use(express.static(__dirname + '/public'));

  server.listen(app.get('port'), function() {
    console.log('Node app is running at localhost:' + app.get('port'));
  });
})();
