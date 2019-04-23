import * as React from "react";
import { NavLink } from "react-router-dom";

import "./nav-header.less";
import { loginCtx } from "../Login";
import { ClickHandler } from "../ClickHandler";
import { MenuBtns } from "../MenuBtns";

export function NavHeader() {
    const { user, doLogout } = React.useContext(loginCtx);

    return (
        <nav className="nav-header">
            <span className="navlink">
                <NavLink activeClassName="navlink-active" to="/">刷新</NavLink>
            </span>

            <span className="navlink">
                <NavLink activeClassName="navlink-active" to="/about">关于</NavLink>
            </span>
            
            {
                user && user.avatar && (
                    <MenuBtns className="to-right" align="right" slides={[
                        {
                            name: '注销登录',
                            onBtnClick() {
                                doLogout();
                            }
                        },
                        // {
                        //     name: '修改个人资料',
                        //     onBtnClick() {

                        //     }
                        // }
                    ]}>{
                        ref => <div ref={ ref }>
                            <span className="navlink" key="nhl-avatar-name">
                                { user.username }
                            </span>
                            <span className="navlink avatar" key="nhl-avatar">
                                
                                <img src={ user.avatar } />
                            </span>
                        </div>
                    }</MenuBtns>
                )
            }
            
            
        </nav>
    );
}


