import * as React from "react";

import "./hover-handler.less";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";

export type HoverHandleProps = React.PropsWithChildren<{
    hoverComponent: React.ReactNode,
    onClick?: () => void
}>

export function HoverHandler(props: HoverHandleProps) {
    return (
        <div className="hover-handler-main" onClick={ e => props.onClick && props.onClick() }>
            { props.children }

            <div className="hover-info-hidden-one">
                { props.hoverComponent }
            </div>
        </div>
    )
}

export type HoverInfoProps = React.PropsWithChildren<{
    info: string,
    onClick?: () => void
}>

export function HoverInfo(props: HoverInfoProps) {
    const hoverInfo = (
        <div className="hover-info-main">
            { props.info }
        </div>
    );
    
    return (
        <HoverHandler hoverComponent={ hoverInfo } onClick={ props.onClick }>
            { props.children }
        </HoverHandler>
    )
}
 