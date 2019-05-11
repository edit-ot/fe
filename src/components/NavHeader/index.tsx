import * as React from "react";
import { NavLink } from "react-router-dom";
import cls from "classnames";

import "./nav-header.less";
import { loginCtx } from "../Login";
import { MenuBtns } from "../MenuBtns";
import { FontIcon } from "../FontIcon";
import { OpenMsgWindow } from "../Msg";
import { msgConnect } from "../../utils/WS/MsgConnect";

console.log('msgConnect', msgConnect)

export function NavHeader() {
    const { user, doLogout } = React.useContext(loginCtx);
    const [ hasUnRead, setHasUnRead ] = React.useState(false);

    React.useEffect(() => {
        msgConnect.socket.emit('msg-login');
        msgConnect.socket.on('msg-read-state-change', data => {
            console.log('msg-read-state-change', data);
            setHasUnRead(data.hasUnRead);
        });

        return () => msgConnect.socket.off('msg-read-state-change');
    }, []);

    return (
        <nav className="nav-header">
            <span className="navlink">
                <NavLink activeClassName="navlink-active" to="/">首页</NavLink>
            </span>

            <span className="navlink">
                <NavLink activeClassName="navlink-active" to="/about">关于</NavLink>
            </span>

            <div className="to-right"> 
                <span className={cls("navlink msg-info", {
                    'has-unread': hasUnRead
                })} onClick={ OpenMsgWindow }>
                    <FontIcon icon="icon-xiaoxi1" />
                </span>

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


