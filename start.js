const proxy = require('http-proxy-middleware');
const Bundler = require('parcel');
const express = require('express');

const PORT = 1234;
const SERVER_PORT = 5555;

let bundler = new Bundler('src/index.html');
let app = express();

app.use(
    '/api',
    proxy({
        target: `http://0.0.0.0:${ SERVER_PORT }`
    })
);

// run
app.use(
    bundler.middleware()
);

app.listen(PORT);
