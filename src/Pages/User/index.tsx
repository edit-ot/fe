import * as React from "react";
import { RouteComponentProps } from "react-router";
import { loginCtx } from "../../components/Login";
import { NavHeader } from "../../components/NavHeader";

import "./user.less";
import { HoverInfo } from "../../components/HoverHandler";
import { popupCtx, CreatePopupComponent } from "../../Ctx/Popup";
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
import { GetInputPopup } from "../../components/GetInputPopup";
import { updateUserInfo } from "./user-api";
import { Link } from "react-router-dom";

export type UserPageProps = RouteComponentProps<{
	username: string
}>

export function UserPage(props: UserPageProps) {
    const _loginCtx = React.useContext(loginCtx);
    const { username } = props.match.params;
    
    return (
        _loginCtx.user ? (
            <div className="user-page-main">
                <NavHeader />
                
                <UserPageNav />
                <UserPanel />
            </div>
        ) : null
    )
}

export function UserPageNav() {
    return (
        <div className="user-page-nav">
            <Link to="/">首页</Link> &gt; 用户资料
        </div>
    )
}

export function UserPanel() {
    const { user, update } = React.useContext(loginCtx);
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
        <div className="_btn _red">
            退出登录
        </div>
    </>
   
    return (
        <div className="user-page-inner">
            <input id="_file" style={{ visibility: 'hidden' }} type="file" onChange={ e => {
                if (e.target.files && e.target.files.length > 0) {
                    const reader = new FileReader();
                    reader.addEventListener("load", () =>
                        _popup.push(PreviewSelected, {
                            src: reader.result as string,
                            ok: setCropped
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

export type PreviewSelectedProps = CreatePopupComponent<{
    src: string,
    ok: (canvas: HTMLCanvasElement) => void
}>

export function PreviewSelected(props: PreviewSelectedProps) {
    const [$cropper, setCropper] = React.useState(null as null | Cropper);

    const $img = React.createRef<HTMLImageElement>();

    React.useEffect(() => {
        const $cropper = new Cropper($img.current, {
            aspectRatio: 1
        });

        setCropper($cropper);

        // @ts-ignore
        window.$cropper = $cropper;
    }, []);

    const width = window.innerWidth < 600 ? 300 : 600;
    // const height = window.innerWidth < 600 ? 300 : 600;

    return (
        <div className="preview-selected-main">
            <div style={{
                // width, 
                // height
            }}>
                <img ref={ $img } style={{
                    maxWidth: '100%',
                    visibility: 'hidden'
                }} src={ props.src } />
            </div>

            <HoverInfo info="鼠标缩放 / 双指缩放, 确定无误后点击即可" onClick={() => {
                if (!$cropper) return;
                props.ok($cropper.getCroppedCanvas());
                props.pop();
            }}>
                <div className="_confirm">提交</div>
            </HoverInfo>

            <div className="_confirm _cancel" onClick={ props.pop }>取消</div>
        </div>
    )
}
