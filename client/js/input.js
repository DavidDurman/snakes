/**
 * Copyright (c) David Durman & Ales Sturala 2010.
 */

var InputHandler = {
    delegee: null,      // receiver of input events (could be the same as target)
    root: document,
    handlers: [
        "mousemove",
        "mousedown",
        "mouseover",
        "mouseout",
        "mouseup",
        "keydown",
        "keyup",
        "keypress"
    ],
    init: function(properties){
        var idx = this.handlers.length;
        document.body.controller = this.delegee = properties.delegee;
        // register event listeners
        while (idx--){
            this.root.addEventListener(this.handlers[idx], this.handler.bind(this), true);
        }
    },
    handler: function(evt){
        var element = evt.target, controller, listener;
        while (element.controller === undefined && element.parentElement !== null){
            element = element.parentElement;
        }
        controller = element.controller;
        if (this.handlers.indexOf(evt.type) !== -1)
            this.router((controller === undefined) ? this.delegee : controller, evt.type, evt);
    },
    router: function(controller, handler, evt){
        if (controller[handler])
            controller[handler].call(controller, evt);
        else if (this.delegee[handler])
            this.delegee[handler].call(this.delegee, evt);
    }
};

var KeyResolver = {
    keyMap: {
        13: "enter",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        49: "one",
        50: "two",
        51: "three",

        65: "a",
        68: "d",
        83: "s",
        87: "w",

        77: "m"
    },
    get: function(delegee){
        this.delegee = delegee;
        return this;
    },
    resolve: function(evt){
        var keyCode = evt.keyCode;
        if (this.delegee[this.keyMap[keyCode]])
            this.delegee[this.keyMap[keyCode]]();
    },
//    keypress: function(evt){ this.resolve(evt); },
    keydown: function(evt){ this.resolve(evt); }
//    keyup: function(evt){ this.resolve(evt); }
};
