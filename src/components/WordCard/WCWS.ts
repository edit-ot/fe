import IO from "socket.io-client";
import { Group } from "../../Pages/Home/homeaside-api";
import EventEmitter from "wolfy87-eventemitter";

export class WCWS extends EventEmitter  {
    g: Group;
    socket: SocketIOClient.Socket;

    constructor(g: Group) {
        super();
        this.g = g;
    }

    init() {
        this.socket = IO('/card', {
            query: {
                groupId: this.g.groupId
            },
            transports: ['websocket']
        });
    }
}
