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
    if (this.width*this.height != field.length)                                 // test if number of elements corresponds to given width and length
      console.log("The width and height does not correspond to a given field array");

    // clear rectangle
    this.canvas_context.clearRect(0, 0, this.width*this.point_width, this.height*this.point_height);

    for(i=0;i<field.length;i++){                                                // draw every point
      var position = this.index2position(i);                                    // from linear index compute y position
      this.drawPoint(position.x,position.y,field[i]);                           // draw point
    }
  },
  // draw particular one point in the field
  drawPoint: function(x,y,code){
      if (code == 0)                                                            // none
        this.drawEmptyPoint(x,y);
      else if (code == 1)                                                       // wall
        this.drawWallPoint(x,y);
      else if (code == 2)                                                       // flower
        this.drawFlowerPoint(x,y);
      else if (code == 3)                                                       // reverse flower
        this.drawReverseFlowerPoint(x,y);
      else if (code == 4)                                                       // bonus
        this.drawBonusPoint(x,y);
      else if (code == 100)                                                     // snake's head
        this.drawSnakeHeadPoint(x,y);
      else if (code > 100)                                                      // snake's body
        this.drawSnakeBodyPoint(x,y);
      else
        console.log('unknown point code');
  },
  // draw point where nothing is
  drawEmptyPoint: function(x,y){
    /*this.canvas_context.globalAlpha = 0;
    this.canvas_context.fillStyle = "#FFFFFF";
    this.canvas_context.fillRect(x*this.point_width, y*this.point_height, this.point_width, this.point_height);
    this.canvas_context.globalAlpha = 1;*/
  },
  // draw point where snake's body is
  drawSnakeBodyPoint: function(x,y){

    this.canvas_context.strokeStyle = "#FF00FF";
    this.canvas_context.fillStyle = "#FFFF00";
    this.canvas_context.beginPath();
    this.canvas_context.arc(x*this.point_width+this.point_width/2,y*this.point_height+this.point_height/2,this.point_width/2,0,Math.PI*2,true);
    this.canvas_context.closePath();
    this.canvas_context.stroke();
    this.canvas_context.fill();

    //this.canvas_context.fillStyle = "#06aeff";
    //this.canvas_context.fillRect(x*this.point_width, y*this.point_height, this.point_width, this.point_height);
  },
  // draw point where snake's head is
  drawSnakeHeadPoint: function(x,y){
    this.canvas_context.strokeStyle = "#FFFF00";
    this.canvas_context.fillStyle = "#FF00FF";
    this.canvas_context.beginPath();
    this.canvas_context.arc(x*this.point_width+this.point_width/2,y*this.point_height+this.point_height/2,this.point_width/2,0,Math.PI*2,true);
    this.canvas_context.closePath();
    this.canvas_context.stroke();
    this.canvas_context.fill();

    //this.canvas_context.fillStyle = "#008bce";
    //this.canvas_context.fillRect(x*this.point_width, y*this.point_height, this.point_width, this.point_height);
  },
  // draw flower
  drawFlowerPoint: function(x,y){
    this.canvas_context.fillStyle = "#1fe050";
    this.canvas_context.fillRect(x*this.point_width, y*this.point_height, this.point_width, this.point_height);
  },
  // draw reverse flower
  drawReverseFlowerPoint: function(x,y){
    this.canvas_context.fillStyle = "#e600b4";
    this.canvas_context.fillRect(x*this.point_width, y*this.point_height, this.point_width, this.point_height);
  },
  // draw wall
  drawWallPoint: function(x,y){
    //this.canvas_context.fillStyle = "#55ffffff";
    this.canvas_context.fillStyle = "#000000";
    this.canvas_context.fillRect(x*this.point_width, y*this.point_height, this.point_width, this.point_height);
  },
  // draw bonus
  drawBonusPoint: function(x,y){
    //this.canvas_context.fillStyle = "#b8e612";
    this.canvas_context.fillStyle = "#e6f107";
    this.canvas_context.fillRect(x*this.point_width, y*this.point_height, this.point_width, this.point_height);
  },
}