import * as React from "react";
import { RouteComponentProps } from "react-router";
import { getGroup, Group } from "../homeaside-api";
import cls from "classnames";

import "./group.less";
import { NoDocs } from "../../../components/NoDocs";
import { loginCtx, User } from "../../../components/Login";
import { popupCtx } from "../../../Ctx/Popup";
import { DocMain } from "../Doc";
import { createDocForGroup, cancelShare, setPermissionRemote } from "./group-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit, faWalking, faRunning } from "@fortawesome/free-solid-svg-icons";

import { GeneralPermission } from "../../../components/GeneralPermissionProps";
import { searchUser } from "../../../components/ChangePermissionPopup/cpp-api";
import { CreateBtn } from "../../../components/NoDocs/CreateBtn";
import { openManage, openGroupInfoUpdater } from "./group-util";
import { DocInfo, toRenameMyDoc } from "../Doc/doc-api";
import { SlideItem } from "../../../components/MenuBtns";
import { NavLink } from "react-router-dom";
import { HoverInfo } from "../../../components/HoverHandler";
import { Avatar } from "../../../components/Avatar";
import { globalBus } from "../../../utils/GlobalBus";


export type GroupProps = RouteComponentProps<{
	groupId: string
}>

type RenderGroupProps = {
    group: Group, 
    user: User,
    reInit: () => void
}

function GroupList(props: { group: Group, user: User, onPop: () => void }) {
    const _popupCtx = React.useContext(popupCtx);
    const { user } = props;
    const { users, ownerInfo } = props.group;
    
    const list = [ownerInfo, ...users].filter(e => e).map((innerUser, idx) => {
        const isOwner = props.group.owner === innerUser.username;
        const isMe = user.username === innerUser.username;
        return (
            <NavLink
                to={`/user/${ innerUser.username }`}
                className={cls('_user-line', {
                '_owner': isOwner
            })} key={ idx }>
                <img src={ innerUser.avatar } />
                <span>{ innerUser.username } { isMe && <span style={{ color: '#BBB', fontSize: '50%' }}>(我)</span> }</span>

                { isOwner ? (
                    <span className="_right-text __owner">小组 Owner <FontAwesomeIcon icon={ faRunning } /></span>
                ) : (
                    <span className="_right-text">小组成员 <FontAwesomeIcon icon={ faWalking } /></span>
                ) }
            </NavLink>
        )
    })
    return (
        <div className="group-list">
            <div className="_g-l-t">
                <span>小组成员列表</span>
                <CreateBtn className="_add-btn"
                    onClick={() => openManage(_popupCtx, props.group, props.onPop)}>
                    成员管理
                </CreateBtn>            
            </div>
            <div className="member-list">
                { list }

                { list.length !== 1 ? (
                    <div className="_bottom-info">
                        共计 { list.length } 个成员
                    </div>
                ) : (
                    <div className="_bottom-info">
                        <span>小组目前只有你一人</span>
                    </div>
                )}
            </div>

            
        </div>
    )
}

function RenderGroup(props: RenderGroupProps) {
    const _popupCtx = React.useContext(popupCtx);
    const { group, user, reInit } = props;

    const onCreateDoc = () => {
        createDocForGroup(group.groupId).then(reInit);
    }

    const getSlides = (doc: DocInfo) => {
        const slides: SlideItem[] = [];

        if (doc.owner === props.user.username) {
            slides.push({
                name: '您是创建者'
            }, {
                name: '重命名',
                onBtnClick() {
                    toRenameMyDoc(doc).then(props.reInit);
                }
            })
        } else {
            slides.push({
                name: `由 ${doc.owner} 分享`
            });
        }

        return slides;
    }

    return (
        <div>
            <div className="_lr">
                <div className="l">
                    <GroupInfo group={ group } />

                    <div className="_line">小组文件</div>
                    {
                        group.docs && 
                            <DocMain
                                onCreateDoc={ onCreateDoc }
                                docs={ group.docs }
                                getSlides={ getSlides }
                            />
                    }

                    <div className="_line">小组日历</div>
                </div>

                <div className="r">
                    <GroupList group={ group } user={ user } onPop={() => {
                        reInit();
                    }} />
                </div>
            </div>
        </div>
    )
}

export function GroupInfo(props: { group: Group }) {
    const { group } = props;

    return (
        <div className="group-info-main">
            <div className="_group-info">
                <div className="_title">
                    { group.groupName }
                </div>

                <HoverInfo info="修改小组信息" className="fa-user-edit" onClick={() => {
                    openGroupInfoUpdater(group);
                }}>
                    <FontAwesomeIcon icon={ faUserEdit } />                            
                </HoverInfo>

                <div className="_intro">
                    { group.groupIntro || '该小组长比较懒，暂时没添加小组介绍' }
                </div>
            </div>

            <div className="_avatar">
                <Avatar text={ group.groupName } src={ group.groupAvatar } />
            </div>
        </div>
    )
}

export function Group(props: GroupProps) {
    const _loginCtx = React.useContext(loginCtx);
    const _popupCtx = React.useContext(popupCtx);

    const [group, setGroup] = React.useState(null as null | Group);
    const [loading, setLoading] = React.useState(true);


    React.useEffect(() => {
        const patcher = (groupPatch: Partial<Group>) => {
            setGroup(Object.assign({}, group, groupPatch));
        }

        globalBus.on('UpdateGroupInfo', patcher);

        return () => globalBus.removeListener('UpdateGroupInfo', patcher);
    }, [ group ]);

    const init = () => {
        setLoading(true);
        getGroup(props.match.params.groupId)
            .then(setGroup)
            .then(() => setLoading(false));
    }

    React.useEffect(init, [ _loginCtx.user, props ])

    return (
        <div className="group-main">
        
            {
                loading ? (
                    <div>加载登录中</div>
                ) : (
                    group ? (
                        <loginCtx.Consumer>{ctx => 
                            <RenderGroup group={ group } user={ ctx.user } reInit={ init } />
                        }</loginCtx.Consumer>
                    ) : (
                        <NoDocs text="未找到这个学习小组，请检查 URL" />
                    )
                )
            }
        </div>
    )
}
