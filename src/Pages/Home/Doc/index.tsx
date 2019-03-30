import * as React from "react";
import { getDoc, DocInfo, createBlankDoc, deleteDoc, docRename } from "./doc-api";
import { NoDocs } from "../../../components/NoDocs";
import { DocFile } from "./DocFile";
import { CreateBtn } from "../../../components/NoDocs/CreateBtn";
import { loginCtx } from "../../../components/Login";

import "./doc.less";
import { popupCtx } from "../../../Ctx/Popup/popup-ctx";
import { GetInputPopup } from "../../../Ctx/Popup/GetInputPopup";

export type DocProps = {}

export function Doc(props: DocProps) {
    const _popupCtx = React.useContext(popupCtx);
    const _loginCtx = React.useContext(loginCtx);
    const [docs, setDocs] = React.useState([] as DocInfo[]);

    const initDocs = () => {
        getDoc()
            .then(docs => docs && setDocs(docs))
            .catch(console.error);
    }

    // 如果用户登录，也应该 initDocs
    React.useEffect(initDocs,  [ _loginCtx.user ]);

    const onCreateDoc = e => {
        createBlankDoc().then(resp => {
            if (resp.code === 200 && resp.data) {
                initDocs();
            } else {
                console.error(resp);
            }
        }).catch(console.error);
    }

    const onDeleteDoc = doc => {
        if (window.confirm(`确定删除 ${ doc.title } 吗?`)) {
            deleteDoc(doc).then(resp => {
                if (resp.code === 200 && resp.data) {
                    initDocs();
                } else {
                    console.log('删除失败', resp);
                }
            }).catch(console.error);
        }
    }
 
    return docs.length === 0 ? <NoDocs onClick={ onCreateDoc } /> : (
        <div className="doc-main">
            <div className="doc-menu">
                <CreateBtn className="doc-menu-btn" onClick={ onCreateDoc }>新建</CreateBtn>
            </div>
            {docs.map((doc, idx) => 
                <div className="doc-file-wrap" key={ idx }>
                    <DocFile doc={ doc }
                        slides={[
                            {
                                name: '删除',
                                onBtnClick() {
                                    onDeleteDoc(doc);
                                }
                            },
                            {
                                name: '重命名',
                                onBtnClick() {
                                    
                                    _popupCtx.push(GetInputPopup, {
                                        title: '修改文件名',
                                        onConfirm: input => {
                                            docRename(doc, input).then(resp => {
                                                if (resp.code === 200 && resp.data) {
                                                    initDocs()
                                                } else {
                                                    console.error(resp);
                                                }
                                            })
                                        },
                                        checker: str => !!str,
                                        errorInfo: '文件名请勿为空'
                                    });
                                }
                            }
                        ]} />
                </div>
            )}
        </div>
    )
}
