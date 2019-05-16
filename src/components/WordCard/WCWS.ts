import IO from "socket.io-client";
import { Group } from "../../Pages/Home/homeaside-api";
import EventEmitter from "wolfy87-eventemitter";

export class WCWS extends EventEmitter  {
    g: Group;
    socket: SocketIOClient.Socket;
    use: string;
    path: string;

    constructor(g: Group, path: string, use: string) {
        super();
        this.g = g;
        this.use = use;
        this.path = path;

        console.log('new WCWS:', this);
    }

    init() {
        this.socket = IO('/card', {
            query: {
                groupId: this.g.groupId,
                use: this.use
            },
            transports: ['websocket']
        });
    }
}
