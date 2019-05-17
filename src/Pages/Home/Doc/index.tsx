import "./doc.less";
import * as React from "react";
import { DocFile } from "./DocFile";
import { NoDocs } from "../../../components/NoDocs";
import { loginCtx } from "../../../components/Login";
import { popupCtx, popup$ } from "../../../Ctx/Popup/popup-ctx";
import { CreateBtn } from "../../../components/NoDocs/CreateBtn";
import { GetInputPopup } from "../../../components/GetInputPopup";
import { ComponentSwitch } from "../../../components/ComponentSwitch";
import { ChangePermissionPopup } from "../../../components/ChangePermissionPopup";
import { getDoc, DocInfo, createBlankDoc, deleteDoc, docRename, cancelOthersShare, toRenameMyDoc, toDeleteMyDoc, toUnlinkDoc } from "./doc-api";
import { SlideItem } from "../../../components/MenuBtns";
import { getNowPageQuery } from "../../../utils/http";



export type DocSourceProps = {
    getDoc: (...args: any[]) => Promise< DocInfo[] >;
    createDoc: () => Promise<any>;
    noBtnMenu?: boolean;
    getSlides: (doc: DocInfo) => SlideItem[]

}

export function DocPage() {
    const _loginCtx = React.useContext(loginCtx);
    const [docs, setDocs] = React.useState([] as DocInfo[]);
    const [sharedDocs, setSharedDocs] = React.useState([] as DocInfo[]);
    
    const initDocs = () => getDoc().then(setDocs);
    const initSharedDocs = () => getDoc(true).then(setSharedDocs);

    
    React.useEffect(() => {
        initDocs();
        initSharedDocs();
    },  [ _loginCtx.user ]);    

    const iCreated = (
        <DocMain
            activeDocId={ getNowPageQuery().activeDocId || '_' }
            key="i-created-doc-main"
            docs={ docs }
            onCreateDoc={ () => {
                createBlankDoc().then(initDocs);
            } }
            getSlides={ (doc: DocInfo) => {
                return [{
                    name: '重命名',
                    onBtnClick() {
                        toRenameMyDoc(doc).then(initDocs);
                    }
                }, {
                    name: '协作分享',
                    onBtnClick() {
                        popup$.push(ChangePermissionPopup, {
                            docId: doc.id
                        }, {
                            style: { backgroundColor: 'rgba(0, 0, 0, .5)' }
                        })
                    }
                }, {
                    name: '删除',
                    onBtnClick() {
                        toDeleteMyDoc(doc).then(initDocs);
                    }
                }]
            }}
        />
    );

    const iShared = (
        <DocMain
            activeDocId={ getNowPageQuery().activeDocId || '_' }
            key="i-shared-doc-main"
            docs={ sharedDocs }
            getSlides={ (doc: DocInfo) => {
                return [{
                    name: '删除',
                    onBtnClick() {
                        toUnlinkDoc(doc).then(initSharedDocs);
                    }
                }]
            }}
        />
    );

    return (
        <div className="doc-page">
            <ComponentSwitch initPosi={
                getNowPageQuery().tab ? 
                    (+getNowPageQuery().tab) : 0
            } configs={[{
                name: '我创建的',
                inner: iCreated
            }, {
                name: '共享给我的',
                inner: iShared
            }]} />
        </div>
    );
}

export type DocProps = {
    docs: DocInfo[];
    onCreateDoc?: () => void;
    getSlides: (doc: DocInfo) => SlideItem[];
    activeDocId: string;
}

export function DocMain({
    docs,
    onCreateDoc,
    getSlides,
    activeDocId
}: DocProps) {
    return docs.length === 0 ? (
        <NoDocs onClick={ onCreateDoc } />
    ) : (
        <div className="doc-main">
            {docs.map((doc, idx) => {
                const slides: SlideItem[] = getSlides(doc);

                return <div className="doc-file-wrap" key={ idx }>
                    <DocFile doc={ doc }
                        activeDocId={ activeDocId }
                        // initVisible={ true }
                        slides={ slides } />
                </div>
            })}

            {
                onCreateDoc && (
                    <div className="doc-menu">
                        <CreateBtn className="doc-menu-btn" onClick={ onCreateDoc }>新建</CreateBtn>
                    </div>
                )
            }
        </div>
    )
}
