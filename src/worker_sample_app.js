import {setup} from './setup.js'

const context = {};
setup(context);

const { gl, canvas } = context;

const vertexShaderSource = `
attribute vec3 a_position;
attribute float a_height;
varying float v_height;

void main() {
    vec3 pos = a_position;
    pos.z = a_height; // Use height as z-coordinate
    gl_Position = vec4(pos.xy, pos.z, 1.0);
    v_height = a_height;
}`;

const fragmentShaderSource = `
precision mediump float;
varying float v_height;

void main() {
    gl_FragColor = vec4(v_height, v_height, v_height, 1);
}`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile failed:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program failed to link:', gl.getProgramInfoLog(program));
}

gl.useProgram(program);

const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const heightAttributeLocation = gl.getAttribLocation(program, "a_height");

const width = 256;
const height = 256;
const gridSize = width * height;

const positions = new Float32Array(gridSize * 3);
const heights = new Float32Array(gridSize); // Separate array for heights
const indices = new Uint16Array((width - 1) * (height - 1) * 6);

// Create a grid of vertices
let index = 0;
for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        positions[index * 3] = (x / (width - 1)) * 2 - 1; // X
        positions[index * 3 + 1] = (y / (height - 1)) * 2 - 1; // Y
        positions[index * 3 + 2] = 0; // Z will be set by height data
        index++;
    }
}

// Create index buffer for rendering triangles
let idx = 0;
for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
        let topLeft = y * width + x;
        let topRight = topLeft + 1;
        let bottomLeft = (y + 1) * width + x;
        let bottomRight = bottomLeft + 1;

        indices[idx++] = topLeft;
        indices[idx++] = bottomLeft;
        indices[idx++] = topRight;
        indices[idx++] = topRight;
        indices[idx++] = bottomLeft;
        indices[idx++] = bottomRight;
    }
}

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

// Use a Web Worker to generate the height data
const worker = new Worker('../src/sample_worker.js');

// Animation loop
function animate(time) {
    // Send the current time to the worker to generate dynamic terrain
    worker.postMessage({ width, height, time: time * 0.001 });

    worker.onmessage = function(event) {
        const terrainData = event.data;

        // Copy terrain data to the heights array
        heights.set(terrainData);

        // Create and bind the height buffer
        const heightBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, heightBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, heights, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(heightAttributeLocation);
        gl.vertexAttribPointer(heightAttributeLocation, 1, gl.FLOAT, false, 0, 0);

        // Bind the index buffer again before drawing
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // Draw the terrain
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    };

    requestAnimationFrame(animate);
}

animate(0);
