/**
 * Copyright (c) David Durman & Ales Sturala 2010.
 */

var canvas, enemy1, enemy2, logic,
    enemy1Playfield, enemy2Playfield, enemies = {},
    activeEnemy = null, audio;

function activateEnemy(enemy){
    if (activeEnemy){
        activeEnemy.style.borderTop = null;
    }
    activeEnemy = enemy;
    enemy.style.borderTop = "2px solid red";
    if (enemy === enemy1){
        document.getElementById("cannon").className = "left";
    } else {
        document.getElementById("cannon").className = "right";        
    }
}

/**
 * Called when all players are connected. The game can start.
 */
var SetupUser = function(id){
    User.id = id;
};

var Start = function(id){
    console.log("Game has just started.");
    setInterval(function(){
        Communicator.send({ action: "state", value: JSON.stringify(rle_encode(logic.field)), id: User.id });
        //        Communicator.send({ action: "state", value: JSON.stringify(logic.field), id: User.id });
    }, 100);
    };

var Received = function(data){
    switch (data.action){
      case "start":
        SetupUser(data.id);
        break;
      case "close":
//        Communicator.send({ action: "died", id: User.id });
//        _("Connection closed.");
        break;
      case "ready":
        Start(User.id);
        break;
      case "refuse":
        console.log("Connection refused.");
        break;
      case "state":
        if (data.id != User.id){
            // @todo Terrible code!!!
            if (!enemies[data.id]){
                if (keys(enemies).length == 1){
                    enemies[data.id] = enemy2Playfield;
                } else {
                    enemies[data.id] = enemy1Playfield;
                }
                enemies[data.id].canvas.uid = data.id;
            }
            enemies[data.id].draw(rle_decode(JSON.parse(data.value)));
            //            Object.create(GameCanvas).init(enemy1, 200, 200, 5, 5)
            //            Object.create(GameCanvas).init(enemy2, 200, 200, 5, 5).draw(rle_decode(JSON.parse(data.value)));
            //            Object.create(GameCanvas).init(enemy1, 200, 200, 5, 5).draw(JSON.parse(data.value));
        }
        break;
      case "fire":
        switch (data.value){
          case "project":
            Stats.flash("You've been projectd.");
            Bonus.project(canvas, true);
            break;
          case "prolong":
            Stats.flash("You've been prolonged.");
            logic.action_extend(5);
            break;
          case "rotate":
            Stats.flash("You've been rotated.");
            Bonus.rotate(canvas, true);
            break;
          case "shake":
            Stats.flash("You've been shaked.");
            Bonus.shake(canvas, true);
            break;
        default: break;
        }
        break;

    default:
        console.warn("Unknown message received.");
        break;
    }
};

var Setup = function(){
    Stats.init();
    Audio.init();

    canvas = document.createElement("canvas");
    canvas.setAttribute("id", "playfield");
    canvas.setAttribute("width", 400);
    canvas.setAttribute("height", 400);
    document.getElementById("application").appendChild(canvas);

    enemy1 = document.createElement("canvas");
    enemy1.setAttribute("class", "enemy left");
    enemy1.setAttribute("width", 200);
    enemy1.setAttribute("height", 200);
    document.getElementById("application").appendChild(enemy1);

    enemy2 = document.createElement("canvas");
    enemy2.setAttribute("class", "enemy right");
    enemy2.setAttribute("width", 200);
    enemy2.setAttribute("height", 200);
    document.getElementById("application").appendChild(enemy2);

    enemy1Playfield = Object.create(GameCanvas).init(enemy1, 200, 200, 5, 5);
    enemy2Playfield = Object.create(GameCanvas).init(enemy2, 200, 200, 5, 5);

    activateEnemy(enemy1);

    var gameCanvas = Object.create(GameCanvas).init(canvas, 400, 400, 10, 10);
    logic = Object.create(Logic).init(gameCanvas);
    logic.on_bonus = function(){
        
        var rand = Math.random();

        var i = 0, len = BONUS.probabilities.length, prob;
        for (; i < len; i++ ) {
            prob = BONUS.probabilities[i];
            if (rand < +prob){
                Bonus[ BONUS.probabilityTable[prob] ](activeEnemy);
                break;  // find only the first applicable one
            }
        }
        
    };

    InputHandler.init({ delegee: KeyResolver.get(mixin(logic, {
        one: function(evt){
            activateEnemy(enemy1);
        },
        two: function(evt){
            activateEnemy(enemy2);
        }
    })) });
    Communicator.init({ received: Received, context: null });

    skin("css/style.css");


    function step()
    {
        switch(this.logic.snake_direction)
        {
          case "right":
            this.logic.right();
            break;

          case "down":
            this.logic.down();
            break;

          case "left":
            this.logic.left();
            break;

          case "up":
            this.logic.up();
            break;
        default:
            console.log("canvas.htm: unknown direction - " + this.logic.snake_direction);
            break;
        }
    }

    setInterval(step, 80);
};

function main(){
    Setup();
}
