//hide scrollbars,margin
document.body.style.overflow = "hidden";
document.body.style.margin = "0";
let aspectRatio = window.innerWidth / window.innerHeight;
let canvas = document.createElement("canvas");
//width and height here set render size
let scaler = 1.0;
canvas.width =  300 * scaler;
canvas.height = 200 * scaler;
//width and height here stretches it to fit screen
canvas.style.width = "100vw";
canvas.style.height = "100vh";
canvas.style.position = "absolute";
canvas.style.imageRendering = "pixelated";
canvas.style.zIndex = "-1";

document.body.appendChild(canvas);
let gl = canvas.getContext("webgl2");

gl.Resize = function(height) {
    canvas.height = height;
    canvas.width = aspectRatio * height;

    gl.viewport(0,0,canvas.width,canvas.height);
}
