/**
 * Copyright (c) David Durman & Ales Sturala 2010.
 */

var Logic = {
    game_canvas: null,
    field: [],
    snake_direction: null,                                                        // right, down, left, up
    is_dead: false,
    refresh: null,
    extend_snake: 0,                                                              // extend snake by given number of cells
    consumed_flowers: 0,                                                          // number of flowers caught (used to determine when inverse flowers should appear)
    bonus_count: 3,
    reverse_flower_count: 5,          // nu
    reverse_flower_steps: 15,
    timeout_for_reverse_flowers: 0,                                               // when reverse flowers are disaplyed this number keeps how many "ticks" tje flowers disaplyed and decreases with each this, when reaches 0 should remove all reverse flowers
    on_bonus: null,

    init: function(game_canvas){
        var i;
        
        this.game_canvas = game_canvas;

        // initialize field with default values
        // field consinsts of width*height points
        for( i = 0; i < this.game_canvas.width * this.game_canvas.height; i++)         // init the field with 'nothing' in each point (code 0 denotes 'nothing')
            this.field[i] = 0;

        // init game field
        // init wall
        for ( i = 0; i < this.game_canvas.width; i++){                                 // horizontal walls
            this.field[this.game_canvas.position2index(i,0)] = 1;
            this.field[this.game_canvas.position2index(i,this.game_canvas.height-1)] = 1;
        }
        for ( i = 0; i < this.game_canvas.height; i++){                                // horizontal walls
            this.field[this.game_canvas.position2index(0,i)] = 1;
            this.field[this.game_canvas.position2index(this.game_canvas.width-1,i)] = 1;
        }

        // init snake
        this.field[this.game_canvas.position2index(1,2)] = 104;
        this.field[this.game_canvas.position2index(2,2)] = 103;
        this.field[this.game_canvas.position2index(3,2)] = 102;
        this.field[this.game_canvas.position2index(4,2)] = 101;
        this.field[this.game_canvas.position2index(5,2)] = 100;

        this.field[this.game_canvas.position2index(5,7)] = 4;

        this.snake_direction = "right";
        this.game_canvas.draw(this.field);

        return this;
    },
    tick: function(){
        if (this.timeout_for_reverse_flowers <= 0)
            return;


        if (this.timeout_for_reverse_flowers == 1)
            while (this.field.indexOf(3) != -1){                                      // remove all flowers
                this.field[this.field.indexOf(3)] = 0;
            }
        this.timeout_for_reverse_flowers--;
        this.consumed_flowers++;
    },
    move: function(x_offset, y_offset){
        if (this.is_dead)                                                           // do nothing if dead
            return;

        var index = this.field.indexOf(100);
        var position = this.game_canvas.index2position(index);
        position.x += x_offset;
        position.y += y_offset;

        var new_index = this.game_canvas.position2index(position.x, position.y);
        this.move_point(new_index, 100);
        if (this.consumed_flowers > 0 && this.consumed_flowers % this.reverse_flower_steps == 0 && this.field.count(3) < this.reverse_flower_count){        // throw reverse flowers
            this.create_reverse_flower();
            //console.log(this.timeout_for_reverse_flowers);
            if (this.timeout_for_reverse_flowers <= 0)
                this.timeout_for_reverse_flowers = 130;
        }
        else if (this.consumed_flowers > 0 && this.consumed_flowers % this.bonus_count == 0 && this.field.count(4) == 0)   // throw bonus
            this.create_bonus();
        else if (this.field.indexOf(2) == -1 && this.field.count(3) == 0)           // there is no flower and no reverse flower => create flower
            this.create_flower();

        if (this.refresh != null)                                                   // callback
            this.refresh(this.field);
    },
    move_point: function(new_index, code){
        var index = this.field.indexOf(code);

        // test colisions
        if (code == 100 && this.field[new_index] == 1){                             // wall
            this.is_dead = true;
            Stats.hit();
        }
        else if (code == 100 && this.field[new_index] == 2){                        // flower
            this.extend_snake++;
            this.consumed_flowers++;
        }
        else if (code == 100 && this.field[new_index] == 3)                         // reverse flower
            this.extend_snake--;
        else if (code == 100 && this.field[new_index] == 4){                        // bonus
            this.consumed_flowers++;
            this.on_bonus();
        }
        else if (code == 100 && this.field[new_index] >= 101)                       // snake body
            this.is_dead = true;

        // if on tail-1 cell => test if snake is supposed to shrink => if so clear tail-1 and tail point
        var tail_code = this.field.max();
        if (tail_code-1 == code && this.extend_snake < 0){
            if (tail_code == 102){                                                    // the size of the snake is 3 => do not shorter, remove all reverse flowers
                this.extend_snake = 0;
                while (this.field.indexOf(3) != -1){
                    this.field[this.field.indexOf(3)] = 0;
                }
                this.field[new_index] = code;
                this.consumed_flowers++;                                                // little hack to increase the number of flowers so reverse flowrers do not get generated
            }
            else{
                // remove current cell and next cell (that should be last cell (tail))
                this.field[new_index] = code;                                           // move tail-1 to new index
                this.field[index] = 0;                                                  // clear tail-1
                this.field[this.field.indexOf(code+1)] = 0;                             // clear tail
                this.extend_snake++;
                return;
            }
        }
        // tail cell
        else if (index == -1){                                                      // processing last cell of snake
            if (this.extend_snake >= 1){                                              // snake is supposed to be extended => leave the cell
                this.extend_snake--;
                this.field[new_index]++;
            }
            else
                this.field[new_index] = 0;
            return;
            // body cell
        } else
            this.field[new_index] = code;

        this.move_point(index, code + 1);
    },
    right: function(){
        if (this.snake_direction == "left")                                         // do not allow to go to opposite direction (eat itself)
            return;

        this.snake_direction = "right";
        this.move(1,0);
        this.game_canvas.draw(this.field, this.is_dead);
    },
    left: function(){
        if (this.snake_direction == "right")                                        // do not allow to go to opposite direction (eat itself)
            return;

        this.snake_direction = "left";
        this.move(-1,0);
        this.game_canvas.draw(this.field, this.is_dead);
    },
    up: function(){
        if (this.snake_direction == "down")                                         // do not allow to go to opposite direction (eat itself)
            return;

        this.snake_direction = "up";
        this.move(0,-1);
        this.game_canvas.draw(this.field, this.is_dead);
    },
    down: function(){
        if (this.snake_direction == "up")                                           // do not allow to go to opposite direction (eat itself)
                return;

        this.snake_direction = "down";
        this.move(0,1);
        this.game_canvas.draw(this.field, this.is_dead);
    },
    create_flower: function(){                                                    // create one flower in the game on random position
        var index = this.get_random_empty_index();
        this.field[index] = 2;
    },
    create_reverse_flower: function(){                                            // create one inverse flower in the game on random position
        var index = this.get_random_empty_index();
        this.field[index] = 3;
    },
    create_bonus: function(){                                                     // create one bonus at random position
        var index = this.get_random_empty_index();
        this.field[index] = 4;
    },
    get_random_empty_index: function(){                                           // generate random index; regenerate if there is something on the position (code != 0) or if the possition is right near the wall
        do {
            var index = Math.floor(Math.random()*this.field.length);                  // get me random number between 0..(size of fields-1 incl.)
            var position = this.game_canvas.index2position(index);
            var index_right = this.game_canvas.position2index(position.x+1, position.y);
            var index_bottom = this.game_canvas.position2index(position.x, position.y+1);
            var index_left = this.game_canvas.position2index(position.x-1, position.y);
            var index_top = this.game_canvas.position2index(position.x, position.y-1);

        } while(this.field[index] != 0 ||
                this.field[index_right] == 1 ||
                this.field[index_bottom] == 1 ||
                this.field[index_left] == 1 ||
                this.field[index_top] == 1);

        return index;
    },
    action_extend: function(num){
        this.extend_snake += num;
    }
}