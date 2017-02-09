'use strict';

var express = require('express');
var app = express();


function getWords(pattern, webResponse) {
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database(__dirname + '/WordList.sqlite');
  var result = [];

  var queryString = pattern.replace(/[^a-zA-Z]/g, "_");
  console.log('queryString: ' + queryString);

  var cmd = db.prepare(
    "SELECT MIN(ID) ID, word " +
    "FROM Words " +
    "WHERE word LIKE '" + queryString + "' " +
    " AND LENGTH(word) = LENGTH($wordParam) " +
    "GROUP BY word");

  if(pattern.length >= 1) {
    cmd.all(
      { $wordParam : pattern },
      function(err, results) {
        if(err) {
          console.log(err, webResponse);
          dbCallback(err, null, webResponse);
        } else {
          dbCallback(null, results, webResponse);
          console.log("(" + results.length + ") rows affected...");
        }
      }
    );
  } else {
    //var emptyResult = [{ ID : '', word : ''}];
    //dbCallback(null, emptyResult, webResponse);
    dbCallback(null, [], webResponse);
  }
  cmd.finalize();
  db.close();

  return;
}

function dbCallback(error, results, webResponse) {
  if(error){
    //webResponse.send(JSON.stringify([{ ID : '' , word : ''}]));
    webResponse.send([]);
  } else {
    console.log('results ready to send');
    for(var i = 0; i < results.length; i++) {
      console.log(results[i].word);
    }
    webResponse.send(results);
  }
}

app.set('port', (process.env.PORT || 8080));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send(
    'https://github.com/CamJohnson26/web-project<br>' +
    'Github -> CodeShip -> AWS' +
    'Listens for a commit to master and triggers a codeship build. Deploys to AWS and runs the scripts in Scripts, based on instructions in appspec.yml.' +
    'index.js running at http://35.164.104.178/'
  );
});

app.get('/testDB/download/', function(request, response){
  response.sendFile(__dirname + '/WordList.sqlite', function(err){
    if(err){
      console.log('error encountered -- ' + err);
      response.status(err.status).end();
    } else {
      console.log('Sent: WordList.sqlite');
    }
  });
});

app.get('/testDB/retrievewords', function(request, response){
  console.log(request.query);
  getWords(request.query.pattern, response);
  //var dbResult = getWords(request.query.pattern);
  console.log('getWords() finished');
  //console.log(dbResult);
  //response.send(dbResult);
});

app.get('/wordlist/', function(request, response){
  response.sendFile(__dirname + '/public/words.html');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running at localhost:' + app.get('port'));
});
