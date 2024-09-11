let textureShader;
let noiseTexture;
let terrainShader;
let vao;

class TerrainGenerator {
    static async Initialize() {
        textureShader = await Shader.Create("screenSpace.vert", "noiseGen.frag");
        terrainShader = await Shader.Create("screenSpace.vert", "testSDF.frag")
        noiseTexture = Texture.NewRenderTexture(512, 512); 
        //terrainShader.Use();
        let positionLocation = terrainShader.GetUniformLocation("position");
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
        vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        TerrainGenerator.Update();
    }
    static Draw() {
        terrainShader.Use();
        terrainShader.SetTexture("texture",noiseTexture);
        terrainShader.SetFloat("dimensions",gl.canvas.width,gl.canvas.height);
        terrainShader.SetFloat("timeSinceStart",Time.sinceStart);
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
        gl.bindVertexArray(vao);
        gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    static Update() {
        Texture.RenderToTexture(noiseTexture, textureShader);
    }
}