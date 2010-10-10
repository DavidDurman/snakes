/**
 * Copyright (c) David Durman & Ales Sturala 2010.
 */

var Bonus = {
    prolong: function(enemy){
        Communicator.send({ action: "fire", value: "prolong", id: enemy.uid });
    },
    project: function(enemy, nsend){
        enemy.style.webkitTransform = "rotateY(-120deg)";
        if (!nsend){
            Communicator.send({ action: "fire", value: "project", id: enemy.uid });
        }
        setTimeout(function(){
            enemy.style.webkitTransform = null;
        }, 5000);
    },
    shake: function(enemy, nsend){
        //        enemy.style.webkitTransform = "rotateX(30deg) scale(1.2)";
        if (!nsend){
            Communicator.send({ action: "fire", value: "shake", id: enemy.uid });
        }
        enemy.style.webkitTransition = "none";
        function move(dx){
            enemy.style.webkitTransform = "rotateX(30deg) translate(" + dx + "px, 0)";
        }
        move(-20);
        setTimeout(function(){
            move(20);
            setTimeout(function(){
                move(-20);
                setTimeout(function(){
                    move(20);
                    setTimeout(function(){
                        move(-20);
                        enemy.style.webkitTransition = null;
                        enemy.style.webkitTransform = null;
                    }, 100);
                }, 100);
            }, 100);
        }, 100);
    },
    rotate: function(enemy, nsend){
        enemy.style.webkitTransform = "rotateX(30deg) rotateZ(-180deg)";
        if (!nsend){
            Communicator.send({ action: "fire", value: "rotate", id: enemy.uid });
        }
        setTimeout(function(){
            enemy.style.webkitTransform = null;
        }, 5000);
    }
};


