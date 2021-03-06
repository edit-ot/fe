import * as React from "react";
import { NavLink } from "react-router-dom";
import cls from "classnames";

import "./nav-header.less";
import { loginCtx } from "../Login";
import { MenuBtns } from "../MenuBtns";
import { FontIcon } from "../FontIcon";
import { OpenMsgWindow } from "../Msg";
import { msgConnect } from "../../utils/WS/MsgConnect";

console.log('msgConnect', msgConnect);

export function TheMsgIcon(props: { className?: string }) {
    const [ hasUnRead, setHasUnRead ] = React.useState(false);

    React.useEffect(() => {
        msgConnect.socket.emit('msg-login');

        const $$ = data => setHasUnRead(data.hasUnRead);

        msgConnect.socket.on('msg-read-state-change', $$);

        return () => msgConnect.socket.removeListener('msg-read-state-change', $$);
    }, []);

    return (
        <span className={cls("msg-info", props.className || '', {
            'has-unread': hasUnRead
        })} onClick={ () => {
            setHasUnRead(false);
            OpenMsgWindow();
        } }>
            <FontIcon icon="icon-xiaoxi1" />
        </span>
    )
}

export function NavHeader() {
    const { user, doLogout } = React.useContext(loginCtx);

    return (
        <nav className="nav-header">
            <span className="navlink">
                <NavLink activeClassName="navlink-active" to="/">首页</NavLink>
            </span>

            <span className="navlink">
                <NavLink activeClassName="navlink-active" to="/about">关于</NavLink>
            </span>

            <div className="to-right"> 
                <TheMsgIcon className="navlink" />

                {
                    user && user.avatar && (
                        <MenuBtns align="right" slides={[
                            {
                                name: '注销登录',
                                onBtnClick() {
                                    doLogout();
                                }
                            },
                            {
                                name: '修改个人资料',
                                onBtnClick() {
                                    window.location.href = `/user/${ user.username }`;
                                }
                            }
                        ]}>{
                            ref => <span ref={ ref }>
                                <span className="navlink avatar" key="nhl-avatar">
                                    <img src={ user.avatar } />
                                </span>
                                <span className="navlink" key="nhl-avatar-name">
                                    { user.username }
                                </span>
                            </span>
                        }</MenuBtns>
                    )
                }
            </div>
        </nav>
    );
}

