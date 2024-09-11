class Shader{
    constructor(shaderProgram) {
        this.program = shaderProgram;
        this.uniformLocations = new Map();
    }
    Use(){
        gl.useProgram(this.program);
    }
    GetUniformLocation(uniformName) {
        let uniformLocation = -1;
        if (!this.uniformLocations.has(uniformName)) {
            uniformLocation = gl.getUniformLocation(this.program, uniformName);
            if (uniformLocation < 0) {
                console.log("Error: Uniform not found."); return;
            }
            this.uniformLocations.set(uniformName, uniformLocation);
        }
        return this.uniformLocations.get(uniformName);
    }
    SetFloat(uniformName, first, second = null,third = null,fourth = null) {
        let uniformLocation = this.GetUniformLocation(uniformName);
        switch (arguments.length - 1) {
            case 1:
                gl.uniform1f(uniformLocation, first);
                break;
            case 2:
                gl.uniform2f(uniformLocation, first, second);
                break;
            case 3:
                gl.uniform3f(uniformLocation, first, second, third);
                break;
            case 4:
                gl.uniform4f(uniformLocation, first, second, third, fourth);
                break;
            default:
                console.log("Error: Can't set uniform with 0 or less or more than 4 values");
                break;
        }

    }
    SetInt(uniformName, first, second = null,third = null,fourth = null) {
        let uniformLocation = this.GetUniformLocation(uniformName);
        switch (arguments.length - 1) {
            case 1:
                gl.uniform1i(uniformLocation, first);
                break;
            case 2:
                gl.uniform2i(uniformLocation, first, second);
                break;
            case 3:
                gl.uniform3i(uniformLocation, first, second, third);
                break;
            case 4:
                gl.uniform4i(uniformLocation, first, second, third, fourth);
                break;
            default:
                console.log("Error: Can't set uniform with 0 or less or more than 4 values");
                break;
        }
    }
    SetTexture(uniformName, value) {
        let uniformLocation = this.GetUniformLocation(uniformName);
        gl.uniform1i(uniformLocation, value);
    }
    static async Create(vertexFileName,fragmentFileName) {
        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        let vertexShaderSource = await this.#LoadShader(vertexFileName);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);
        this.#CheckForShaderErrors(vertexShader, "Vertex");
    
        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        let fragmentShaderSource = await this.#LoadShader(fragmentFileName);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);
        this.#CheckForShaderErrors(fragmentShader, "Fragment");
    
        let shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        return new Shader(shaderProgram);

    }
    static async #LoadShader(shaderName) {
        return (await fetch('http://localhost:8080/'+shaderName)).text();
    }
    static #CheckForShaderErrors(shader, shaderTypeInText) {
        let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (compiled)
            return;
        console.log(shaderTypeInText + "shader failed to compile");
        let log = gl.getShaderInfoLog(shader);
        console.log(log);
    }
}