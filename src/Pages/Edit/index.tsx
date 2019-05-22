import * as React from "react";
import Quill from "quill";

import { RouteComponentProps, Link } from "react-router-dom";
// import { Blot } from 'parchment/dist/src/blot/abstract/blot';


import "quill/dist/quill.snow.css";
import "./edit.less";
import { getDocById, docSave, reqPermRemote, getDocWithPmapById } from "./edit-api";
import { DocInfoWithPmap } from "../Home/Doc/doc-api";
// import { NavHeader } from "../../components/NavHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faCarCrash, faCommentAlt, faMagic, faTv, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "../../utils";
import { loginCtx, User } from "../../components/Login";
import { WS } from "../../utils/WS";
import { HoverInfo } from "../../components/HoverHandler";
import { EditComments, editCommentsCtx } from "./EditComments";
import { editHeaderCtx, EditHedaerProvider, EditHeader } from "./EditHeader";

// import { Delta } from "edit-ot-quill-delta";
import { AuthorAttr } from "./Custom/AuthorColor";
import { articleDomStyle } from "./EditHeader/dom-style";
import { allScreen } from "./AllScreen";

import JSONStringify from "fast-json-stable-stringify";
import { ErrInfo } from "../../components/ErrInfo";
import { CreateBtn } from "../../components/NoDocs/CreateBtn";
import { showTextPopup } from "./TextPopup";
import { msgConnect } from "../../utils/WS/MsgConnect";

Quill.register(AuthorAttr);

export type EditPageProps = RouteComponentProps<{
	docId: string
}>


export type EditPanelProps = {
    doc: DocInfoWithPmap,
    user: User,
    whenCppp: () => void;
}

function onlyRead(username: string, doc: DocInfoWithPmap) {
    if (doc.owner === username) return false;
    if (!doc.pmap[username]) return false;

    if (!doc.pmap[username].w) {
        return true;
    } else {
        return false;
    }
}

function showPermissionTips() {
    showTextPopup(
        <div className="perm-tips">
            <h1>你当前对此文档的权限为只读</h1>
            <p>因此你无法编辑此文档，只能查看协同编辑情况以及评论。</p>
            <p>如果想申请权限可以点击下方按钮</p>
            <CreateBtn>申请权限</CreateBtn>

            <p>当然，你也可以随时点击页面底部的 <FontAwesomeIcon icon={ faQuestionCircle } /> 来打开这个弹窗</p>
        </div>
    );
}

export function EditPanel(props: EditPanelProps) {
    const { doc, user, whenCppp } = props;
    const [msg, showMsg] = React.useState('');
    const [q, setQ] = React.useState(null as null | Quill);
    const [ws, setWS] = React.useState(null as null | WS);
    const $input = React.useRef<HTMLInputElement>();
    const [commentBtnPosition, setCommentBtnPosition] = React.useState(null as number | null);
    const [line, setLine] = React.useState(null as null | number);
    const [loading, setLoading] = React.useState(true);
    const _editHeaderCtx = React.useContext(editHeaderCtx);

    React.useEffect(() => {
        if (!q) return;

        if (onlyRead(user.username, doc)) {
            q.disable();
            console.log('当前只读');
            showPermissionTips();
        } else {
            q.enable();
            showTextPopup(
                <div>
                    <h1>文档权限 <FontAwesomeIcon icon={ faQuestionCircle } /></h1>
                    <p>欢迎来到此文档的协同编辑，你当前对此文档的权限为可读可写，Have Fun ~</p>
                </div>
            );
        }
    }, [ props, q ]);

    React.useEffect(() => {
        const q = new Quill('#my-text-area', {
            modules: {
                toolbar: { container: `#my-toolbar` }
            },
            theme: 'snow'  // or 'bubble'
        });

        q.root.setAttribute('spellcheck', 'false');

        const ws = new WS(q, doc.id, user);
        // @ts-ignore
        window.ws = ws;

        ws.socket.on('owner-change-title', (newTitle: string) => {
            if (doc.owner === user.username) return;
            console.log('newTitle', newTitle);
            if ($input && $input.current) $input.current.value = newTitle;
        });

        // q.setContents(JSON.parse(doc.content), 'silent');

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

        ws.on('disconnect', (why) => {
            console.error('socket.io disconnect:', why);
        });
        ws.on('reconnect_attempt', to => {
            console.log('reconnect_attempt:', to);
        })

        setQ(q);
        setWS(ws);

        // @ts-ignore
        window.q = q;

        return () => {
            console.warn('RELOAD EDITPANEL');
            ws.socket.close();
            ws.removeAllListeners();
        }
    }, [ ]);

    React.useEffect(() => {
        if (!q) return;
        articleDomStyle.reload(q);
    }, [ q ]);

    React.useEffect(() => {
        if (!ws) return console.info('No WS, Return');

        const whenOthersJoined = (others: User) => {
            // 排除自己 
            if (others.username === user.username) return;

            console.log('others-joined', others);
            _editHeaderCtx.addLoginedList(others)
        }
        ws.socket.on('others-joined', whenOthersJoined);

        const whenOthersExit = (user: User) => {
            console.log('others-exit', user);
            _editHeaderCtx.removeLoginedList(user);
        }
        ws.socket.on('others-exit', whenOthersExit);

        let loginedTimer;
        const whenILogined = data => {
            // data.userInfo 是自己的信息, users 是目前在该文档下的用户
            console.log('i-logined', JSON.stringify(data));
            const user: User = data.userInfo;
            const users: User[] = data.users;

            _editHeaderCtx.pushMsg(
                `登录成功, 欢迎 ${user.username}, 目前有 ${ users.length } 人在编辑本文档`
            );

            _editHeaderCtx.setLoginedList(users);

            if (data.doc) {
                if (data.doc.now) {
                    console.log(data.doc.now, doc.content);
                    q.setContents(data.doc.now, 'silent');
                }
                $input.current.value = doc.title;
            }

            setLoading(false);
            loginedTimer = setTimeout(() => {
                articleDomStyle.reload(q);
                ws.init();
            }, 50);
        }
        ws.socket.on('i-logined', whenILogined);

        const whenSayHello = (theUser: User) => {
            _editHeaderCtx.bus.emit('receive-hello', theUser);
        }
        ws.socket.on('say-hello', whenSayHello);

        const whenBusSayHello = () => {
            ws.socket.emit('say-hello', user);
        }

        _editHeaderCtx.bus.on('say-hello', whenBusSayHello);

        return () => {
            console.log('cancel');
            ws.socket.removeEventListener('others-joined', whenOthersJoined);
            ws.socket.removeEventListener('others-exit', whenOthersExit);
            ws.socket.removeEventListener('i-logined', whenILogined);
            clearTimeout(loginedTimer);

            ws.socket.removeEventListener('say-hello', whenSayHello);
            _editHeaderCtx.bus.removeListener('say-hello', whenBusSayHello);
        }
    }, [ _editHeaderCtx, ws ]);

    React.useEffect(() => {
        if (!_editHeaderCtx && !_editHeaderCtx.bus) return;

        const CPPP = () => {
            ws.socket.emit('ChangePermissionPopup Popped');
        }
        _editHeaderCtx.bus.on('ChangePermissionPopup Popped', CPPP)

        return () => {
            _editHeaderCtx.bus.removeListener('ChangePermissionPopup Popped', CPPP);
        }
    }, [ _editHeaderCtx ]);

    React.useEffect(() => {
        if (!ws) return;

        const CPPP = () => {
            whenCppp();
        }

        ws.socket.on('ChangePermissionPopup Popped', CPPP);

        return () => {
            ws.socket.removeEventListener('ChangePermissionPopup Popped', CPPP);
        }
    }, [ ws ]);

    React.useEffect(() => {
        if (!ws) return;

        console.log('To Emit I-Login')
        ws.socket.emit('i-login');
    }, [ws]);

    const saveAll = () => {
        if (!q) return;

        const delta = q.getContents();
        const deltaStr = JSONStringify(delta);
        
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
                    <button className="ql-italic"></button>
                    <button className="ql-underline"></button>

                    <span className="ql-formats">
                        <button className="ql-align" value=""></button>
                        <button className="ql-align" value="center"></button>
                        <button className="ql-align" value="right"></button>
                        {/* <button className="ql-align" value="justify"></button> */}
                    </span>

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

                { q && ws && doc && !loading &&
                    <EditComments q={ q } ws={ ws } doc={ doc } /> }
                
                <div id="my-text-area" style={{
                    height: window.innerHeight - 300
                }} />
        
                <div className="bottom-btns">
                    <span onClick={ saveAll }><FontAwesomeIcon icon={ faSave } /></span>
                    <span onClick={ () => allScreen(doc.title, q) }><FontAwesomeIcon icon={ faTv } /></span>

                    { onlyRead(user.username, doc) && <span onClick={ showPermissionTips }>
                        <FontAwesomeIcon icon={ faQuestionCircle } /> 只读
                    </span> }
                     
                    <div className="msg">{ msg }</div>
                </div>
            </div>
        </div>
    );
}

function WaitForPermission(props: { docId: string }) {
    return (
        <ErrInfo title="拒绝访问" intro="你没有访问此文档的权限">
            <CreateBtn className="_btn" onClick={
                () => {
                    reqPermRemote(+props.docId || 0).then(resp => {
                        alert('申请成功');
                    }).catch(() => {
                        alert('你已经申请过了，请勿重复申请');
                    });
                }
            }>申请访问</CreateBtn>
            <CreateBtn className="_btn">
                <Link to="/">回到首页</Link>
            </CreateBtn>
        </ErrInfo>
    );
}


export function EditPage(props: EditPageProps) {
    const [docLoading, setDocLoading] = React.useState(true);

    const [doc, setDoc] = React.useState(null as null | DocInfoWithPmap);   
    const _loginCtx = React.useContext(loginCtx);
    
    const [perm, setPerm] = React.useState(200);

    const init = () => {
        getDocWithPmapById(+props.match.params.docId).then(doc => {
            setDoc(doc);
            setPerm(200);
            setTimeout(() => {
                setDocLoading(false);
            }, 1000 + ~~(Math.random() * 500));
        }).catch(err => {
            if (err.code === 403) {
                setPerm(403)   
            } else if (err.code === 404) {
                setPerm(404);
            }
        });
    }

    React.useEffect(init, [ _loginCtx ]);

    const $loading = (
        <div className="doc-loading">
            <FontAwesomeIcon icon={ faMagic } />
            <div>
                <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
    );

    if (perm !== 200) {
        if (perm === 404) {
            return (
                <div className="perm-err">
                    <span><FontAwesomeIcon icon={ faCarCrash } /></span>
                    找不到文档，请检查 URL
                </div>
            )
        }

        if (perm === 403) {
            return (
                <WaitForPermission docId={ props.match.params.docId } />
            )
        }

    }

    if (!doc) return <div className="edit-page">{ $loading }</div>;

    console.log('Re WhenCpp');
    const whenCppp = () => {
        if (doc.owner === _loginCtx.user.username) return;

        console.log('Owner Chnage CPPP');

        setDocLoading(true);

        getDocWithPmapById(+props.match.params.docId).then(newDoc => {
            // 没事
            const preP = doc.pmap[_loginCtx.user.username]
            const newP = newDoc.pmap[_loginCtx.user.username];

            console.log('preP', preP, 'newP', newP);

            if (!preP.w && newP.w) {
                setDoc(newDoc);
                setPerm(200);
            }

            if (preP.w && !newP.w) {
                setDoc(newDoc);
                setPerm(200);
            }

            setDocLoading(false);
        }).catch(resp => {
            setPerm(resp.code);
            showTextPopup(
                <div>
                    文档权限发生变化
                </div>
            );

            setDocLoading(false);
        })
    }

    const content = (
        docLoading ?
            $loading : <EditPanel user={ _loginCtx.user } doc={ doc } whenCppp={ whenCppp } />
    );

    return (
        <EditHedaerProvider doc={ doc }>
            <div className="edit-page">
                <EditHeader />

                <editHeaderCtx.Consumer>{ ctx => 
                    (perm === 200) && _loginCtx.user &&
                        doc && content
                }</editHeaderCtx.Consumer>
            </div>
        </EditHedaerProvider>
    )
}
