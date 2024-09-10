//create a texture



//prepare a shader for writing to it

//create a framebuffer, bind texture to it

//bind framebuffer, run shader, draw to texture

async function Test() {
    return;
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
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    gl.bindVertexArray(vao);
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    //Texture.RenderTextureToScreen(noiseTexture);
}

Test();