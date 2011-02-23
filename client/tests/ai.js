
var ai_timeout = 700;

(function test_ai () {
    setTimeout( function () {
        Controller.logic.down();

        setTimeout( function () {
            Controller.logic.left();

            setTimeout( function () {
                Controller.logic.up();

                setTimeout( function () {
                    Controller.logic.right();

                    test_ai();
                }, ai_timeout );
                
            }, ai_timeout );
            
        }, ai_timeout );
        
    }, ai_timeout );
})();
    