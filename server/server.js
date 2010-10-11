/**
 * Copyright (c) David Durman & Ales Sturala 2010.
 */

var ws = require("../lib/node-websocket-server/lib/ws"),
    server = ws.createServer();

var nPlayers = 0;
var NumberOfPlayers = 3;
var Port = 8000;        // port websocket server is listening on

console.log("Websocket server started.");
console.log("Number of players needed: " + NumberOfPlayers);

server.on("connection", function(conn){
    console.log("nPlayers: " + nPlayers);
    nPlayers += 1;
    console.log("nPlayers: " + nPlayers);
    console.log("Connected (" + conn.id + ")");
    console.log("Number of players connected so far: " + nPlayers);
    conn.send(JSON.stringify({ action: "start", id: conn.id }));

    if (nPlayers === 2 || nPlayers === 3){
        console.log("All players are connected.");
        conn.broadcast(JSON.stringify({ action: "ready" }));
        conn.send(JSON.stringify({ action: "ready" }));
    } else if (nPlayers > NumberOfPlayers){
        console.log("No more players are welcome.");
        conn.broadcast(JSON.stringify({ action: "refuse" }));
        return;
    }

    conn.on("message", function(message){
        message = JSON.parse(message);
        if (message.action == "died"){
            console.log("User died: " + message.id);
//            nPlayers -= 1;
            return;
        }
        // console.log(JSON.stringify(message));
        conn.broadcast(JSON.stringify(message));
    });
});

server.on("close", function(conn){
    nPlayers -= 1;
    console.log("Closing connection id: " + conn.id);
    conn.broadcast(JSON.stringify({ id: conn.id, action: "close"}));
});

server.listen(Port);
