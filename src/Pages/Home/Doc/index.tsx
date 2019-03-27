import * as React from "react";
import { getDoc, DocInfo, createBlankDoc, deleteDoc } from "./doc-api";
import { NoDocs } from "../../../components/NoDocs";
import { DocFile } from "./DocFile";
import { CreateBtn } from "../../../components/NoDocs/CreateBtn";

import "./doc.less";

export function Doc() {
    const [docs, setDocs] = React.useState([] as DocInfo[]);

    const initDocs = () => {
        getDoc()
            .then(docs => docs && setDocs(docs))
            .catch(console.error);
    }

    React.useEffect(initDocs, []);

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
