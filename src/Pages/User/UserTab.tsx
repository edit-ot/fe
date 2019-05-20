import * as React from "react";
import { loginCtx, UserWithGroups } from "../../components/Login";
import { userPageCtx } from "./index";

import { NavHeader } from "../../components/NavHeader";
import { HoverInfo, HoverHandler } from "../../components/HoverHandler";
import { GroupCard } from "../../components/TheCard";
import { uploadAvatar, updateUserInfo, toUserMap } from "./user-api";
import { PreviewSelected } from "./PreviewSelected";
import { GetInputPopup } from "../../components/GetInputPopup";
import { popupCtx } from "../../Ctx/Popup";
import { Link } from "react-router-dom";



export function UserTab() {
    const _loginCtx = React.useContext(loginCtx);
    const upCtx = React.useContext(userPageCtx);
     
    return (
        <div className="user-tab">
            { (_loginCtx && _loginCtx.user.username === upCtx.user.username) ?
                <UserPanel /> :
                <UserHeader username={ upCtx.user.username } />
            }
        </div>
    )
}


export function UserPanel() {
    const { user, update, doLogout, loadUser } = React.useContext(loginCtx);
    const _popup = React.useContext(popupCtx);
    // const [previewSrc, setPreviewSrc] = React.useState(null as null | string);
    const [cropped, setCropped] = React.useState(null as null | HTMLCanvasElement);

    const changePwd = (newPwd: string) => {
        console.log('change pwd', newPwd);
        alert('修改密码成功');
    }

    const changeIntro = (newIntro: string) => {
        updateUserInfo({
            intro: newIntro
        }).then(() => {
            update({ intro: newIntro });
            alert('修改成功');
        });
    }

    const mySelf = <>
        <div className="_btn _blue" onClick={ e => {
            // changeIntro()
            _popup.push(GetInputPopup, {
                title: '修改个性签名',
                placeholder: '个性签名',
                onConfirm: changeIntro,
                checker: str => !!str,
                errorInfo: '请勿为空'
            }, {
                style: { backgroundColor: 'rgba(0, 0, 0, .5)' }
            });
        }}>
            修改个性签名
        </div>
        <div className="_btn _blue" onClick={ e => {
            _popup.push(GetInputPopup, {
                title: '修改密码',
                placeholder: '请输入新密码',
                onConfirm: changePwd,
                checker: str => !!str,
                mask: true,
                errorInfo: '密码请勿为空'
            }, {
                style: { backgroundColor: 'rgba(0, 0, 0, .5)' }
            });
        } }>
            修改密码
        </div>
        <div className="_btn _red" onClick={ doLogout }>
            退出登录
        </div>
    </>
   
    return (
        <div className="">
            <input id="_file" style={{ visibility: 'hidden' }} type="file" onChange={ e => {
                if (e.target.files && e.target.files.length > 0) {
                    const reader = new FileReader();
                    const n = e.target.files[0].name;
                    reader.addEventListener("load", () =>
                        _popup.push(PreviewSelected, {
                            src: reader.result as string,
                            ok(canvas: HTMLCanvasElement) {
                                setCropped(canvas);
                                uploadAvatar(n, canvas).then(() => {
                                    loadUser();
                                })
                            }
                        }, { style: { background: 'rgba(0, 0, 0, .5)' } })
                    );
                    
                    reader.readAsDataURL(e.target.files[0]);
                }
            } } />

            <HoverInfo info="点击修改">
                <label htmlFor="_file" className="avatar-username">
                    { cropped ? (
                        <img src={ cropped.toDataURL() } />
                    ) : (
                        <img src={ user.avatar } />
                    ) }
                    <div className="username">
                        <div>{ user.username }</div>
                    </div>
                </label>
            </HoverInfo>

            <div className="_intro">{ user.intro || '该用户比较懒~ 暂时未设置个性签名' }</div>

            { mySelf }
        </div>
    )
}

export function UserHeader(props: { username: string }) {
    const _loginCtx = React.useContext(loginCtx);
    const upCtx = React.useContext(userPageCtx)
    const followersMap = toUserMap(upCtx.followers || []);

    return (
        <userPageCtx.Consumer>{ () =>
            <div className="">
                <HoverInfo info={ upCtx.user.username }>
                    <div className="avatar-username">
                        <img src={ upCtx.user.avatar || '' } />
                        
                        <div className="username">
                            <div>{ upCtx.user.username }</div>
                        </div>
                    </div>
                </HoverInfo>
                <div className="_intro">{ upCtx.user.intro || '该用户比较懒~ 暂时未设置个性签名' }</div>

                {
                    upCtx.user.username === _loginCtx.user.username ? (
                        null 
                    ) : (
                        <div className="_user-tab_btns">
                            { followersMap[_loginCtx.user.username] ?
                                <div onClick={ upCtx.toFollowThis }>Unfollow</div> : 
                                <div onClick={ upCtx.toFollowThis }>Follow</div>
                            }
                        </div>
                    )
                }
                { upCtx.user.groups && <UserGroups user={ upCtx.user } /> }
            </div>
        }</userPageCtx.Consumer>
    );
}

export function UserGroups(props: { user: UserWithGroups }) {
    const list = props.user.groups.map(g => {
        return (
            <HoverHandler className="group-inner"
                hoverComponent={ <GroupCard group={ g } /> }
                key={ g.groupId }>
                <img src={ g.groupAvatar || '/default.png' } />                
            </HoverHandler>
        )
    });

    const noData = (
        <div className="no-data">暂未加入任何小组</div>
    )

    return (
        <div className="user-groups">
            <div>
                { list.length ? list : noData }
            </div>
        </div>
    )
}

