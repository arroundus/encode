const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

app.ws("/", function (ws, req) {
  console.log('Вводите коды: ')
  ws.on("message", function (msg) {
      rl.on('line', function ( code ) {
        rl.prompt()
        ws.send(code);
    });
  });
});

app.listen(3000);
