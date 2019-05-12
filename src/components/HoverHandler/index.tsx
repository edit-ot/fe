import * as React from "react";

import "./hover-handler.less";

export type HoverHandleProps = React.PropsWithChildren<{
    hoverComponent: React.ReactNode,
    className?: string,
    onClick?: () => void
}>

export function HoverHandler(props: HoverHandleProps) {
    const clsn = 'hover-handler-main ' + (props.className || '');

    return (
        <div className={ clsn } onClick={ e => props.onClick && props.onClick() }>
            { props.children }

            <div className="hover-info-hidden-one">
                { props.hoverComponent }
            </div>
        </div>
    )
}

export type HoverInfoProps = React.PropsWithChildren<{
    info: React.ReactNode | string,
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
 