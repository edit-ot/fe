import * as React from "react";
import { NavLink } from "react-router-dom";

import "./nav-header.less";
import { loginCtx } from "../Login";

export function NavHeader() {
    const { user } = React.useContext(loginCtx);

    return (
        <nav className="nav-header">
            <span className="navlink">
                <NavLink activeClassName="navlink-active" to="/">首页</NavLink>
            </span>

            <span className="navlink">
                <NavLink to="/edit">Edit</NavLink>
            </span>
            
            <div className="to-right">
            {
                user && user.avatar && [
                    <span className="navlink" key="nhl-avatar-name">
                        { user.username }
                    </span>,
                    <span className="navlink avatar" key="nhl-avatar">
                        
                        <img src={ user.avatar } />
                    </span>
                ]
            }
            </div>
            
        </nav>
    );
}


