import * as React from "react";
import cls from "classnames";

import "./toggle-btn.less";

export type ToggleProps = React.PropsWithChildren<{
    active?: boolean,
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}>

export function ToggleBtn(props: ToggleProps) {

    return (
        <div className={cls({
            'toggle-btn-main': true,
            '_active': props.active
        })} onClick={ e => props.onClick && props.onClick(e) }>
            <span className="_dot"></span>
            
            { props.children }
        </div>
    );
}
