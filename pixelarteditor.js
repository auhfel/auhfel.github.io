Start();
async function Start() {

    await Texture.Initialize();
    let textureShader = await Shader.Create("fullscreenBlit.vert", "noiseGen.frag");
    let noiseTexture = Texture.NewRenderTexture(512, 512);
    Texture.RenderToTexture(noiseTexture, textureShader);

    let raymarcherShader = await Shader.Create("testSDF.vert", "testSDF.frag")
    raymarcherShader.Use();
    let positionLocation = raymarcherShader.GetUniformLocation("position");
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
    ]), gl.STATIC_DRAW);
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    raymarcherShader.SetTexture("texture",noiseTexture);
    raymarcherShader.SetFloat("dimensions",[gl.canvas.width,gl.canvas.height]);
    raymarcherShader.SetFloat("timeSinceStart",[0]);
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    gl.bindVertexArray(vao);
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
    //gl.drawArrays(gl.TRIANGLES, 0, 6);

    let frameCounter = 0;
    let timeCounter = 0;
    let lastTimestamp = performance.now();
    let timerForShader = 0.0;
    let update = function () {
        //gl.clear(gl.COLOR_BUFFER_BIT);
       
        if(Input.GetKeyDown("w")) {
            console.log("hit");
        }
        let thisTimestamp = performance.now();
        frameCounter++;
        let delta = thisTimestamp - lastTimestamp;
        timerForShader += delta;
        timeCounter += delta;
        lastTimestamp = thisTimestamp;
        raymarcherShader.SetFloat("timeSinceStart",[timerForShader]);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        if(timeCounter > 2000){
            console.clear();
            console.log("FPS is " + (frameCounter/2) + "fps");
            frameCounter = 0;
            timeCounter = 0;
        }
        Input.Update();
        requestAnimationFrame(update);
    }
    update(1.0);
    //requestAnimationFrame(update);
}
