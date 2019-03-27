import * as React from "react";
import { getDoc, DocInfo, createBlankDoc, deleteDoc } from "./doc-api";
import { NoDocs } from "../../../components/NoDocs";
import { DocFile } from "./DocFile";
import { CreateBtn } from "../../../components/NoDocs/CreateBtn";
import { loginCtx } from "../../../components/Login";

import "./doc.less";

export type DocProps = {

}

export function Doc(props: DocProps) {
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
            {
                docs.map((doc, idx) => {
                    return (
                        <div className="doc-file-wrap" key={ idx }>
                            <DocFile doc={ doc } onDelete={ onDeleteDoc } />
                        </div>
                    )
                })
            }
        </div>
    )
}
