var ws = require("../lib/node-websocket-server/lib/ws"),
    server = ws.createServer(),
    ConnectionTable = [];

var nPlayers;
var NumberOfPlayers = 2;
var MaxStateStoragePerUser = 50;

console.log("Websocket server started.");

function keys(obj){
    var ret = [];
    for (var k in obj){
        if (obj.hasOwnProperty(k))
            ret.push(k);
    }
    return ret;
}

server.on("connection", function(conn){
    console.log("Connected (" + conn.id + ")");
    console.log("Number of players needed: " + NumberOfPlayers);

    if (ConnectionTable.indexOf(conn.id) == -1){
        console.log("First connection of player " + conn.id);
        // first connection of a player
        ConnectionTable.push(conn.id);
        console.log("Number of players connected so far: " + ConnectionTable.length);
        conn.send(JSON.stringify({ action: "start", id: conn.id }));      // send user id
    }
    nPlayers = ConnectionTable.length;
    if (nPlayers === NumberOfPlayers){
        console.log("All players are connected.");
        conn.broadcast(JSON.stringify({ action: "ready" }));      // send it to me
        conn.send(JSON.stringify({ action: "ready" }));      // send it to me
    } else if (nPlayers > NumberOfPlayers){
        console.log("No more players are welcome.");
        conn.broadcast(JSON.stringify({ action: "refuse" }));      // send it to me
        return;
    }

    conn.on("message", function(message){
        message = JSON.parse(message);
        if (message.action == "died"){
            console.log("User died: " + message.id);
            nPlayers -= 1;
            ConnectionTable.splice(ConnectionTable.indexOf(parseInt(message.id), 1));
            return;
        }
//        console.log(message.value);
//        console.log(message.id + "-" + message.action);

//        ConnectionTable[conn.id].push(message);
        // prevent of overflow

//        if (ConnectionTable[conn.id].length > MaxStateStoragePerUser){
//            ConnectionTable[conn.id].unshift();
//        }
        conn.broadcast(JSON.stringify(message)); // broadcast to others
    });
});

server.on("close", function(conn){
    conn.broadcast(JSON.stringify({ id: conn.id, action: "close"}));
});

server.listen(8000);
