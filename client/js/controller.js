var Controller = {
    playfields: [],
    stepIntervalID: null,
    broadcastIntervalID: null,
    logic: null,

    addPlayfield: function ( id, className, width, height, parent, xRes, yRes ) {
        var c = document.createElement( "canvas" );
        c.setAttribute( "id", id || null );
        c.setAttribute( "class", className || null );        
        c.setAttribute( "width", width || 0 );
        c.setAttribute( "height", height || 0 );
        ( parent ? document.getElementById( parent ) : document.body ).appendChild( c );

        this.playfields.push( Object.create(GameCanvas).init( c, width, height, xRes, yRes ) );
    },
    
    start: function () {
        this.stepIntervalID = setInterval( this.step.bind( this ), 80 );
    },

    
    step: function () {

        /*
        switch ( this.logic.snake2.direction().name ) {
          case "right": this.logic.d(); break;
          case "left": this.logic.a(); break;
          case "up": this.logic.w(); break;
          case "down": this.logic.s(); break;
        default: break;
        }
        */
        
        if ( this.logic[ this.logic.snake.direction().name ] ) {
            
            this.logic[ this.logic.snake.direction().name ]();
            
        } else {

            console.warn( "Unknown direction: " + this.logic.snake.direction().name );
            
        }
    },

    startBroadcast: function () {
        this.broadcastIntervalID = setInterval( function () {
            Communicator.send( {
                action: "state",
                value: JSON.stringify( rle_encode( this.logic.field ) ),
                id: User.id
            } );
        }.bind( this ), 100 );
    },

    receivedMessage: function ( data ) {
    
        switch ( data.action ) {
            
          case "start":
//            this.addPlayfield( "playfield", "", 400, 400, "application", 10, 10 );
            User.id = data.id;
            break;
            
          case "close":
            //        Communicator.send({ action: "died", id: User.id });
            break;
            
          case "ready":
//            this.addPlayfield( "", "enemy left", 200, 200, "application", 5, 5 );            
            this.startBroadcast();
            break;
            
          case "refuse":
            console.log("Connection refused.");
            break;
            
          case "state":
            if ( data.id != User.id ) {

                // @todo
                this.playfields[ 1 ].draw( rle_decode( JSON.parse( data.value ) ) );
                
            }
            break;
            
          case "fire":
            
            switch ( data.value ) {
                
              case "project":
                Stats.flash("You've been projectd.");
                Bonus.project( this.playfields[ 0 ].canvas, true );
                break;
                
              case "prolong":
                Stats.flash("You've been prolonged.");
                this.logic.action_extend(5);
                break;
                
              case "rotate":
                Stats.flash("You've been rotated.");
                Bonus.rotate( this.playfields[ 0 ].canvas, true );
                break;
                
              case "shake":
                Stats.flash("You've been shaked.");
                Bonus.shake( this.playfields[ 0 ].canvas, true );
                break;
                
            default: break;
            }
            break;

        default:
            console.warn("Unknown message received.");
            break;
        }
        
    },

    activateEnemy: function ( number /* is not User.id! */ ) {
        if ( this.activeEnemy ) {
            
            this.activeEnemy.canvas.style.borderTop = null;
            
        }
        this.activeEnemy = this.playfields[ number ];
        
        if ( this.activeEnemy ) {
            
            this.activeEnemy.canvas.style.borderTop = "2px solid red";
            
        }

        document.getElementById("cannon").className = ( number === 1 ) ? "left" : "right";
    },

    pause: function () {
        if ( this.stepIntervalID )
            clearInterval( this.stepIntervalID );
    },
    
    hit: function () {
        this.pause();
        Stats.hit();
        Timer.destroy();
        Communicator.send({ action: "died", id: User.id });
        Audio.play("hit");
    }
};

// make it singleton
Controller = Object.create( Controller );
