/**
 * Copyright (c) David Durman & Ales Sturala 2010.
 */

var GameCanvas = {
    width: null,  // number of vertical fields
    height: null, // number of horizontal fields
    canvas: null, // html canvas
    canvas_context: null, // canvas 2d context
    point_width: 10,  // width of point in pixels
    point_height: 10, // height of point in pixels

    init: function( canvas, width, height, point_width, point_height ) {
        this.canvas = canvas;
        this.canvas_context = this.canvas.getContext("2d");

        this.point_width = point_width;
        this.point_height = point_height;

        this.width = Math.floor(width / this.point_width);
        this.height = Math.floor(height / this.point_height);

        return this;
    },
    // re-draw field
    draw: function(field){
        // clear rectangle
        var height = field.length,
            width = field[0].length;
        
        this.canvas_context.clearRect(0, 0, width * this.point_width, height * this.point_height);

        var i, j;
        
        for ( i = 0; i < height; i++ ) {
            for ( j = 0; j < width; j++ ) {
                
                this.drawCell( j, i, field[ i ][ j ] );
                
            }
        }

        return this;
    },
    drawBody: function(positions) {
        console.log(JSON.stringify(positions));
        
        var ctx = this.canvas_context, w = this.point_width, h = this.point_height,
            length = positions.length;

        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        ctx.beginPath();

        ctx.moveTo( positions[0].x*w, positions[0].y*h + h/2 );
        ctx.lineTo( positions[length - 1].x*w + w, positions[length - 1].y*h + h/4 );
        ctx.lineTo( positions[length - 1].x*w + w, positions[length - 1].y*h + h - h/4);
        ctx.lineTo( positions[0].x*w, positions[0].y*h + h/2 );

        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        return this;
    },
    // draw particular one point in the field
    drawCell: function(x, y, code){

        switch ( code ) {
            
          case Cell.blank:
            this.drawEmptyPoint(x, y);
            break;
            
          case Cell.wall:
            this.drawWallPoint(x, y);
            break;

          case Cell.prolong:
            this.drawFlowerPoint(x, y);
            break;

          case Cell.shorten:
            this.drawReverseFlowerPoint(x, y);
            break;

          case Cell.bonus:
            this.drawBonusPoint(x, y);
            break;

        default:
            if ( code > Cell.snakeHead ) {
                
                this.drawSnakeBodyPoint(x, y);
                
            } else {
                
                this.drawSnakeHeadPoint(x, y, code);
                
            }
            break;
        }

        return this;
    },
    // draw point where nothing is
    drawEmptyPoint: function( x, y ) {
        // nop;
    },
    // draw point where snake's body is
    drawSnakeBodyPoint: function(x, y){
        var ctx = this.canvas_context, w = this.point_width, h = this.point_height,
            f = SNAKE.body.factor;
        
        ctx.strokeStyle = SNAKE.body.strokeStyle;
        ctx.fillStyle = SNAKE.body.fillStyle;

        if (SNAKE.body.type === "text"){
            ctx.font = SNAKE.body.font;
            ctx.fillText(SNAKE.body.text, x*w, y*h + h);
            return;
        }
        
        ctx.beginPath();

        switch (SNAKE.body.type) {
            
          case "arc":
            ctx.arc( x*w + w/2, y*h + h/2, w/2, 0, TWOPI, true );
            break;
            
          case "rect":
            ctx.rect(x*w + w/2 - w/(f*2), y*h + h/2 - h/(f*2), w/f, h/f);
            break;

          case "sin":
            ctx.arc( x*w + w/4, y*h + h/2, w/4, 0, PI, true );
            ctx.arc( x*w + w - w/4, y*h + h/2, w/4, 0, PI, false );
            break;

        default:
            ctx.arc( x*w + w/2, y*h + h/2, w/2, 0, TWOPI, true );
        }

        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        //this.canvas_context.fillStyle = "#06aeff";
        //this.canvas_context.fillRect(x*this.point_width, y*this.point_height, this.point_width, this.point_height);
    },
    // draw point where snake's head is
    drawSnakeHeadPoint: function ( x, y, code ) {
        var ctx = this.canvas_context, w = this.point_width, h = this.point_height,
            f = SNAKE.head.factor, direction = Snake.directions[ code ].name;
        
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc( x*w + w/2, y*h + h/2, w/(f*2), 0, TWOPI, true );
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.beginPath();
        
        switch (direction){
          case "right":
            ctx.arc( x*w + w, y*h + h/2, w/(f*4), 90, PI, true );
            break;
          case "left":
            ctx.arc( x*w, y*h + h/2, w/(f*4), 90, PI, false );
            break;
          case "up":
            ctx.arc( x*w + w/2, y*h, w/(f*4), 0, PI/2, true );
            break;
          case "down":
            ctx.arc( x*w + w/2, y*h + h, w/(f*4), PI/2, TWOPI, false );
            break;
        }

        ctx.closePath();
        ctx.stroke();
        ctx.fill();

    },
    // draw flower
    drawFlowerPoint: function(x, y) {
        this.drawCircle(x, y, "#1fe050", "#1fe050");
    },
    // draw reverse flower
    drawReverseFlowerPoint: function(x,y) {
        this.drawCircle(x, y, "#e600b4", "#e600b4");
    },
    // draw wall
    drawWallPoint: function(x, y) {
        //this.canvas_context.fillStyle = "#55ffffff";
        this.canvas_context.fillStyle = PLAYFIELD.wall.fillStyle;
        this.canvas_context.fillRect( x * this.point_width, y * this.point_height, this.point_width, this.point_height);
    },
    // draw bonus
    drawBonusPoint: function(x, y) {
        this.drawCircle(x, y, "rgba(255, 255, 0, 0.6)", "yellow");
    },
    drawCircle: function(x, y, strokeStyle, fillStyle) {
        var ctx = this.canvas_context, w = this.point_width, h = this.point_height;

        var radgrad = ctx.createRadialGradient(x*w, y*h, 0, x*w, y*h, w);  
        radgrad.addColorStop(0, "yellow");
        radgrad.addColorStop(0.3, "green");          
        radgrad.addColorStop(1.0, "yellow");  

        ctx.strokeStyle = strokeStyle;
        ctx.fillStyle = fillStyle;
        ctx.beginPath();      
        ctx.arc( x*w + w/2, y*h + h/2, w/2, 0, TWOPI, true );
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
}