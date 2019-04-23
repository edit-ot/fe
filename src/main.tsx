import * as React from "react";
import * as ReactDOM from "react-dom";
// import io from "socket.io-client";
import { App } from "./App";

// const socket = io('http://localhost:1234');

// socket.on('error', err => console.log('err', err));

// socket.on('connect_error', err => {
//     console.log('connect_error', err);
// });

// socket.on('connection', () => {
//     console.log("connected");
// });

// socket.on('!', console.log);

// // @ts-ignore
// window.io = io;
// // @ts-ignore
// window.socket = socket;

ReactDOM.render(
    <App />, 
    document.getElementById('app')
);
