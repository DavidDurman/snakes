/**
 * Copyright (c) David Durman & Ales Sturala 2010.
 */

function main(){
    // Components initialization.
    Timer.init();
    Stats.init();
    Audio.init();
    
    // Load skin.
    skin("css/style.css");

    // Global game time.
    Timer.create(
        function ( time ) {
            return time % 1000 === 0;
        },
        function ( time ) {
            time = time / 1000;     // ms to s
            var seconds = time % 60,
            minutes = Math.floor( time / 60 );
            
            document.getElementById( "timestamp" ).innerHTML = minutes + ":" + ("0" + seconds).slice(-2);
        }
    );

    // Game Canvases.
    Controller.addPlayfield( "playfield", "", 400, 400, "application", 10, 10 );
    Controller.addPlayfield( "", "enemy left", 200, 200, "application", 5, 5 );
    Controller.addPlayfield( "", "enemy right", 200, 200, "application", 5, 5 );    
//    Controller.addPlayfield( "", "enemy left-bottom", 200, 200, "application", 5, 5 );
//    Controller.addPlayfield( "", "enemy right-bottom", 200, 200, "application", 5, 5 );

    Controller.activateEnemy( 1 );

    // Game Logic.
    var logic = Object.create( Logic );
    Controller.logic = logic;
    logic.init( Controller.playfields[ 0 ] );
    logic.onbonus = function(){
            
        var rand = Math.random();
        var i = 0, len = BONUS.probabilities.length, prob;
        
        for ( ; i < len; i++ ) {
            prob = BONUS.probabilities[ i ];
            if ( rand < +prob ) {
                Bonus[ BONUS.probabilityTable[ prob ] ]( Controller.activeEnemy.canvas );
                break;  // find only the first applicable one
            }
        }
        
    };

    // Input Handler.

    InputHandler.init({ delegee: KeyResolver.get(mixin(logic, {
        one: function(evt){
            Controller.activateEnemy( 1 );
        },
        two: function(evt){
            Controller.activateEnemy( 2 );
        },
        m: function () {
            Audio.toggle();
        }
    })) });

    // Communicator.
    Communicator.init( {
        received: Controller.receivedMessage.bind( Controller ),
        context: null
    } );

    
    // Start game.
    Controller.start();
}
