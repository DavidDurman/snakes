/**
 * Copyright (c) David Durman & Ales Sturala 2010.
 */

var GameCanvas = {
    width: null,                                                                  // number of vertical fields
    height: null,                                                                 // number of horizontal fields
    canvas: null,                                                                 // html canvas
    canvas_context: null,                                                         // canvas 2d context
    point_width: 10,                                                              // width of point in pixels
    point_height: 10,                                                             // height of point in pixels

    init: function(canvas,width,height,point_width,point_height){
        this.canvas = canvas;
        this.canvas_context = this.canvas.getContext("2d");

        this.point_width = point_width;
        this.point_height = point_height;

        this.width = Math.floor(width / this.point_width);
        this.height = Math.floor(height / this.point_height);

        return this;
    },
    // from index give me position (x,y coordinates)
    index2position: function(i)
    {
        var position = {
            x: i%this.width,                                                          // from linear index compute x position
            y: Math.floor(i/this.width)                                               // from linear index compute y position
        }
        return position;
    },
    // from position (x,y coordinates) give me index
    position2index: function(x,y)
    {
        var index = (y * this.width) + x;
        return index;
    },
    // re-draw field
    draw: function(field, is_dead){
        var length = field.length;
        if (this.width*this.height != length)                                 // test if number of elements corresponds to given width and length
            console.log("The width and height does not correspond to a given field array");

        // clear rectangle
        this.canvas_context.clearRect(0, 0, this.width*this.point_width, this.height*this.point_height);

        var i, bodyPositions = [];
        
        for (i = 0; i < length; i++){                                                // draw every point
            var position = this.index2position(i);                                    // from linear index compute y position
            if ( field[i] > 100) {
                position.i = field[i];
                bodyPositions.push(position);
            }
            var direction,
                right = this.position2index(position.x + 1, position.y),
                left = this.position2index(position.x - 1, position.y),
                up = this.position2index(position.x, position.y - 1),
                down = this.position2index(position.x, position.y + 1);
            
            if (field[right] > 100)
                direction = "left";
            else if (field[left] > 100)
                direction = "right";                
            else if (field[up] > 100)
                direction = "down";                
            else if (field[down] > 100)
                direction = "up";                
                
            this.drawPoint(position.x, position.y, field[i], direction);
        }

        bodyPositions.sort( function(a, b) { return a.i < b.i; } );
//        this.drawBody(bodyPositions);
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
        
    },
    // draw particular one point in the field
    drawPoint: function(x, y, code, direction){
        if (code == 0)                                                            // none
            this.drawEmptyPoint(x, y);
        else if (code == 1)                                                       // wall
            this.drawWallPoint(x, y);
        else if (code == 2)                                                       // flower
            this.drawFlowerPoint(x, y);
        else if (code == 3)                                                       // reverse flower
            this.drawReverseFlowerPoint(x, y);
        else if (code == 4)                                                       // bonus
            this.drawBonusPoint(x, y);
        else if (code == 100)                                                     // snake's head
            this.drawSnakeHeadPoint(x, y, direction);
        else if (code > 100)                                                      // snake's body
            this.drawSnakeBodyPoint(x, y);
        else ;
//            console.log('unknown point code');
    },
    // draw point where nothing is
    drawEmptyPoint: function(x,y){
        /*this.canvas_context.globalAlpha = 0;
          this.canvas_context.fillStyle = "#FFFFFF";
          this.canvas_context.fillRect(x*this.point_width, y*this.point_height, this.point_width, this.point_height);
          this.canvas_context.globalAlpha = 1;*/
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
    drawSnakeHeadPoint: function(x, y, direction){
        var ctx = this.canvas_context, w = this.point_width, h = this.point_height,
            f = SNAKE.head.factor;
        
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

        /*
          ctx.strokeStyle = "white";
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc((x * pw) + (pw / 2), (y * ph) + (ph / 2), (0.5), 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
        */
        
        //this.canvas_context.fillStyle = "#008bce";
        //this.canvas_context.fillRect(x*this.point_width, y*this.point_height, this.point_width, this.point_height);
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
        this.canvas_context.fillRect(x*this.point_width, y*this.point_height, this.point_width, this.point_height);
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