// Define shaders: vertex shader and fragment shader 
const shaders = { 
	vs: `#version 300 es 
		in vec2 vertPosition; 
		in vec3 vertColor; 
		out vec3 fragColor; 
	
		void main() { 
			fragColor = vertColor; 
			gl_Position = vec4(vertPosition, 0, 1); 
		}`, 

	fs: `#version 300 es 
		precision mediump float; 
		in vec3 fragColor; 
		out vec4 outColor; 
	
		void main() { 
			outColor = vec4(fragColor, 1); 
		}` 
};

const vertexAttributes = { 
	position: { 
		numberOfComponents: 2, // X and Y ordered pair coordinates 
		data: new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]) 
	}, 
	color: { 
		numberOfComponents: 3, // RGB triple 
		data: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]) 
	} 
};

export {shaders as defaultShaders, vertexAttributes as defaultVertexAttributes};