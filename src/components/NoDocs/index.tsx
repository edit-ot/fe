import * as React from "react";
import { faDove } from '@fortawesome/free-solid-svg-icons'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./no-docs.less";

export type NoDocsProps = {
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => any
}

export function NoDocs(props: NoDocsProps) {
    return (
        <div className="no-docs">
            <FontAwesomeIcon className="_icon" icon={ faDove } />
            <div className="_text">暂无文档</div>
            <div className="_btn" onClick={ props.onClick }>新建文档</div>
        </div>
    )
}
