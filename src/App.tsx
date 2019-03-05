import * as React from "react";
import { InputArea } from "./components/InputArea";
import EventEmitter from "wolfy87-eventemitter";
import { Operation } from "edit-ot-quill-delta";
import { op2str } from "./utils/op-str";
import { Delta } from "edit-ot-quill-delta";

const bus = new EventEmitter();

export type UserCommit = {
    diff: Operation[],
    label: string
}

export function App() {
    const [origin, setOrigin] = React.useState('hello, world');

    const [userCommits, setUserCommits] = React.useState(
        [] as UserCommit[]
    );

    React.useEffect(() => {
        bus.removeAllListeners('user-commit');
        bus.on('user-commit', (uc: UserCommit) => {
            console.log('user-committed', uc);
            setUserCommits(userCommits.concat(uc));
        });
    }, [ userCommits ]);

    const users = ['userA', 'userB'];
    const onClk = () => {
        if (userCommits.length === 0) {
            return;
        } else {
            // const user = {};
            // const first = userCommits[0];
            // user[first.label] = 1;

            // const all = userCommits.slice(1).reduce((acc, cur) => {
            //     user[cur.label] = 1;
            //     return acc.compose( new Delta(cur.diff) );
            // }, new Delta(first.diff));

            // try {
            //     all.apply(origin);
            // } catch (err) {

            // }
            // console.log(all, );

            const uc = userCommits[0];
            const delta = new Delta(uc.diff);
            setOrigin(delta.apply(origin));
            setUserCommits(userCommits.slice(1));

            users.forEach(label => {
                bus.emit(`other-user-commit-${ label }`, {
                    from: uc.label, delta
                });
            });
        }
    }

    React.useEffect(() => {
        onClk();
    }, [ userCommits ]);

    return (
        <div>
            <div className="server-status">
                <div>Server Status
                    <button onClick={ onClk }>处理</button>
                </div>
                <div>{ origin }</div>

                <div>{
                    userCommits.map((uc, idx) => {
                        const { label, diff } = uc;

                        return (
                            <div key={ idx }>
                                { label }: { diff.map(op2str).join('; ') }
                            </div>
                        )
                    })
                }</div>
            </div>
            
            <div className="all-user-area">
                {
                    users.map((label, idx) => (
                        <InputArea key={ idx }
                            label={ label }
                            initText={ origin }
                            bus={ bus } />
                    ))
                }
            </div>
        </div>
    );
}