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
import { openManage } from "./group-util";


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
            <div className={cls('_user-line', {
                '_owner': isOwner
            })} key={ idx }>
                <img src={ innerUser.avatar } />
                <span>{ innerUser.username } { isMe && <span style={{ color: '#BBB', fontSize: '50%' }}>(我)</span> }</span>

                { isOwner ? (
                    <span className="_right-text __owner">小组 Owner <FontAwesomeIcon icon={ faRunning } /></span>
                ) : (
                    <span className="_right-text">小组成员 <FontAwesomeIcon icon={ faWalking } /></span>
                ) }
            </div>
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
        createDocForGroup(group.groupId)
            .then(reInit);
    }

    return (
        <div>
            <div className="_lr">
                <div className="l">
                    <div className="_title">
                        { group.groupName }
                        <span className="fa-user-edit" onClick={ () => {
                            openManage(_popupCtx, group);
                        } }>
                            <FontAwesomeIcon icon={ faUserEdit } />
                        </span>
                    </div>
                    {
                        group.docs && 
                            <DocMain
                                docs={ group.docs } initDocs={ reInit } onCreateDoc={ onCreateDoc }
                            />
                    }
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

export function Group(props: GroupProps) {
    const _loginCtx = React.useContext(loginCtx);
    const _popupCtx = React.useContext(popupCtx);

    const [group, setGroup] = React.useState(null as null | Group);
    const [loading, setLoading] = React.useState(true);

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
                    <div>加载中</div>
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
