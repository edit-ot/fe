import Quill from "quill";
import { Delta } from "edit-ot-quill-delta";
import { User } from "../../components/Login";
import md5 = require("md5");
import EventEmitter from "eventemitter3";
import JSONStringify from "fast-json-stable-stringify"

const TICK_INTERVAL = 1500;

export class FEditor extends EventEmitter {
    socket: SocketIOClient.Socket;
    q: Quill;
    user: User;
    subDocId: string;

    lastTimeLineCursor: number | null = null;
    cursorChnage = (idx: number, why: string) => {
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

    constructor(q: Quill, user: User, subDocId: string, socket: SocketIOClient.Socket) {
        super();

        this.user = user;
        this.q = q;
        this.socket = socket;
        this.subDocId = subDocId;
    }

    init() {
        const Parchment = Quill.import('parchment');

        const setFormat = () => {
            const f = this.q.getFormat();
            if ((!f) || (f.author !== this.user.username)) {
                this.q.format('author', this.user.username, 'silent');
            }
        }

        this.q.on('selection-change', (range, oldRange, source) => {
            if (range && range.length === 0) {
                setFormat();
            }
        });

        this.q.on('text-change', why => {
            setFormat();
        });

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
                    this.cursorChnage(index, why);
                    this.emit('selection-change', index);
                }
            } catch (err) {
                // 嗯
                this.emit('selection-change', null);
            }
        });

        this.whenTextChange();
    }

    whenTextChange() {
        let nowDocDelta = this.q.getContents();
        let addition = new Delta();

        // window.addition = addition;
        // window.nowDocDelta = nowDocDelta;
        this.q.on('text-change', (delta, oldDel, source) => {
            if (source === 'api') {
                console.log("An API call triggered this change.");
            } else if (source === 'user') {
                // @ts-ignore
                addition = addition.compose(delta);
            }
        });

        let isAwait = false;
        this.emit('isAwait', isAwait);
        let toSend: Delta;
        // 5 s
        const send = () => {
            if (addition.ops.length === 0 || isAwait) {
                return;
            }

            toSend = addition;
            addition = new Delta();

            console.log('FEditor send', toSend);
            
            isAwait = true;
            this.emit('isAwait', isAwait);

            this.socket.emit('updateContents', {
                delta: toSend,
                subDocId: this.subDocId
            });
            // setTimeout(send, 3000);

            this.socket.once('finishUpdate', data => {
                console.info('finishUpdate', data);
                
                const remoteHash = data.contentHash as string;
                const nextDocDelta = nowDocDelta.compose(toSend);
                const localHash = md5(JSONStringify(nextDocDelta));

                if (remoteHash === localHash) {
                    isAwait = false;
                    this.emit('isAwait', isAwait);
                    nowDocDelta = nextDocDelta;
                } else {
                    if (md5(JSONStringify(nowDocDelta)) === remoteHash) {
                        console.info('finishUpdate: Hash Equal To nowDocDelta, Also OK');
                        isAwait = false;
                        this.emit('isAwait', isAwait);
                    } else {
                        console.error('finishUpdate: Local/Remote Hash Not Equal');
                        console.log(' - local ', localHash, JSONStringify(nextDocDelta));
                        console.log(' - remote', remoteHash);

                        console.log(' - nowDocDelta  ', JSONStringify(nowDocDelta));
                        console.log(' - tosendDelta  ', JSONStringify(toSend));
                        console.log(' - nextDocDelta ', JSONStringify(nextDocDelta));

                        this.emit('update-hash-error');
                    }
                }
            });
        }

        setInterval(send, TICK_INTERVAL);

        this.socket.on('update', data => {
            console.group('Update');

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
                console.error('update: Local/Remote Hash Not Equal');
                console.log(' - local ', localHash);
                console.log(' - remote', contentHash);

                console.log(' - nowDocDelta  ', JSONStringify(nowDocDelta));
                console.log(' - updateDelta  ', JSONStringify(delta));
                console.log(' - nextDocDelta ', JSONStringify(nextDocDelta));

                this.emit('update-hash-error');
            } else {
                console.info('OK: Hash Check');
                nowDocDelta = nextDocDelta;
                this.q.updateContents(delta);
            }

            console.groupEnd();
        });
    }

    destroy() {
        this.removeAllListeners();
        this.socket.removeEventListener('update');
        this.socket.removeEventListener('finishUpdate');
    }
}
