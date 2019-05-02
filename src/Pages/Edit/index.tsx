import * as React from "react";
import Quill from "quill";
import { RouteComponentProps } from "react-router";

import "quill/dist/quill.snow.css";
import "./edit.less";
import { getDocById, docSave } from "./edit-api";
import { DocInfo } from "../Home/Doc/doc-api";
import { NavHeader } from "../../components/NavHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faCarCrash, faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "../../utils";
import { loginCtx, User } from "../../components/Login";
import { WS } from "../../utils/WS";
import { HoverInfo } from "../../components/HoverHandler";
import { EditComments, editCommentsCtx } from "./EditComments";
import { editHeaderCtx, EditHedaerProvider, EditHeader } from "./EditHeader";
// import { Delta } from "edit-ot-quill-delta";


export type EditPageProps = RouteComponentProps<{
	docId: string
}>


export type EditPanelProps = {
    doc: DocInfo,
    user: User
}

export function EditPanel({ doc, user }: EditPanelProps) {
    const [msg, showMsg] = React.useState('');
    const [q, setQ] = React.useState(null as null | Quill);
    const [ws, setWS] = React.useState(null as null | WS);
    const $input = React.useRef<HTMLInputElement>();
    const [loginedUsers, setLoginedUsers] = React.useState([] as User[]);
    const [commentBtnPosition, setCommentBtnPosition] = React.useState(null as number | null);
    const [line, setLine] = React.useState(null as null | number);

    const _editHeaderCtx = React.useContext(editHeaderCtx);
    // const _editCommentsCtx = React.useContext(editCommentsCtx);

    React.useEffect(() => {
        const toolbarOptions = [
            [{ container: 'my-toolbar' }],
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block'],
            ['save']
        ];

        // @ts-ignore
        toolbarOptions.container = '#my-toolbar';

        const q = new Quill('#my-text-area', {
            modules: {
                toolbar: `#my-toolbar`,
                // toolbar: [
                //     [{ container: '#my-toolbar' }],
                //     [{ header: [1, 2, false] }],
                //     ['bold', 'italic', 'underline'],
                //     ['image', 'code-block'],
                //     ['save']
                // ],
            },
            theme: 'snow'  // or 'bubble'
        });

        const ws = new WS(q, doc.id, user);
        // @ts-ignore
        window.ws = ws;

        ws.socket.on('i-logined', data => {
            // data.userInfo 是自己的信息, users 是目前在该文档下的用户
            console.log('i-logined', data);
            const user: User = data.userInfo;
            const users: User[] = data.users;

            _editHeaderCtx.pushMsg(`登录成功, 欢迎 ${user.username}, 目前有 ${ users.length } 人在编辑本文档`);
            _editHeaderCtx.setLoginedList(users);

            if (data.doc) {
                // if (doc && doc.content) {
                    if (data.doc.now) {
                        console.log(data.doc.now, doc.content);
                        q.setContents(data.doc.now, 'silent');
                    }
                    $input.current.value = doc.title;
                // }
            }

            setTimeout(() => {
                ws.init();
            }, 50);

            setLoginedUsers(users);
        });

        _editHeaderCtx.bus.on('say-hello', () => {
            ws.socket.emit('say-hello', user);
        });

        ws.socket.on('say-hello', (theUser: User) => {
            _editHeaderCtx.bus.emit('receive-hello', theUser);
        });

        ws.socket.on('owner-change-title', (newTitle: string) => {
            if (doc.owner === user.username) return;
            console.log('newTitle', newTitle);
            if ($input && $input.current) $input.current.value = newTitle;
        });

        // q.setContents(JSON.parse(doc.content), 'silent');

        ws.socket.on('others-joined', (others: User) => {
            // 排除自己 
            if (others.username === user.username) return;

            console.log('others-joined', user);
            const lu = loginedUsers.concat(user);
            setLoginedUsers(lu);
        });

        ws.on('selection-change', (line: number | null) => {
            if (line) {
                setLine(line);
                const s = q.getSelection();
                if (s) {
                    const b = q.getBounds(s.index);
                    const targetPosition = ~~((b.top + b.bottom) / 2);

                    setCommentBtnPosition(targetPosition);
                } else {
                    setTimeout(() => setCommentBtnPosition(null), 50);
                }
            } else {
                setTimeout(() => setLine(null), 50);
                setTimeout(() => setCommentBtnPosition(null), 50);
            }
        });

        setQ(q);
        setWS(ws);

        // @ts-ignore
        window.q = q;

        return () => {
            ws.socket.close();
            ws.removeAllListeners();
        }
    }, []);

    const saveAll = () => {
        if (!q) return;

        const delta = q.getContents();
        const deltaStr = JSON.stringify(delta);
        
        showMsg('保存中 ...');

        docSave({
            id: doc.id, 
            content: deltaStr
        }).then(ok => {
            showMsg('保存成功');
        })
    }

    const onTitleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        showMsg('修改标题中...');

        if (!$input.current.value) {
            showMsg('标题不能为空！');
            return;
        }

        ws.socket.emit('change-title', {
            docId: doc.id, 
            title: $input.current.value
        });

        docSave({
            id: doc.id,
            title: $input.current.value
        }).then(ok => {
            showMsg('修改标题成功');
        });
    })

    return (
        <div className="edit-main">
            <div className="edit-main-inner">
                <div id="my-toolbar">
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
                    <button className="ql-link"></button>
                    <button className="ql-image"></button>

                    {/* <button className="ql-script" value="sub"></button> */}
                    {/* <button className="ql-script" value="super"></button> */}
                </div>
                
                { doc ? (
                    <div className="title-edit">
                        { doc.owner === user.username ? 
                            (
                                <input ref={ $input } type="text" defaultValue={ doc.title }
                                    onChange={ onTitleChange } />
                            ) : (
                                <HoverInfo info="只有文档所有者才能修改标题">
                                    <input ref={ $input } className="_disable"
                                        type="text" defaultValue={ doc.title }
                                        disabled={ true } />
                                </HoverInfo>
                            )
                        }
                        
                    </div>
                ) : (
                    <div className="title-edit loading">加载中...</div>
                ) }

                <div className="editor-comment">{
                    commentBtnPosition && (
                        <span className="_comment-btn"
                            style={{
                                top: commentBtnPosition
                            }}
                            onClick={ e => {
                                e.stopPropagation();
                                e.preventDefault();
                                ws.emit('add-comment', line);
                            } }>
                            <FontAwesomeIcon icon={ faCommentAlt } />                                
                        </span>
                    )
                }</div>

                { q && ws && doc && <EditComments q={ q } ws={ ws } doc={ doc } /> }
                
                <div id="my-text-area" style={{
                    height: Math.max(
                        (window.innerHeight - 300),
                        (commentBtnPosition + 50) ? (commentBtnPosition + 50) : 0
                    ) }}
                />
        
                <div className="bottom-btns">
                    <span onClick={ saveAll }><FontAwesomeIcon icon={ faSave } /></span>
                    <div className="msg">{ msg }</div>
                </div>
            </div>
        </div>
    );
}


export function EditPage(props: EditPageProps) {
    const [doc, setDoc] = React.useState(null as null | DocInfo);   
    const _loginCtx = React.useContext(loginCtx);
    
    const [perm, setPerm] = React.useState(200);

    React.useEffect(() => {
        getDocById(+props.match.params.docId).then(doc => {
            setDoc(doc);
            setPerm(200);
        }).catch(err => {
            if (err.code === 403) {
                setPerm(403)   
            } else if (err.code === 404) {
                setPerm(404);
            }
        });
    }, [ _loginCtx ]);


    if (!doc) return null;
    
    return (
        <EditHedaerProvider doc={ doc }>
            <div className="edit-page">
                <EditHeader />

                { perm === 404 && <div className="perm-err">
                    <span><FontAwesomeIcon icon={ faCarCrash } /></span>
                    找不到文档，请检查 URL
                </div> }

                { perm === 403 && <div className="perm-err">
                    <span><FontAwesomeIcon icon={ faCarCrash } /></span>
                    您没有权限打开此文档 <br />
                    请联系文档所有者
                </div> }

                <editHeaderCtx.Consumer>{ ctx => 
                    (perm === 200) && _loginCtx.user &&
                        doc && <EditPanel user={ _loginCtx.user } doc={ doc } />                    
                }</editHeaderCtx.Consumer>
            </div>
        </EditHedaerProvider>
    )
}
