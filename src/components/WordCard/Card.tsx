import * as React from "react";
import { WCWS } from "./WCWS";
import Quill from "quill";

import "./card.less";
import { wordCardCtx, Word } from "./index";
import { Delta } from "edit-ot-quill-delta";
import { FEditor } from "../../utils/WS/FEditor";
import { loginCtx } from "../Login";

export function Card() {
    const _loginCtx = React.useContext(loginCtx);
    const _wordCardCtx = React.useContext(wordCardCtx);
    const [cardLoading, setCardLoading] = React.useState(false);
    const [isAwait, setIsAwait] = React.useState(false);

    const [info, setInfo] = React.useState(null as null | {
        word: Word,
        now: Delta,
        nowHash: string
    });

    React.useEffect(() => {
        const onChooseWord = (w: Word) => {
            _wordCardCtx.wcws.socket.emit('chooseWord', w.id);
            setCardLoading(true);
        }

        _wordCardCtx.wcws.on('chooseWord', onChooseWord);

        return () => _wordCardCtx.wcws.removeListener(
            'chooseWord', onChooseWord);
    }, []);

    React.useEffect(() => {
        _wordCardCtx.wcws.socket.on('setNowEditWord', data => {
            const word = data.word as Word;
            const now = data.now as Delta;
            const nowHash = data.nowHash as string;

            setCardLoading(false);
            setInfo({
                word, now, nowHash
            });
        });

        return () => _wordCardCtx.wcws.socket.removeEventListener('setNowEditWord');
    }, []);

    React.useEffect(() => {
        if (!info) return;

        const q = new Quill('#word-card', {
            modules: {
                toolbar: { container: `#card-toolbar` }
            },
            theme: 'snow'  // or 'bubble'
        });

        q.setContents(info.now);

        const fe = new FEditor(
            q,
            _loginCtx.user,
            info.word.id,
            _wordCardCtx.wcws.socket
        );

        fe.init();

        fe.on('isAwait', setIsAwait);
        
        return () => {
            fe.destroy();
        }
    }, [ info ]);

    const editor = (
        <div>
            <div id="card-toolbar">
                {
                    React.createElement('select', {
                        className: 'ql-size',
                    }, [
                        <option value="small" key="qls-small" />,
                        React.createElement('option', {
                            selected: true, 
                            key: 'ooooooooooooooops-option'
                        }),
                        <option value="large" key="qls-large"></option>,
                        <option value="huge" key="qls-huge"></option>
                    ])
                }
                <button className="ql-bold"></button>
                <button className="ql-italic"></button>
                <button className="ql-underline"></button>

                <span className="ql-formats">
                    <button className="ql-align" value=""></button>
                    <button className="ql-align" value="center"></button>
                    <button className="ql-align" value="right"></button>
                </span>

                <button className="ql-link"></button>
                <button className="ql-image"></button>
            </div>
                            
            <div id="word-card" />


            { isAwait ? (
                <div>同步中</div>
            ) : (
                <div>同步完成</div>
            ) }
        </div>
    )

    return (
        <div className="card-main">
            {/* <div>{ JSON.stringify(info) }</div> */}
            {
                cardLoading ? (
                    <div>加载中 ...</div>
                ) : (
                    info ? 
                        editor :
                        <div>请选择</div>
                )
            }
        </div>
    )
}