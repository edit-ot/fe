import * as React from "react";

import "./edit-comments.less";
import Quill from "quill";
import { WS } from "../../utils/WS";
import { User, loginCtx } from "../../components/Login";
import { DocInfo } from "../Home/Doc/doc-api";

export type UserComment = {
    user: User,
    text: string,
    createAt: number
}

export type DocComment = {
    line: number,
    comments: UserComment[]
}

export type TypeCommentProps = {
    onInput?: (text: string) => void
}

export function TypeComment(props: TypeCommentProps) {
    const $input = React.createRef<HTMLInputElement>();

    return (
        <form className="type-comment" onSubmit={e => {
            e.preventDefault();
            e.persist();
            const str = $input.current.value;
            $input.current.value = '';
            props.onInput && props.onInput(str);
        }}>
            <input ref={ $input } placeholder="点击此处输入，按 enter 提交" />
        </form>
    )
}


export function LineComment(uc: UserComment) {
    return (
        <div className="user-comment">
            <div className="_avatar"><img src={ uc.user.avatar } /></div>
            <div className="_text">
                <div className="_username">{ uc.user.username }</div>
                <div className="_text">{ uc.text }</div>
            </div>
        </div>
    )
}

function getLineTop(q: Quill, line = 0) {
    try {
        // @ts-ignore
        const fatherRect = q.container.getBoundingClientRect() as DOMRect | ClientRect;
        const l = q.getLines()[line - 1];
        const lineRect = l.domNode.getBoundingClientRect() as DOMRect | ClientRect;

        const top = Math.abs(lineRect.top - fatherRect.top);
        // console.group('getLineTop');
        //  console.log('getLineTop:', line, top);
        //  console.log('fatherRect:', fatherRect);
        //  console.log('lineRect  :', lineRect);
        // console.groupEnd();
        return top;
    } catch (err) {
        console.log('Line Top Error', err);
        return 0;
    }
}

export type LineCommentsProps = {
    docc: DocComment, 
    q: Quill,
    onInput: (str: string) => void
}


export function LineComments(props: LineCommentsProps) {
    return <editCommentsCtx.Consumer>{ ctx =>
        <div className="line-comments-main">
            { props.docc.comments.length !== 0 ?  
                <div className="click-to-close" onClick={() => {
                    ctx.removeDocComments(props.docc.line);
                }}>点击此处结束此次讨论</div> : null
            }
            {
                props.docc.comments.map((c, idx) => (
                    <LineComment {...c} key={ idx } />
                ))
            }
            <TypeComment onInput={ props.onInput } />
        </div>
    }</editCommentsCtx.Consumer>
}

export type EditCommentsCtx = {
    docComments: DocComment[],
    setDocComments: (doccs: DocComment[]) => void,
    removeDocComments: (line: number) => void,
    addCommentFor: (line: number, comment: UserComment) => void,
    q: Quill, 
    ws: WS
}

export const editCommentsCtx = React.createContext(null as EditCommentsCtx);

export type EditCommentsCtxProviderProps = React.PropsWithChildren<{
    q: Quill, ws: WS,
    docId: number
}>

export function EditCommentsCtxProvider(props: EditCommentsCtxProviderProps) {
    const [docComments, setDocComments] = React.useState([] as DocComment[]);

    const { q, ws, docId } = props;
    const _loginCtx = React.useContext(loginCtx);

    const addCommentFor = (line: number, comment: UserComment, isActive = true) => {
        const idx = docComments.findIndex(d => d.line === line);
        const docc = docComments[idx];
        
        if (docc) {
            docc.comments.push(comment);
        } else {
            docComments.push({
                line, comments: [comment]
            });
        }
        
        if (isActive) {
            console.log('isActive: add-user-comment', { line, comment });
            ws.socket.emit('add-user-comment', {
                line, comment
            });
        }

        // Force Update
        setDocComments(docComments.slice().filter(e => e.comments.length));
    }

    const removeDocComments = (line: number, isActive = true) => {
        const idx = docComments.findIndex(d => d.line === line);
        if (idx === -1) return console.log('removeDocComments not found', line);
        const nextDoccs = docComments.slice();
        nextDoccs.splice(idx, 1);
        setDocComments(nextDoccs.filter(d => d.comments.length));

        console.log('removeDocComments', line, JSON.stringify(nextDoccs.filter(d => d.comments.length)));

        if (isActive) {
            ws.socket.emit('remove-doc-comments', line);
        }
    }

    React.useEffect(() => {
        console.log('Re/Init Get Doccoments');
        ws.socket.emit('get-docComments', docId);
        ws.socket.once('reveive-docComments', dccs => setDocComments(dccs));       
    }, []);

    React.useEffect(() => {
        ws.socket.on('add-user-comment', data => {
            console.log('on add-user-comment', data);
            const comment = data.comment as UserComment;
            const line = data.line as number;
            if (comment.user.username === _loginCtx.user.username) return;

            addCommentFor(line, comment, false);
        });

        return () => ws.socket.off('add-user-comment');
    }, [ docComments ])

    React.useEffect(() => {
        const addComment = idx => {
            // console.log('docComments.length', docComments.length);
            setDocComments(docComments.slice().concat({
                line: idx,
                comments: []
            }));
        }

        ws.on('add-comment', addComment);

        return () => ws.off('add-comment', addComment);
    }, [ docComments ]);

    React.useEffect(() => {
        ws.socket.on('remove-doc-comments', line => {
            removeDocComments(line, false);
        });

        return () => ws.socket.off('remove-doc-comments');
    }, [ docComments ]);
    
    return (
        <editCommentsCtx.Provider value={{
            q,
            ws,
            docComments,
            setDocComments, 
            addCommentFor,
            removeDocComments
        }}>{ props.children }</editCommentsCtx.Provider>
    )
}

export type EditCommentsProps = {
    q: Quill, 
    ws: WS,
    doc: DocInfo
}

export function EditComments(props: EditCommentsProps) {
    const [nowShowLine, setNowShowLine] = React.useState(null as null | number);
    const _loginCtx = React.useContext(loginCtx);
    const { q, ws, doc } = props;

    React.useEffect(() => {
        const outterClk = () => setNowShowLine(null);
        const addComment = idx => setNowShowLine(idx);

        window.addEventListener('click', outterClk);
        ws.on('add-comment', addComment);

        return () => {
            window.removeEventListener('click', outterClk);
            ws.off('add-comment', addComment);
        }
    }, []);

    return (
        <EditCommentsCtxProvider q={ q } ws={ ws } docId={ doc.id }>
            <div className="edit-comments-main" onClick={e => {
                // e.preventDefault();
                e.stopPropagation();
            }}>
                <editCommentsCtx.Consumer>{ ctx => (
                    ctx && ctx.docComments.map((docc, idx) => {
                        return (
                            <div key={ idx }
                                className="edit-comment-one">
                                
                                <div className="_posi" style={{ top: getLineTop(q, docc.line) }}>
                                    {nowShowLine === docc.line ? (
                                        <LineComments docc={ docc } q={ q } onInput={text => {
                                            ctx.addCommentFor(docc.line, {
                                                user: _loginCtx.user,
                                                text, 
                                                createAt: Date.now()
                                            });
                                        }} /> 
                                    ) : (
                                        docc.comments.length ? (
                                            <div className="_smaller" onClick={ e => {
                                                setNowShowLine(docc.line);
                                            }}>
                                                此处有 { docc.comments.length } 条讨论, 点击展开
                                            </div>
                                        ) : null                                        
                                    )}
                                </div>
                                
                            </div>
                        )
                    })
                )}</editCommentsCtx.Consumer>
            </div>
        </EditCommentsCtxProvider>
    );
}
