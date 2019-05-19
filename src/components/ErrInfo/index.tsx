import * as React from "react";

import "./errinfo.less"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCarCrash } from "@fortawesome/free-solid-svg-icons";

export type ErrInfoProps = {
    title?: string;
    intro?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode
}

export function ErrInfo(props: ErrInfoProps) {
    return (
        <div className="error-info-main">
            <div className="error-info-inner">
                <div className="_icon">
                    { props.icon ? props.icon :
                        <FontAwesomeIcon icon={ faCarCrash } />}
                </div>
                <div>
                    <h1>{ props.title ? props.title : '拒绝访问'}</h1>
                    <p>{ props.intro ? props.intro : '对不起，你没有该小组的访问权限，因此无法访问' }</p>

                    <div>{ props.children || null }</div>
                </div>
            </div>
        </div>
    )
}
