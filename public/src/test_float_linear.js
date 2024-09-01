function getFloatLinearExtension(gl) {
    // Check for OES_texture_float_linear extension
    const ext = gl.getExtension('OES_texture_float_linear');
    if (!ext) {
        console.warn('OES_texture_float_linear is not supported in this browser');
        alert('OES_texture_float_linear is not supported in this browser');
    }

    return ext;
}

// Vertex Shader
const vsSource = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;
    void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

// Fragment Shader
const fsSource = `
    precision mediump float;
    varying vec2 v_texCoord;
    uniform sampler2D u_texture;
    void main() {
        gl_FragColor = texture2D(u_texture, v_texCoord);
    }
`;

// Shader Compilation Utility
function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Link Shaders to Create Program
function createProgram(gl, vsSource, fsSource) {
    const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

function runFloatLinearTest(gl, canvas) {
    const ext = getFloatLinearExtension(gl);

    // Initialize the shaders and program
    const program = createProgram(gl, vsSource, fsSource);
    gl.useProgram(program);

    // Set up a quad covering the entire screen
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
        -1.0, -1.0,
        1.0, -1.0,
        -1.0,  1.0,
        1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Create a floating-point texture with a gradient
    const floatTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, floatTexture);
    const width = 2;
    const height = 2;
    const data = new Float32Array([
        1.0, 0.0, 0.0, 1.0, // Red
        0.0, 1.0, 0.0, 1.0, // Green
        0.0, 0.0, 1.0, 1.0, // Blue
        1.0, 1.0, 0.0, 1.0  // Yellow
    ]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, width, height, 0, gl.RGBA, gl.FLOAT, data);

    // Set the texture parameters based on the availability of the extension
    if (ext) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        console.log("gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR) - Error:", gl.getError());
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        console.log("gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR) - Error:", gl.getError());
    } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }

    // Draw the texture on the left side of the canvas
    gl.viewport(0, 0, canvas.width / 2, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Create another texture without linear filtering (NEAREST)
    const nearestTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, nearestTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, width, height, 0, gl.RGBA, gl.FLOAT, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Draw the nearest filtered texture on the right side of the canvas
    gl.viewport(canvas.width / 2, 0, canvas.width / 2, canvas.height);
    gl.bindTexture(gl.TEXTURE_2D, nearestTexture);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

export { runFloatLinearTest };