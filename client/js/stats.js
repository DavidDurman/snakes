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
        Communicator.send({ action: "died", id: User.id });
        Audio.play("hit");
    },
    
    flash: function( str ) {
        this.flashmessage.innerHTML = str;
    }
};