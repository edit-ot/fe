import * as React from "react";
import { Delta, Operation } from "edit-ot-quill-delta";
import "./input-area.less";
import { wait } from "../../utils/wait";
import EventEmitter from "wolfy87-eventemitter";
import { op2str } from "../../utils/op-str";

export type InputAreaProps = {
    label: string,
    initText?: string,
    bus: EventEmitter
}

export function getDiff(origin: string, now: string) {
    const a = new Delta().insert(origin);
    const b = new Delta().insert(now);

    const diff = a.diff(b);
    
    return diff.ops;
}

export function InputArea(props: InputAreaProps) {
    const { bus, label } = props;
    const [ origin, setOrigin ] = React.useState(props.initText);
    const [ diff, setDiff ] = React.useState([] as Operation[]);
    const $textRef = React.createRef<HTMLTextAreaElement>();

    React.useEffect(() => {
        $textRef.current.value = origin;
    }, []);
    
    React.useEffect(() => {
        console.log('diff change', label) ;
        const $ = document.getElementById(`textarea-${ label }`) as HTMLTextAreaElement;

        bus.on(`other-user-commit-${ label }`, (info: { from: string, delta: Delta }) => {
            const { from, delta } = info;
            if (from !== label) {
                console.log(label, 'diff', diff, 'delta', delta);
                const deltaDiff = new Delta(diff);
                const i_need_to_do = deltaDiff.transform(delta, false);

                const result = i_need_to_do.apply($.value);
                console.log('!!!');
                
                console.log('result:', result);
                $.value = result;
                setDiff(i_need_to_do.ops);

                
                // result, origin
                // setOrigin(result);
                const newOrigin = delta.apply(origin);
                setDiff(getDiff(newOrigin, result));
                setOrigin(newOrigin);
            }
        });

        return () => bus.removeEvent(`other-user-commit-${ label }`);
    }, [ diff ]);

    const onChange = async () => {
        const $ = $textRef.current;
        await wait();
        setDiff(getDiff(origin, $.value));
    }

    const onClk = () => {
        const deltaDiff = new Delta(diff);
        const r = deltaDiff.apply(origin);

        bus.emit('user-commit', { diff, label });
        
        setOrigin(r);
        setDiff([]);
    }

    React.useEffect(() => {
        const r = ~~(1000 * Math.random()) + 1000;

        console.log(label, r, diff);
        const time = setTimeout(() => {
            diff.length && onClk();
        }, r);

        return () => clearTimeout(time);
    });
    
    return (
        <div className="input-area-container">
            <div className="header">
                <div className="label">{ label }</div>
                <button className="confirm" onClick={ onClk }>提交</button>
            </div>
            <div className="content">
                <textarea className="text-area"
                    onChange={ onChange } id={`textarea-${ label }`}
                    ref={ $textRef }/>
            </div>
            <div style={{ marginBottom: '1em' }}> { origin }</div>

            <div>
                {
                    diff.map(op2str).map((word, idx) => {
                        return <div key={ idx }>{ word }</div>
                    })
                }
            </div>
        </div>
    );
}
