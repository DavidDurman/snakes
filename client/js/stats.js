/**
 * Copyright (c) David Durman & Ales Sturala 2010.
 */

var Stats = {
    
    flashmessage: null,
    
    init: function() {
        this.flashmessage = document.getElementById("flashmessage");
    },

    hit: function() {
        this.flash("You died a slow, painful death.");
    },
    
    flash: function( str ) {
        this.flashmessage.innerHTML = str;
    },

    info: function ( props ) {
        Object.keys( props ).forEach( function ( k ) {
            document.getElementById( k ).innerHTML = props[ k ];
        } );
    }
};