import {setup} from './setup.js'
import {defaultShaders, defaultVertexAttributes} from './default_shaders.js'

const context = {};
setup(context);

const { gl, canvas } = context;

const createProgram = () => {
    // Create WebGl Shader objects 
    var vertexShader = gl.createShader(gl.VERTEX_SHADER); 
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); 

    // sets the source code of the WebGL shader 
    gl.shaderSource(vertexShader, defaultShaders.vs); 
    gl.shaderSource(fragmentShader, defaultShaders.fs); 

    // Compile GLSL Shaders to a binary data 
    // so WebGLProgram can use them 
    gl.compileShader(vertexShader); 
    gl.compileShader(fragmentShader);

    // Create a WebGLProgram 
    var program = gl.createProgram(); 

    // Attach pre-existing shaders 
    gl.attachShader(program, vertexShader); 
    gl.attachShader(program, fragmentShader); 

    gl.linkProgram(program);

    return program;
}

const createVertexBuffers = (program) => {
    // Create an initialize vertex buffers 
    var vertexBufferObjectPosition = gl.createBuffer(); 
    var vertexBufferObjectColor = gl.createBuffer(); 

    // Bind existing attribute data 
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObjectPosition); 
    gl.bufferData(gl.ARRAY_BUFFER, defaultVertexAttributes.position.data, 
            gl.STATIC_DRAW); 

    var positionAttribLocation = gl.getAttribLocation(program, 
            'vertPosition'); 

    gl.vertexAttribPointer(positionAttribLocation, 
        defaultVertexAttributes.position.numberOfComponents, 
            gl.FLOAT, gl.FALSE, 0, 0); 
    gl.enableVertexAttribArray(positionAttribLocation); 

    // Bind existing attribute data 
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObjectColor); 
    gl.bufferData(gl.ARRAY_BUFFER, defaultVertexAttributes.color.data, 
            gl.STATIC_DRAW); 

    var colorAttribLocation = gl.getAttribLocation(program, 
            'vertColor'); 

    gl.vertexAttribPointer(colorAttribLocation, 
        defaultVertexAttributes.color.numberOfComponents, gl.FLOAT, 
                gl.FALSE, 0, 0); 
    gl.enableVertexAttribArray(colorAttribLocation); 
}

const draw = (program) => {
    // Set program as part of the current rendering state 
    gl.useProgram(program); 
    // Draw the triangle 
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
const program = createProgram();
createVertexBuffers(program);
draw(program);