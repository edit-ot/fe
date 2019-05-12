const proxy = require('http-proxy-middleware');
const Bundler = require('parcel');
const express = require('express');

const PORT = 1234;
const SERVER_PORT = 5555;
const IO_PORT = 5556;

const bundler = new Bundler('src/index.html');
const app = express();

app.use('/api', proxy({
    target: `http://0.0.0.0:${ SERVER_PORT }`
}));

app.use('/default.png', proxy({
    target: `http://0.0.0.0:${ SERVER_PORT }`
}));

app.use('/user-avatar', proxy({
    target: `http://0.0.0.0:${ SERVER_PORT }`
}));

app.use('/user-files', proxy({
    target: `http://0.0.0.0:${ SERVER_PORT }`
}));

app.use('/socket.io', proxy({
    target: `ws://0.0.0.0:${ IO_PORT }`,
    ws: true
}));


// run
app.use(
    bundler.middleware()
);

app.listen(PORT);
