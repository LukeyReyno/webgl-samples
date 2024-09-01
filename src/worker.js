const Worker = require('web-worker');

const worker = new Worker('data:,postMessage("hello")');
worker.onmessage = e => {
    console.log(e);
    console.log(e.data);  // "hello"
    worker.terminate();
}

console.log(worker);