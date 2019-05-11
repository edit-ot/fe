import SocketIOClient from "socket.io-client";
import EventEmitter from "wolfy87-eventemitter";

// @ts-ignore
window.SocketIOClient = SocketIOClient;

class MsgConnect extends EventEmitter {
    socket: SocketIOClient.Socket;
    
    constructor() {
        super();

        this.socket = SocketIOClient('/site-msg', {
            transports: ['websocket']
        });
    }

    unmount() {
        this.socket.removeAllListeners();
        this.socket.close();
    }
}

export const msgConnect = new MsgConnect();

// @ts-ignore
window.msgConnect = msgConnect;
