/**
 * Copyright (c) David Durman & Ales Sturala 2010.
 */

var Cell = {
    
    blank: 0,
    wall: 1,
    prolong: 2,
    shorten: 3,
    bonus: 4,
    snakeHead: 100
    
};

var Snake = {
    
    // static table
    directions: {
        "100": { x: 1,  y: 0,  name: "right" },
        "99":  { x: 0,  y: 1,  name: "down"  },
        "98":  { x: 0,  y: -1, name: "up"    },
        "97":  { x: -1, y: 0,  name: "left"  },
        "right": 100,
        "down":  99,
        "up":    98,
        "left":  97
    },
    
    body: [],
    store: function ( field ) {
        
        this.body.forEach( function( position, i, body ) {
            field[ position.y ][ position.x ] = (i === 0) ? body[ 0 ].code || Cell.snakeHead : Cell.snakeHead + i;
        } );
    },
    clean: function ( field ) {
        this.body.forEach( function( position, i, body ) {
            field[ position.y ][ position.x ] = Cell.blank;
        } );
    },
    direction: function ( dir ) {
        if ( dir ) {
            this.body[ 0 ].code = this.directions[ dir ];
            return this.directions[ this.directions[ dir ] ];
        }
        return this.directions[ this.body[ 0 ].code ] || { name: "unknown" };
    },
    move: function ( delta ) {
        var len = this.body.length, i = len - 1;
        
        for ( ; i >= 0; i-- ) {
            
            if ( i < delta ) {
                
                this.body[ i ].x += this.direction().x * delta;
                this.body[ i ].y += this.direction().y * delta;
                
            } else {

                this.body[ i ].x = this.body[ i - delta ].x;
                this.body[ i ].y = this.body[ i - delta ].y; 
                
            }
        }
    },
    extend: function ( count ) {
        var tail = this.body[ this.body.length - 1];
        var positiveCount = Math.abs( count );

        while ( positiveCount-- ) {
            
            if ( count > 0 ) {

                this.body[ this.body.length ] = { x: tail.x, y: tail.y };

            } else {

                this.body.pop();
                
            }
        }
    }
};

var Logic = {
    
    canvas: null,
    field: [],
    bonus_count: 3,
    onbonus: null,      // callback when snake has eaten a bonus
    snake: null,
    collected: {},      // table of collected things
        
    init: function(canvas){
        var i, j;
        this.canvas = canvas;

        // Initialize game field, draw walls.
        for ( i = 0; i < canvas.height; i++ ) {
            this.field[ i ] = [];
            
            for ( j = 0; j < canvas.width; j++ ) {

                if ( j === 0             ||
                     j === canvas.height - 1 ||
                     i === 0             ||
                     i === canvas.width - 1) {
                    
                    this.field[ i ][ j ] = Cell.wall;
                    
                } else {
                    this.field[ i ][ j ] = Cell.blank;
                }

            }
        }

        var snake = this.snake = Object.create( Snake );

        /*
        var snake2 = this.snake2 = Object.create( Snake );
        // Initialize Snake.
        snake2.body = [
            { x: 6, y: 20, code: Snake.directions["right"] },
            { x: 5, y: 20 },
            { x: 4, y: 20 },
            { x: 3, y: 20 },
            { x: 2, y: 20 }
        ];
        snake2.store(this.field);
        */

        // Initialize Snake.
        snake.body = [
            { x: 6, y: 2, code: Snake.directions[ "right" ] },
            { x: 5, y: 2 },
            { x: 4, y: 2 },
            { x: 3, y: 2 },
            { x: 2, y: 2 }
        ];
        snake.store( this.field );

        Stats.info( { snakeLength: snake.body.length } );        

        this.fillRandomCell( Cell.prolong );
        
        canvas.draw( this.field );

        this.createBonusTimeout();

        return this;
    },
    createBonusTimeout: function () {
        var prolongCountElement = document.getElementById( "prolongCount" ),
            bonusTimeoutElement = document.getElementById( "bonusTimeout" );
        
        prolongCountElement.max = BONUS.prolongNeeded;
        prolongCountElement.value = 0;
        
        // @todo
        var bonusTimeout = BONUS.timeout;
        Timer.create(
            function ( time ) {
                return time % 1000 === 0 && bonusTimeout >= 0;
            },
            function ( time ) {
                time = bonusTimeout -= 1000;    // -1s

                if ( bonusTimeout === 0 ) {
                    
                    if ( this.collected[ Cell.prolong ] >= BONUS.prolongNeeded ) {
                        
                        this.fillRandomCell( Cell.bonus );
                        if ( this.snake.body.length > BONUS.doubleBonusSnakeLength ) {
                            this.fillRandomCell( Cell.bonus );
                        }
                        
                    }
                    
                    this.collected[ Cell.prolong ] = 0;
                    prolongCountElement.value = 0;
                    
                    bonusTimeout = BONUS.timeout;
                }
                
                time = time / 1000;     // ms to s
                var seconds = time % 60,
                    minutes = Math.floor( time / 60 );
                
                bonusTimeoutElement.innerHTML = minutes + ":" + ("0" + seconds).slice(-2);
            },
            "bonus",
            this
        );
    },
    collision: function ( point ) {
        var snakeUnderHeadCode = this.field[ point.y ][ point.x ];
        var snake = this.snake;
        

        switch ( snakeUnderHeadCode ) {
            
          case Cell.wall:
            Controller.hit();
            break;

          case Cell.prolong:
            this.fillRandomCell( Cell.prolong );
            snake.extend( 1 );
            
            Stats.info( { snakeLength: snake.body.length } );
            this.collected[ Cell.prolong ] = (this.collected[ Cell.prolong ] || 0) + 1;
            document.getElementById( "prolongCount" ).value = this.collected[ Cell.prolong ];

            /*
            if ( snake.body.length >= BONUS.snakeLengthNeededToShorten ) {
                var idx = BONUS.shortenCount;
                while ( idx-- ) this.fillRandomCell( Cell.shorten );
            }
            */

            // @todo
//            if ( snake.body.length % 3 === 0 && Math.random() < 0.5 ) {
//                this.fillRandomCell( Cell.bonus );
//            }
            break;

          case Cell.shorten:
            this.collected[ Cell.shorten ] = (this.collected[ Cell.shorten ] || 0) + 1;
            snake.extend( -1 );
            Stats.info( { snakeLength: snake.body.length } );
            break;

          case Cell.bonus:
            if ( this.onbonus ) this.onbonus();
            break;
            
        default:
            if ( snakeUnderHeadCode > Cell.snakeHead ) {
                Controller.hit();
            }   
            break;
        }
    },

    move: function ( snake, direction ) {
        snake.clean( this.field );
        snake.direction( direction );
        snake.move( 1 );
        this.collision( snake.body[ 0 ] );
        snake.store( this.field );
        this.canvas.draw( this.field );
    },

    a: function () { this.move( this.snake2, "left" ); },
    d: function () { this.move( this.snake2, "right" ); },
    w: function () { this.move( this.snake2, "up" ); },
    s: function () { this.move( this.snake2, "down" ); },    
    
    right: function() {
        var snake = this.snake;
        
        // do not allow to go to opposite direction (eat itself)
        if ( snake.direction().name === "left" ) {
            return;
        }
        this.move( snake, "right" );
    },
    left: function() {
        var snake = this.snake;
        
        // do not allow to go to opposite direction (eat itself)
        if ( snake.direction().name === "right" ) {
            return;
        }
        this.move( snake, "left" );        
    },
    up: function() {
        var snake = this.snake;
        
        // do not allow to go to opposite direction (eat itself)
        if ( snake.direction().name === "down" ) {
            return;
        }
        this.move( snake, "up" );
    },
    down: function(){
        var snake = this.snake;
        
        // do not allow to go to opposite direction (eat itself)
        if ( snake.direction().name === "up" ) {
            return;
        }
        this.move( snake, "down" );        
    },
    // create one flower in the game on random position
    create_flower: function(){
        var pos = this.getRandomEmptyPosition();
        this.field[ pos.y ][ pos.x ] = Cell.prolong;
    },
    // create one inverse flower in the game on random position    
    create_reverse_flower: function() {
        var pos = this.getRandomEmptyPosition();
        this.field[ pos.y ][ pos.x ] = Cell.shorten;
    },
    // create one bonus at random position
    create_bonus: function() {
        var pos = this.getRandomEmptyPosition();
        this.field[ pos.y ][ pos.x ] = Cell.bonus;
    },
    // generate random index;
    // regenerate if there is something on the position (code != 0)
    // or if the possition is right near the wall
    getRandomEmptyPosition: function(){
        var x, y;
        
        do {
            // get me random number between 0..(size of fields-1 incl.)
            x = Math.floor( Math.random() * this.field[ 0 ].length );
            y = Math.floor( Math.random() * this.field.length );

        } while ( this.field[ y ][ x ] === Cell.wall );


        return { x: x, y: y };
    },
    fillRandomCell: function ( code ) {
        var pos = this.getRandomEmptyPosition();
        this.field[ pos.y ][ pos.x ] = code;
    }
}