
const Compute = {};

Compute.CreateTextureForComputeShader = function (gl, width, height) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,                // mip level
        gl.RGBA,     // internal format
        width,
        height,
        0,                // border
        gl.RGBA,     // format
        gl.UNSIGNED_BYTE, // type
        null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
}

Compute.CreateComputeShader = function (width, height, fragmentShaderSource, canvas = null) {
    let computeShader = {};
    if (canvas == null) {
        canvas = new OffscreenCanvas(width, height);
    }
    else {
        canvas.width = width;
        canvas.height = height;
    }
    let gl = canvas.getContext("webgl");
    let program = Graphics._GenerateShaderProgram(gl, shaders.computeVert, fragmentShaderSource);

    let positionLocation = gl.getAttribLocation(program, 'position');
    let textureLocation = gl.getUniformLocation(program, 'texture');
    let dimensionsLocation = gl.getUniformLocation(program, 'dimensions');
    const texture = Compute.CreateTextureForComputeShader(gl, width, height);
    Compute.texture = texture;
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, shaders.fullScreenQuad, gl.STATIC_DRAW);
    const frameBuffer = gl.createFramebuffer();
    computeShader.Run = function () {
        gl.useProgram(program);
        //gl.activeTexture(gl.TEXTURE0);
        //gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(textureLocation, 0);
        
        gl.uniform2f(dimensionsLocation, width, height);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(
            positionLocation,
            2, //num components in vertex position
            gl.FLOAT, //the positions are floats
            false,
            0,
            0,
        );
        gl.viewport(0, 0, width, height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    computeShader.RenderToTexture = function () {
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        computeShader.Run();
    }
    computeShader.RenderToScreen = function () {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        computeShader.Run();
    }
    computeShader.Log = function () {
        const results = new Uint8Array(width * height * 4);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, results);
        let log = "";
        // print the results
        for (let i = 0; i < width * height; ++i) {
            log += results[i * 4];
            log += " ";
            if ((i + 1) % width == 0)
                log += "\n";
        }
        console.log(log);
    }
    return computeShader;
}
Compute.CreateScreenPixelTexture = function (gl) {
    const targetTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return targetTexture;
}
let testCompute = {};
Compute.Initialize = function () {
    let dim = 256;
    Compute.dimensions = dim;
    testCompute = Compute.CreateComputeShader(dim, dim, shaders.rayMarcherFrag, Graphics.canvas);
    //testCompute.Log();
    testCompute.RenderToTexture();
    //testCompute.Log();
}

let timer = 0;
let toggle = false;
Compute.test = function () {
    return;
    timer += Time.delta;
    if (timer > 1000.0) {
        console.log("sec");
        timer = 0;
        if (toggle) {
            Graphics.gl.clear(Graphics.gl.COLOR_BUFFER_BIT);
            testCompute.RenderToScreen();
        }
        else {
            Graphics.gl.clear(Graphics.gl.COLOR_BUFFER_BIT);
            testCompute.RenderToTexture();
        }
        toggle = !toggle;
    }
    //testCompute.Run();

}

//start.addFunction(Compute.Initialize, 1);
//update.addFunction(Compute.test, 100)