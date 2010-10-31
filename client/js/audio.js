var Audio = {

    elements: {},  // HTML 5 audio elements

    init: function() {

        Object.keys( AUDIO.sounds ).forEach( function( sound ) {
            
            var el = document.createElement( 'audio' );
            el.setAttribute( 'src', AUDIO.sounds[ sound ] );
            document.getElementById( 'application' ).appendChild( el );
            Audio.elements[ sound ] = el;
            
        } );
        
        
    },

    play: function( sound ) {
        if ( this.elements[ sound ] ) {
            this.elements[ sound ].play();            
        }
    }
};