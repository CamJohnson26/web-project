(() => {
    'use strict';

    const express = require('express');
    const app = express();
    const server = require('http').Server(app);
    const io = require('socket.io')(server);

    app.set('port', (process.env.PORT || 8080));
    // app.get('/', function(request, response) {
    //   response.send('\
    // https://github.com/CamJohnson26/web-project<br>\
    // Github -> CodeShip -> AWS\
    // \
    // Listens for a commit to master and triggers a codeship build.
    // Deploys to AWS and runs the scripts in Scripts, based on instructions in
    // appspec.yml.\
    // \
    // index.js running at http://35.164.104.178/\
    // ');
    // });

    app.listen(app.get('port'), function() {
        console.log('Node app is running at localhost:' + app.get('port'));
    });

    io.sockets.on('connection', function(socket) {
        socket.emit('test', 'testMessage');
        socket.on('time now there', function() {
            console.log('time now there');
            socket.emit('time now server', new Date());
        });
    });
    app.use(express.static(__dirname + '/public'));
})();
