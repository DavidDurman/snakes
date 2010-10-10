var keyResolver = KeyResolver.get({
    left: function(){
        _("left");
    },
    up: function(){
        _("up");
    },
    right: function(){
        _("right");
    },
    down: function(){
        _("down");
    },
    enter: function(){
        _("enter");
    }
});

function test_input(){
    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", 100);
    canvas.setAttribute("height", 100);
    canvas.controller = {
        mousemove: function(evt){
            _("mousemove");
        }
    };
    document.getElementById("application").appendChild(canvas);
    skin("tests/input.css");

    InputHandler.init({ delegee: mixin(keyResolver, {
                                           mousedown: function(){
                                               _("mousedown");
                                           }
    }) });
}
