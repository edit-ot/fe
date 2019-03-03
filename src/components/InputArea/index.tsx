import * as React from "react";
import { Delta, Operation } from "edit-ot-quill-delta";
import "./input-area.less";
import { wait } from "../../utils/wait";

export type InputAreaProps = {
    label: string,
    initText?: string
}

export function InputArea(props: InputAreaProps) {
    const [ origin, setOrigin ] = React.useState(props.initText);
    const [ diff, setDiff ] = React.useState([] as Operation[]);
    const $textRef = React.createRef<HTMLTextAreaElement>();

    React.useEffect(() => {
        $textRef.current.value = origin;
    }, []);

    const onChange = async e => {
        const $e = e.nativeEvent;
        const $ = $textRef.current;

        await wait();

        const a = new Delta().insert(origin);
        const b = new Delta().insert($.value);

        const diff = a.diff(b);
        setDiff(diff.ops);
        // console.log($e.inputType, $.selectionStart, $e.data);
        // console.log($textRef.current.value);
    }

    const onClk = () => {
        console.log('diff', diff);
        const deltaDiff = new Delta(diff);

        const r = deltaDiff.apply(origin);
        setOrigin(r);
    }

    return (
        <div className="input-area-container">
            <div className="header">
                <div className="label">{ props.label }</div>
                <button className="confirm" onClick={ onClk }>提交</button>
            </div>
            <div className="content">
                <textarea className="text-area"
                    onChange={ onChange }
                    ref={ $textRef }/>
            </div>
            <div style={{ marginBottom: '1em' }}> { origin }</div>

            <div>
                {
                    diff.map(op => {
                        if (op.retain) return `retain(${ op.retain })`;
                        if (op.delete) return `delete(${ op.delete })`;
                        if (op.insert) return `insert(${ JSON.stringify(op.insert) })`;
                    }).map((word, idx) => {
                        return <div key={ idx }>{ word }</div>
                    })
                }
            </div>
        </div>
    );
}
