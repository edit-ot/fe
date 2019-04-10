import * as React from "react";

export type ClickHandlerProps = {
    onRect: (rect: ClientRect | DOMRect) => void,
    className?: string, 
    preventDefault?: boolean,
    persist?: boolean,
    // children: <T>(ref: React.RefObject<T>) => React.ReactNode

    children: (ref: React.RefObject<any>) => React.ReactElement
}

export function ClickHandler(props: ClickHandlerProps) {
    const $target = React.useRef<any>();

    if (props.children && typeof props.children === 'function') {
        const compo = props.children($target);
        
        return React.cloneElement(compo, {
            className: props.className,
            onClick(e) {
                props.preventDefault && e.preventDefault();
                props.persist && e.persist();
                props.onRect($target.current.getBoundingClientRect());
            }
        });
    } else {
        return null;
    }
}
