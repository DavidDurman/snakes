var system = {
    env: {},
    init: function init(){
        this.load();
        this.setup();

        window._ = function(){
            system.stdout.write.apply(system, arguments);
            system.stdout.flush();
        };
    },
    load: function load(){
        /*
        var i = 0, l = scripts.length;
        for (; i < l; i++){
            scriptAppend(scripts[i]);
        }
        */
    },
    print: function(str){
        console.log(str);
        var d = document.getElementById("debug");
        d.innerHTML += str + "<br/>";
    },
    setup: function setup(){
        var params, i, l, parts, key, value;
        // store environment variables
        params = window.location.search.substr(1).split("&");
        for (i = 0, l = params.length; i < l; i++) {
            parts = params[i].split("=");
            key = decodeURIComponent(parts[0]);
            if (key) {
                value = parts[1];
                if (value)
                    this.env[key] = decodeURIComponent(value);
            }
        }
        var self = this;
        // stdin, stdout, stderr
        function stdio() {
            var buffer = [];
            return {
                write: function(text) {
                    buffer.push(text.toString());
                    return this;
                },
                flush: function() {
                    self.print(buffer.splice(0).join(""));
                    return this;
                }
            };
        }
        this.stdin = null;      // @todo
        this.stdout = stdio();
        this.stderr = stdio();

        // run main
        if (this.env.main){
            window[this.env.main]();
        } else {
            main();
        }
    }
};

