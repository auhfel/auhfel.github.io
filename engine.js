var engine;
var input;
var graphics;
var helpers;
var degreeToRadians;
function main() {
    degreeToRadians = 3.14 / 180.0;
    helpers = new Helpers();
    input = new Input();
    graphics = new Graphics();
    engine = new Engine();
}
class Engine {
    gameLoop;
    targetFrameTime = 1000.0 / 60.0;
    constructor() {
        //this.game = new Game();
        this.start();
        var lastFrameTime = new Date();
        this.gameLoop = setInterval(() => {
            let thisFrameTime = new Date();
            this.update((thisFrameTime - lastFrameTime));
            lastFrameTime = thisFrameTime;
        }, this.targetFrameTime);
    }
    start() {
        window.addEventListener('resize', function (event) {
            resizeScreen();
        }, true);
        resizeScreen();
        gameStart();
    }
    update(timeDelta) {

        //delta time
        //@todo: calculate the real deltatime and pass to game loop
        gameUpdate(timeDelta);
        graphics.render();
        input.updatePriorFrameInputMap();

    }
    quit() {
        gameQuit();
    }
    exit() {
        clearInterval(this.gameLoop);
        this.quit();
    }
}
//@todo: I dunno why the input class doesn't work if inputMap and priorFrameInput are in the class as fields..
let inputMap = {};
let priorFrameInputMap = {};
class Input {
    constructor() {
        this.SetKeyEvent("keyup", false);
        this.SetKeyEvent("keydown", true);
    }
    SetKeyEvent(keyEventType, val) {
        window.addEventListener(keyEventType, function (event) {
            if (event.defaultPrevented) return;
            inputMap[event.key] = val;
            //@todo a sloppy fix to initialize priorFrameInput before a key is actually pressed.
            //Should initiaizle it properly if I can find out how to iterate keyboard keys..
            //Or manually do it for keys I know that I'll use
            if (priorFrameInputMap[event.key] == null)
                priorFrameInputMap[event.key] = false;
            event.preventDefault();
        }, true);
    }
    updatePriorFrameInputMap() {
        //priorFrameInputMap.length = 0;
        for (const [key, value] of Object.entries(inputMap)) {
            priorFrameInputMap[key] = value;
        }
    }
    getKeyDown(keyCode) {
        return inputMap[keyCode] == true && priorFrameInputMap[keyCode] == false;
    }
    getKey(keyCode) {
        return inputMap[keyCode] == true;
    }
    getKeyUp(keyCode) {
        return inputMap[keyCode] == false && priorFrameInputMap[keyCode] == true;
    }
}

var vertexData = [];
class Graphics {
    constructor() {
        var canvas = document.getElementById('gameCanvas');
        this.gl = canvas.getContext('webgl2');
        if (!this.gl) {
            alert('Your browser does not support Webgl, trying Experimental Webgl');
            this.gl = canvas.getContext('experimental-webgl');
        }
        if (!this.gl) {
            alert('Your browser does not support Webgl');
            return;
        }
        var vertexShaderText =
            [
                'precision mediump float;',
                '',
                'attribute vec3 vertPosition;',
                'varying float fragColor;',
                '',
                'void main()',
                '{',
                'fragColor = vertPosition.z;',
                'gl_Position = vec4(vertPosition.xy,0.0,1.0);',
                '}'
            ].join('\n');

        var fragmentShaderText =
            [
                'precision mediump float;',
                '',
                'varying float fragColor;',
                'void main()',
                '{',
                'gl_FragColor = vec4(fragColor,fragColor,fragColor,1.0);',
                // 'gl_FragColor = vec4(0.0,0.0,1.0,1.0);',
                '}'
            ].join('\n');
        this.gl.clearColor(0, 0, 0, 1);
        let vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        let fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

        this.gl.shaderSource(vertexShader, vertexShaderText);
        this.gl.shaderSource(fragmentShader, fragmentShaderText);

        this.gl.compileShader(vertexShader);
        if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
            console.error('ERROR compiling vertex shader!', this.gl.getShaderInfoLog(vertexShader));
        }
        this.gl.compileShader(fragmentShader);
        if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
            console.error('ERROR compiling fragment shader!', this.gl.getShaderInfoLog(fragmentShader));
        }

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('ERROR linking program!', this.gl.getProgramInfoLog(this.program));
            return;
        }
        this.gl.validateProgram(this.program);
        if (!this.gl.getProgramParameter(this.program, this.gl.VALIDATE_STATUS)) {
            console.error('ERROR validating program!', this.gl.getProgramInfoLog(this.program));
        }
        this.vertexBufferObject = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBufferObject);
        this.vertexAttribLocation = this.gl.getAttribLocation(this.program, 'vertPosition');
        this.gl.vertexAttribPointer(
            this.vertexAttribLocation,
            3, //NUm elements per vertex
            this.gl.FLOAT,
            this.gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT,// Size of an individual vertex in bytes
            0 // Offset from the beginning of a vertex to this attribute
        );
    }
    addVertexData(x, y, shade) {
        vertexData.push(x, y, shade);
    }
    drawSquare(bottomLeftX, bottomleftY, width, color) {
        vertexData.push(
            bottomLeftX, bottomleftY, color,
            bottomLeftX, bottomleftY + width, color,
            bottomLeftX + width, bottomleftY + width, color,
            bottomLeftX + width, bottomleftY + width, color,
            bottomLeftX, bottomleftY, color,
            bottomLeftX + width, bottomleftY, color
        );
    }
    drawLine(startX, startY, endX, endY, width, color) {
        let distance = Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY));
        let drawDirX = ((startX - endX) / distance) * width;
        let drawDirY = ((startY - endY) / distance) * width;

        let degrees = 90 * degreeToRadians;
        let oldX = drawDirX;
        let cosAngle = Math.cos(degrees);
        let sinAngle = Math.sin(degrees);
        drawDirX = drawDirX * cosAngle - drawDirY * sinAngle;
        drawDirY = oldX * sinAngle + drawDirY * cosAngle;
        startX -= drawDirX/2;
        startY -= drawDirY/2;
        endX -= drawDirX/2;
        endY -= drawDirY/2;
        vertexData.push(
            startX, startY, color,
            endX, endY, color,
            startX + drawDirX, startY + drawDirY, color,
            startX + drawDirX, startY + drawDirY, color,
            endX, endY, color,
            endX + drawDirX, endY + drawDirY, color,
        )



    }
    render() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBufferObject);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexData), this.gl.DYNAMIC_DRAW);
        this.gl.enableVertexAttribArray(this.vertexAttribLocation);
        this.gl.useProgram(this.program);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, vertexData.length/3);
        this.gl.disableVertexAttribArray(this.vertexAttribLocation);
        vertexData.length = 0;
    }
    resizeGlViewport(width, height) {
        this.gl.viewport(0, 0, width, height);
    }
}


//Engine Classes
class Vector2 {
    constructor() {
        this.x = 0.0; this.y = 0.0;
    }
    createXY(x, y) {
        var vector = new Vector2();
        vector.x = x;
        vector.y = y;
        return vector;
    }
    multiply(floatValue) {
        return this.createXY(this.x * floatValue, this.y * floatValue);
    }
    divide(otherFloatValue) {
        return this.createXY(this.x / floatValue, this.y / floatValue);
    }
    add(otherVector2) {
        return this.createXY(this.x * otherVector2.x, this.y * otherVector2.y);
    }
    rotate(degrees) {
        degrees *= degreeToRadians;
        let oldX = this.x;
        let cosAngle = Math.cos(degrees);
        let sinAngle = Math.sin(degrees);
        this.x = this.x * cosAngle - this.y * sinAngle;
        this.y = oldX * sinAngle + this.y * cosAngle;
    }
};

function resizeScreen() {
    var gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
    graphics.resizeGlViewport(gameCanvas.width, gameCanvas.height);
}

class Helpers {
    constructor() {
        this.isFullScreen = false;
    }

    toggleFullScreen() {
        if (this.isFullScreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
            this.isFullScreen = false;
            return;
        }
        // Supports most browsers and their versions.
        var requestMethod = document.body.requestFullScreen || document.body.webkitRequestFullScreen || document.body.mozRequestFullScreen || element.msRequestFullScreen;

        if (requestMethod) { // Native full screen.
            requestMethod.call(document.body);
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
        this.isFullScreen = true;
    }
}

