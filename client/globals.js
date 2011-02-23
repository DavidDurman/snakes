/**
 * Copyright (c) David Durman & Ales Sturala 2010.
 */

var SERVER = {
    WEBROOT: '/home/dave/github/snakes/client',
    STATIC_SERVER_PORT: 8080,
    WS_SERVER_IP: "192.168.55.101",
    WS_SERVER_PORT: 8000
};

SERVER.WS_SERVER_ADDRESS = "ws://" + SERVER.WS_SERVER_IP + ":" + SERVER.WS_SERVER_PORT;

var AUDIO = {
    sounds: {
        hit: 'audio/goddamnit.ogg',
        rotate: 'audio/jump.ogg',
        project: 'audio/eggsinup.ogg',
        prolong: 'audio/pipe.ogg',
        shake: 'audio/eggsinsh.ogg'
    }
};

var BONUS = {
    probabilityTable: {
        '0.15': 'rotate',
        '0.4': 'project',
        '0.7': 'prolong',
        '1.0': 'shake'
    },
    timeout: 10000, // ms
    prolongNeeded: 3,
    snakeLengthNeededToShorten: 10,
    shortenCount: 5,
    doubleBonusSnakeLength: 20
};

BONUS.probabilities = Object.keys( BONUS.probabilityTable );
BONUS.probabilities.sort( function( a, b ) {
    return +a > +b;
} );

var SNAKE = {
    body: {
        //        type: "arc",
        //        type: "rect",
        type: "text",        
        //        type: "sin",
        
        //        strokeStyle: "#FF00FF",
        //        fillStyle: "#FFFF00",
        strokeStyle: "white",
        fillStyle: "white",

        factor: 1.5,
//        text: "\u00D7", // cross
//        text: "ales",
        text: "\u2605", // star
        font: "14px Arial"
    },
    head: {
        factor: 1.2
    }
};

var PLAYFIELD = {
    //    fillStyle: "#e6f107"
    //    fillStyle: "#b8e612"
    wall: {
        fillStyle: "rgba(0, 0, 0, 0.1)"
//        fillStyle: "rgba(255, 0, 0, 0.1)"
    }
};

var PLAYERS = {
    maxCount: 3
};

var MISC = {
    globalTimerResolution: 500
}

if ( typeof require !== "undefined" ) {
    exports.PLAYERS = PLAYERS;    
    exports.SERVER = SERVER;
    exports.SNAKE = SNAKE;
    exports.PLAYFIELD = PLAYFIELD;
    exports.BONUS = BONUS;
    exports.MISC = MISC;        
}
