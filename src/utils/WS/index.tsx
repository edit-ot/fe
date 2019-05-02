import IO from "socket.io-client";
import Quill from "quill";
import { Delta } from "edit-ot-quill-delta";
import { User } from "../../components/Login";
import md5 = require("md5");
import EventEmitter from "eventemitter3";
import JSONStringify from "fast-json-stable-stringify"

// @ts-ignore
window.Delta = Delta;
// const _Delta: Delta = Quill.import('delta');
// window.Delta = _Delta;

const TICK_INTERVAL = 1500;

const DEFAULT_URL = '/doc'

export class WS extends EventEmitter {
    socket: SocketIOClient.Socket;
    q: Quill;
    user: User;

    constructor(q: Quill, docId: number, user: User) {
        super();
        this.user = user;
        this.q = q;

        const socket = IO(DEFAULT_URL, {
            query: { docId },
            reconnection: false
        });
        this.socket = socket;
    }

    init() {
        const Parchment = Quill.import('parchment');
        this.q.on('editor-change', why => {
            try {
                if (why === 'silent') return;

                const selection = document.getSelection();
                const node = selection.getRangeAt(0).startContainer;
                const blot = Parchment.find(node);
                let block = blot;
                // find ancestor block blot
                while (block.statics.blotName !== 'block' && block.parent)
                    block = block.parent;
                const root = block.parent; // assume parent of block is root
                let cur;
                const next = root.children.iterator();
                let index = 0;
                while (cur = next()) {
                    index++;
                    if (cur === block) break;
                }

                if (why === 'selection-change' || why === 'text-change') {
                    this.cursorChnage(index);
                    this.emit('selection-change', index);
                }
            } catch (err) {
                // 嗯
                this.emit('selection-change', null);
            }
        });

        this.whenTextChange();
    }

    lastTimeLineCursor: number | null = null;

    cursorChnage = (idx: number) => {
        if (idx === this.lastTimeLineCursor) {
            return;
        } else {
            console.log('Change Line Send');
            this.socket.emit('change-line', {
                idx
            });
            this.lastTimeLineCursor = idx;
        }
    }


    whenTextChange() {
        // let counter = 0;
        let nowDocDelta = this.q.getContents();

        let addition = new Delta();

        // @ts-ignore
        window.addition = addition;

        // @ts-ignore
        window.nowDocDelta = nowDocDelta;

        this.q.on('text-change', (delta, oldDel, source) => {
            if (source === 'api') {
                console.log("An API call triggered this change.");
            } else if (source === 'user') {
                // @ts-ignore
                addition = addition.compose(delta);
                // @ts-ignore
                window.addition = addition;

                // console.group('Onchange');
                //  console.log('N', JSON.stringify(delta.ops));
                //  console.log('P', JSON.stringify(oldDel.ops))
                // console.groupEnd();
            }
        });

        let isAwait = false;
        let toSend: Delta;
        // 5 s
        const send = () => {
            if (addition.ops.length === 0 || isAwait) {
                return;
            }

            toSend = addition;
            addition = new Delta();
            
            isAwait = true;
            this.socket.emit('updateContents', {
                delta: toSend
            });
            // setTimeout(send, 3000);

            this.socket.once('finishUpdate', data => {
                console.info('finishUpdate', data);
                
                const remoteHash = data.contentHash as string;
                const nextDocDelta = nowDocDelta.compose(toSend);
                const localHash = md5(JSONStringify(nextDocDelta));

                if (remoteHash === localHash) {
                    isAwait = false;
                    nowDocDelta = nextDocDelta;
                } else {
                    if (md5(JSONStringify(nowDocDelta)) === remoteHash) {
                        console.info('finishUpdate: Hash Equal To nowDocDelta, Also OK');
                        isAwait = false;
                    } else {
                        console.error('finishUpdate: Local/Remote Hash Not Equal');
                        console.log(' - local ', localHash, JSONStringify(nextDocDelta));
                        console.log(' - remote', remoteHash);

                        console.log(' - nowDocDelta  ', JSONStringify(nowDocDelta));
                        console.log(' - tosendDelta  ', JSONStringify(toSend));
                        console.log(' - nextDocDelta ', JSONStringify(nextDocDelta));
                    }
                }
            });
        }

        setInterval(send, TICK_INTERVAL);

        this.socket.on('update', data => {
            console.group('update');
            const delta = new Delta(data.delta);
            const contentHash = data.contentHash as string;

            console.info('isAwait?', isAwait);

            // 要记住，isAwait 是一种特殊的状态
            const nextDocDelta = isAwait ?
                nowDocDelta.compose(toSend).compose(delta) :
                nowDocDelta.compose(delta);

            // const nextDocDelta = nowDocDelta.compose(delta);
            const localHash = md5(JSONStringify(nextDocDelta));

            if (localHash !== contentHash) {
                // isAwait = false;
                // 有锅哦
                // @Error !!!
                console.error('update: Local/Remote Hash Not Equal');
                console.log(' - local ', localHash);
                console.log(' - remote', contentHash);

                console.log(' - nowDocDelta  ', JSONStringify(nowDocDelta));
                console.log(' - updateDelta  ', JSONStringify(delta));
                console.log(' - nextDocDelta ', JSONStringify(nextDocDelta));
                
            } else {
                console.info('OK: Hash Check');
                nowDocDelta = nextDocDelta;
                this.q.updateContents(delta);
            }

            // if (isAwait) {
            //     const update = toSend.transform(delta, false);
            //     this.q.updateContents(update);
            // } else {
            //     this.q.updateContents(delta);
            //     this.socket.emit('update-ok');
            // }
            
            console.groupEnd();
        });
    }
}

// @ts-ignore
window.md5 = md5;