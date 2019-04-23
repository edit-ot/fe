import * as React from "react";

import "./hover-handler.less";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";

export type HoverHandleProps = React.PropsWithChildren<{
    hoverComponent: React.ReactNode
}>

export function HoverHandler(props: HoverHandleProps) {
    return (
        <div className="hover-info-main">
            { props.children }

            <div className="hover-info-hidden-one">
                { props.hoverComponent }
            </div>
        </div>
    )
}

export type HoverInfoProps = React.PropsWithChildren<{
    info: string
}>

export function HoverInfo(props: HoverInfoProps) {
    const hoverInfo = (
        <div className="hover-info-main">
            { props.info }
        </div>
    );
    
    return (
        <HoverHandler hoverComponent={ hoverInfo }>
            { props.children }
        </HoverHandler>
    )
}
 