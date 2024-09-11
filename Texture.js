class Texture {
    static async Initialize() {
        this.offscreenFrameBuffer = gl.createFramebuffer();
        this.TextureToScreenShader = await Shader.Create("screenSpace.vert","textureToScreen.frag");
        this.screenVAO = this.CreateScreenVAO(this.TextureToScreenShader);
        
    }
    static CreateScreenVAO(shader) {
        let positionLocation = shader.GetUniformLocation("position");
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
        return vao;
    }
    static RenderToTexture(textureObject,shader) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.offscreenFrameBuffer);
        //textureObject.Use();
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureObject.id, 0);
        gl.viewport(0,0,textureObject.width,textureObject.height);

        gl.clear(gl.COLOR_BUFFER_BIT);
        shader.Use();
        shader.SetFloat("dimensions", textureObject.width,textureObject.height);
        gl.bindVertexArray(this.screenVAO);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        //go back to drawing to screen
        //gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    }
    static RenderTextureToScreen(textureObject) {
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
        let shader = this.TextureToScreenShader;
        shader.Use();
        shader.SetFloat("dimensions", textureObject.width, textureObject.height);
        shader.SetTexture("texture",textureObject.id);
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
        gl.bindVertexArray(this.screenVAO);
        gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
        console.log(gl.canvas.clientWidth);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    constructor(width, height, format = gl.RGBA, type = gl.UNSIGNED_BYTE) {
        this.id = gl.createTexture();
        this.width = width; this.height = height;
        this.Use();
        gl.texImage2D(gl.TEXTURE_2D,0,format,width,height,0,format,type,null);
    }
    static NewRenderTexture(width, height) {
        let texture = new Texture(width,height);
        texture.SetLinearFiltering();
        return texture;
    }
    static NewComputeTexture(width, height) {
        let texture = new Texture(width, height, gl.LUMINANCE,gl.UNSIGNED_BYTE);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        texture.SetNearestFiltering();
        return texture;
    }
    Use() {
        gl.bindTexture(gl.TEXTURE_2D,this.id);
    }
    SetNearestFiltering() {
        this.Use();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    SetLinearFiltering() {
        this.Use();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
}