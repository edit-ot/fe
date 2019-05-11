import * as React from "react";

export type FontIconProps = {
    icon: string
}

export function FontIcon(props: FontIconProps) {
    const __html = `<use xlink:href="#${ props.icon }"></use>`;

    return (
        <span className="font-icon">
            <svg  aria-hidden="true" dangerouslySetInnerHTML={{ __html }} />
        </span>
    );
}

