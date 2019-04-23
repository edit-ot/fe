import * as React from "react";
import Quill from "quill";
import { RouteComponentProps } from "react-router";

import "quill/dist/quill.snow.css";
import "./edit.less";
import { getDocById, docSave } from "./edit-api";
import { DocInfo } from "../Home/Doc/doc-api";
import { NavHeader } from "../../components/NavHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faCarCrash } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "../../utils";
import { loginCtx, User } from "../../components/Login";
import { WS } from "../../utils/WS";
import { HoverInfo } from "../../components/HoverHandler";
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
    const $input = React.useRef<HTMLInputElement>();
    const [loginedUsers, setLoginedUsers] = React.useState([] as User[]);

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

        if (doc && doc.content) {
            q.setContents(JSON.parse(doc.content), 'silent');
            $input.current.value = doc.title;
        }
        

        const ws = new WS(q, doc.id, user);
        // @ts-ignore
        window.ws = ws;
        ws.socket.on('!', console.log);

        ws.socket.on('i-logined', data => {
            // data.userInfo 是自己的信息, users 是目前在该文档下的用户
            console.log('i-logined', data);
            const user: User = data.userInfo;
            const users: User[] = data.users;

            setLoginedUsers(users);
        });

        ws.socket.on('others-joined', (others: User) => {
            // 排除自己 
            if (others.username === user.username) return;

            console.log('others-joined', user);
            const lu = loginedUsers.concat(user);
            setLoginedUsers(lu);
        });

        setQ(q);

        // @ts-ignore
        window.q = q;
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
        showMsg('同步标题中 ...');

        docSave({
            id: doc.id,
            title: $input.current.value
        }).then(ok => {
            showMsg('标题同步成功');
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
                                    <input ref={ $input } className="_disable" type="text" defaultValue={ doc.title }
                                        onChange={ onTitleChange } disabled={ true } />
                                </HoverInfo>
                                
                            )
                        }
                        
                    </div>
                ) : (
                    <div className="title-edit loading">加载中...</div>
                ) }
                
                <div id="my-text-area" style={{ height: window.innerHeight - 80 - 170 }}></div>

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
    
    return (
        <div className="edit-page">
            <NavHeader />

            { perm === 404 && <div className="perm-err">
                <span><FontAwesomeIcon icon={ faCarCrash } /></span>
                找不到文档，请检查 URL
            </div> }

            { perm === 403 && <div className="perm-err">
                <span><FontAwesomeIcon icon={ faCarCrash } /></span>
                您没有权限打开此文档 <br />
                请联系文档所有者
            </div> }

            { perm === 200 && _loginCtx.user &&
                doc && <EditPanel user={ _loginCtx.user } doc={ doc } /> }
        </div>
    )
}
