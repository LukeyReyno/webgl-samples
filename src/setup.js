const setup = (context) => {
    // Request html canvas element
    context.canvas = document.getElementById("canvas");

    // Create a WebGL rendering context
    context.gl = context.canvas.getContext("webgl2");

    // Tell user if their browser does not support WebGL
    if (!context.gl) {
        context.gl = context.canvas.getContext("webgl");
    }
    if (!context.gl) {
        console.log("Your browser does not support WebGL");
    }

    // Set the color of the canvas.
    // Parameters are RGB colors (red, green, blue, alpha)
    context.gl.clearColor(0, 0.6, 0.5, 1.0);
    // Clear the color buffer with specified color
    context.gl.clear(context.gl.COLOR_BUFFER_BIT);
}

export { setup };