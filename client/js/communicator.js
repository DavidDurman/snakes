var Communicator = {
    reconnectTimer: 5000,
    queue: [],
    readyFlag: false,
    ready: null,        // callback, called when all players are connected.
    received: null,     // callback, called when new state received
    start: null,
    socket: null,
    init: function(properties){
        this.readyFlag = false;
        this.queue = [];
        if (properties.received)
            this.received = properties.received.bind(properties.context);
        this.connect();
    },
    connect: function(){
        this.socket = new WebSocket(WebSocketAddress);
        this.socket.onmessage = this.receive.bind(this);
        this.socket.onerror = this.error.bind(this);
        this.socket.onopen = this.open.bind(this);
    },
    error: function(evt){
        console.log("Websocket error: ", evt);
    },
    open: function(evt){
        console.log("Connection ready.");
        this.readyFlag = true;
        this.flush();
    },
    receive: function(evt){
        var data = JSON.parse(evt.data);
        if (this.received) this.received(data); // callback
        return data;
    },
    send: function(data){
        this.queue.unshift(JSON.stringify(data));
        if (this.readyFlag){
            this.flush();
        }
        return this;
    },
    flush: function(){
        while (this.queue.length){
            this.socket.send(this.queue.pop());
        }
    }
};
