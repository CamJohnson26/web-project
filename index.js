(() => {
  'use strict';

  const express = require('express');
  const app = express();
  const config = require('./config-'+app.get('env')+'.js');

  const server = require('http').createServer(app);
  const io = require('socket.io')(server);
  const AWS = require('aws-sdk');

  const region = config.AWS.region;
  const profile = app.get('env');
  try {
    const credentials = new AWS.SharedIniFileCredentials({profile: profile});
    AWS.config.credentials = credentials;
  }
  catch (e) {
    console.log(e)
  }

  const dynamodb = new AWS.DynamoDB({region: region});

  let names = []; // lets call this a non-persistant database

  app.set('port', (process.env.PORT || 8080));

  io.on('connection', function(socket) {
    console.log('Client connected');
    socket.emit('test', 'testMessage');
    socket.on('time now there', () => {
      console.log('time now there');
      socket.emit('time now server', new Date());
    });
    socket.on('newName', (name) => {
      if(typeof name !== 'string') return Promise.reject();
      createNewNameInDynamo(name, function(err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          getNamesFromDynamo(socket);
        }
      });
    });
    socket.on('get name list', function() {
      console.log('test');
      getNamesFromDynamo(socket);
    });
  });

  function createNewNameInDynamo(name, callback) {
    let params = {
    Key: {
        name: {
          S: name,
        },
      },
      TableName: 'Names',
    };

    dynamodb.updateItem(params, callback);
  }

  function getNamesFromDynamo(socket) {
    let params = {
        TableName: 'Names',
      };

    dynamodb.scan(params, function(err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          let names = data.Items.map((i) => {
return i.name.S;
});
          console.log('coool names is now', names);
          socket.emit('new name list', names);
        }
      });
  }

  app.use(express.static(__dirname + '/public'));

  server.listen(app.get('port'), function() {
    console.log('Node app is running at localhost:' + app.get('port'));
  });
})();
