import * as React from "react";
import { getDoc, DocInfo, createBlankDoc, deleteDoc, docRename, getAllGroup } from "./doc-api";
import { NoDocs } from "../../../components/NoDocs";
import { DocFile } from "./DocFile";
import { CreateBtn } from "../../../components/NoDocs/CreateBtn";
import { loginCtx } from "../../../components/Login";

import "./doc.less";
import { popupCtx } from "../../../Ctx/Popup/popup-ctx";
import { GetInputPopup } from "../../../components/GetInputPopup";
import { ChangePermissionPopup } from "../../../components/ChangePermissionPopup";
import { getGroups, getJoinedGroups, linkDocGroup, unLinkDocGroup } from "../homeaside-api";
import { SlideItem } from "../../../components/MenuBtns";



export function Doc() {
    const _loginCtx = React.useContext(loginCtx);
    const [docs, setDocs] = React.useState([] as DocInfo[]);

    const initDocs = () => {
        getDoc()
            .then(docs => docs && setDocs(docs))
            .catch(console.error);
    }

    // 如果用户登录，也应该 initDocs
    React.useEffect(initDocs,  [ _loginCtx.user ]);

    const onCreateDoc = () => {
        createBlankDoc().then(resp => {
            if (resp.code === 200) {
                initDocs();
            } else {
                console.error(resp);
            }
        }).catch(console.error);
    }

    return (
        <DocMain docs={ docs }
            initDocs={ initDocs }
            onCreateDoc={ onCreateDoc } />
    )
}

export type DocProps = {
    docs: DocInfo[],
    initDocs: () => void,
    onCreateDoc: () => void,
}

export function DocMain({ docs, initDocs, onCreateDoc }: DocProps) {
    const _popupCtx = React.useContext(popupCtx);

    const onDeleteDoc = doc => {
        _popupCtx.push(GetInputPopup, {
            title: `删除 '${ doc.title }' ?`,
            confrimText: '删除',
            cancelText: '取消',
            pureConfirm: true,
            onConfirm() {
                deleteDoc(doc).then(resp => {
                    if (resp.code === 200 && resp.data) {
                        initDocs();
                    } else {
                        console.log('删除失败', resp);
                    }
                }).catch(console.error);
            }
        }, {
            style: { backgroundColor: 'rgba(0, 0, 0, .5)' }
        })
    }

    return docs.length === 0 ? <NoDocs onClick={ onCreateDoc } /> : (
        <div className="doc-main">
            <div className="doc-menu">
                <CreateBtn className="doc-menu-btn" onClick={ onCreateDoc }>新建</CreateBtn>
            </div>
            {docs.map((doc, idx) => 
                <div className="doc-file-wrap" key={ idx }>
                    <DocFile doc={ doc }
                        // initVisible={ true }
                        slides={[{
                            name: '删除',
                            onBtnClick: () => onDeleteDoc(doc)
                        }, {
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
                                }, {
                                    style: { backgroundColor: 'rgba(0, 0, 0, .5)' }
                                });
                            }
                        }, {
                            // opened: true,
                            name: '协作权限设置',
                            onBtnClick() {
                                _popupCtx.push(ChangePermissionPopup, {
                                    docId: doc.id
                                }, {
                                    style: { backgroundColor: 'rgba(0, 0, 0, .5)' }
                                })
                            }
                        }, {
                            // opened: true,
                            name: '分享到学习小组',
                            inner: () => getAllGroup().then(lr => {
                                    return lr.map(e => {
                                        
                                        return {
                                            name: e.groupName,
                                            onBtnClick() {
                                                linkDocGroup(doc.id, e.groupId).then(() => {
                                                    alert('分享成功');
                                                }).catch(resp => {
                                                    if (resp.code === 405) {
                                                        alert(`该文档已添加至 ${ e.groupName }, 无需重复`);
                                                    }
                                                })
                                            }
                                        }
                                    })
                                })
                        }, {
                            name: '取消分享至学习小组', 
                            inner: () => getAllGroup().then(lr => {
                                return lr.map(e => {
                                    return {
                                        name: e.groupName, 
                                        onBtnClick() {
                                            unLinkDocGroup(doc.id, e.groupId).then(() => {
                                                alert('取消分享成功');
                                            }).catch(resp => {
                                                if (resp.code === 403) {
                                                    alert('权限不足，请联系文档所有者或组织管理员取消分享');
                                                } else if (resp.code === 404) {
                                                    alert('此文档已取消分享, 请勿重复');
                                                }
                                            })
                                        }
                                    }
                                })
                            })
                        }]} />
                </div>
            )}
        </div>
    )
}
