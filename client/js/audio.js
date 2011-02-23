var Audio = {
    mute: false,

    elements: {},  // HTML 5 audio elements

    init: function() {

        Object.keys( AUDIO.sounds ).forEach( function( sound ) {
            
            var el = document.createElement( 'audio' );
            el.setAttribute( 'src', AUDIO.sounds[ sound ] );
            document.getElementById( 'application' ).appendChild( el );
            Audio.elements[ sound ] = el;
            
        } );
        
        this.audioStatusElement = document.getElementById( "audioStatus" );
        this.audioStatusElement.className = this.mute ? "off" : "on";
    },

    toggle: function () {
        this.mute = !this.mute;
        this.audioStatusElement.className = this.mute ? "off" : "on";
    },

    play: function( sound ) {
        if ( this.mute ) {
            return;
        }
        if ( this.elements[ sound ] ) {
            this.elements[ sound ].play();
        }
    }
};