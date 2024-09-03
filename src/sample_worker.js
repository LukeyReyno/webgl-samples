self.onmessage = function(event) {
    const { width, height, time } = event.data;
    const terrainData = new Float32Array(width * height);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Example terrain generation using sine wave functions
            terrainData[x + y * width] = Math.sin(time * x * 0.1) * Math.cos(time * y * 0.1) * 0.5;
        }
    }

    // Send the generated terrain data back to the main thread
    self.postMessage(terrainData);
};
