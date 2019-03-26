import * as React from "react";

export type HomeAsideProps = {}

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faFolder, faDownload } from '@fortawesome/free-solid-svg-icons'; 
import { NavLink } from "react-router-dom";
    

import "./homeaside.less";

export function HomeAside(props: HomeAsideProps) {
    return (
        <div className="home-aside-main">
            <NavLink className="line" to="/home/docs"
                activeClassName="line-active"
                isActive={ match => match && match.url && match.url.startsWith('/home/docs') }>
                <FontAwesomeIcon icon={ faFolder } />
                <span className="text">我的文档</span>
            </NavLink>

            <NavLink className="line" to="/home/files"
                activeClassName="line-active"
                isActive={ match => match && match.url && match.url.startsWith('/home/files') }>
                <FontAwesomeIcon icon={ faDownload } />
                <span className="text">我的文件</span>
            </NavLink>
        </div>
    )
}
