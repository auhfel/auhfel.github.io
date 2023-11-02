
function gameStart() {

}

let time = 0;
let frameTimer = 0;
let frames = 0;
function gameUpdate(deltaTime) {
    time += deltaTime;
    frameTimer += deltaTime;
    frames++;
    if (frameTimer > 1000) {
        console.log('fps is ' + frames);
        frameTimer = 0;
        frames = 0;
    }

    let y = Math.sin(time / 1000) * .5;
   
    graphics.addVertexData(0.0, y, 1.0);
    graphics.addVertexData(-.5, -.5, .1);
    graphics.addVertexData(0.5, -.5, .5);
    //graphics.drawSquare(.5,-1,.5,1);
    graphics.drawLine(-.95,.95,.95,-.95,.05,.5);
    if (input.getKeyDown('q')) {
        engine.exit();
    }
    if (input.getKeyDown('F1')) {
        helpers.toggleFullScreen();
    }
   
}

function gameQuit() {
    console.log('game ended');
}


class Minimap {
    constructor() {

    }
}

class Player {
    constructor() {
        this.position = new Vector2();
        this.rotation = new Vector2();
        this.forward = new Vector2(0,1.0);
    }
    move(x,y){
        this.position.x += x;
        this.position.y += y;
    }
    moveForward(amount) {
        this.position = this.position.add(this.forward.multiply(amount));
    }
    rotate(angle) {
        let oldX = this.forward.x;
        let cosAngle = Math.cos(angle);
        let sinAngle = Math.sin(angle);
        this.forward.x = this.forward.x * cosAngle - this.forward.y * sinAngle;
        this.forward.y = oldX*sinAngle  + this.forward.y * cosAngle;
    }
}