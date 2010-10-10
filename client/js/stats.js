var Stats = {
    flashmessage: null,
    init: function(){
        this.flashmessage = document.getElementById("flashmessage");
    },
    hit: function(){
        this.flash("You died a slow, painful death.");
        Communicator.send({ action: "died", id: User.id });
        audio.play();
    },
    flash: function(str){
        this.flashmessage.innerHTML = str;
    }
};