var matrix = [
    [0, 0, 0, 0],
    [0, 101, 100, 0],
    [0, 102, 103, 0],
    [0, 0, 0, 0]
];

function test_Start(){
    console.log("Start game");
    Communicator.send({ action: "state", value: JSON.stringify(matrix) });
}

function test_communicator(){
    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", 100);
    canvas.setAttribute("height", 100);
    document.getElementById("application").appendChild(canvas);
    Communicator.init({ ready: test_Start, context: null });
}
