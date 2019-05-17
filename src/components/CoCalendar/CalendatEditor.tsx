import * as React from "react";
import { dayListCtx, getKey } from "./DayList";
import { FEditor } from "../../utils/WS/FEditor";
import { Word } from "../WordCard";
import { Delta } from "edit-ot-quill-delta";
import Quill from "quill";
import { loginCtx } from "../Login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagic } from "@fortawesome/free-solid-svg-icons";

const ToolbarId = 'calendar-bar';
const EditorId = 'calendar-editor';

export function CalendarEditor() {
    const dayList$ = React.useContext(dayListCtx);
    const { wordCardCtx } = dayList$;

    const nowDateKey = getKey(dayList$.nowDate);
    const targetDate = wordCardCtx.wordMap[nowDateKey];

    React.useEffect(() => {
        if (targetDate) {
            wordCardCtx.wcws.emit('chooseWord', targetDate);
        }
    }, [
        dayList$.nowDate,
        wordCardCtx.wordMap
    ]);

    return (
        <div>
            {
                targetDate ? (
                    <CalendarEditorInner />
                ) : (
                    <div className="please-chooose">
                        <div>
                            <div className="_icon">
                                <FontAwesomeIcon icon={ faMagic } />
                            </div>
                            <div className="_text">今日暂无记录</div>
                            <div className="_text _add"
                                onClick={e => {
                                    e.stopPropagation();

                                    wordCardCtx.addWord(nowDateKey);
                                    console.log('add Date', nowDateKey);
                                }}>点击添加</div>
                        </div>
                    </div>
                )
            }
            
        </div>
    )
}


export function CalendarEditorInner() {
    const _loginCtx = React.useContext(loginCtx);
    const dayList$ = React.useContext(dayListCtx);
    const wordCardCtx = dayList$.wordCardCtx;
    const [calendarLoading, setCalendarLoading] = React.useState(false);
    const [isAwait, setIsAwait] = React.useState(false);

    const [info, setInfo] = React.useState(null as null | {
        word: Word,
        now: Delta,
        nowHash: string
    });
   

    React.useEffect(() => {
        const onChooseWord = (w: Word) => {
            wordCardCtx.wcws.socket.emit('chooseWord', w.id);
            setCalendarLoading(true);
        }

        wordCardCtx.wcws.on('chooseWord', onChooseWord);

        return () => wordCardCtx.wcws.removeListener(
            'chooseWord', onChooseWord);
    }, []);

    React.useEffect(() => {
        wordCardCtx.wcws.socket.on('setNowEditWord', data => {
            const word = data.word as Word;
            const now = data.now as Delta;
            const nowHash = data.nowHash as string;

            setCalendarLoading(false);
            setInfo({
                word, now, nowHash
            });
        });

        return () => wordCardCtx.wcws.socket.removeEventListener('setNowEditWord');
    }, []);

    React.useEffect(() => {
        if (!info) return;

        const q = new Quill('#calendar-quill', {
            modules: {
                toolbar: { container: '#calendar-toolbar' }
            },
            theme: 'snow'  // or 'bubble'
        });

        q.setContents(info.now);

        const fe = new FEditor(
            q,
            _loginCtx.user,
            info.word.id,
            wordCardCtx.wcws.socket
        );

        fe.init();

        fe.on('isAwait', setIsAwait);
        
        return () => {
            fe.destroy();
        }
    }, [ info ]);

    return (
        <div className="calendar-editor">
            {
                calendarLoading ? (
                    <div>加载中</div>
                ) : (
                    <BaseEditor isAwait={ false } />
                )
            }
        </div>
    )
}

function BaseEditor(props: {
    isAwait: boolean
}) {
    return (
        <div>
            <div id="calendar-toolbar">
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
                            
            <div id="calendar-quill" />


            { props.isAwait ? (
                <div className="editor-info">同步中</div>
            ) : (
                <div className="editor-info">同步完成</div>
            ) }
        </div>
    )
}
