import * as React from "react";

import "./aside.less";

export type AsideProps = React.PropsWithChildren<{
    width?: number | string,
    paddingTop?: number | string
}>

export function Aside(props: AsideProps) {
    const { width, paddingTop } = props;

    return (
        <div className="aside-main" style={{
            width: width || '200px',
            paddingTop: paddingTop || '48px',
            zIndex: 999
        }}>
            { props.children }
        </div>
    )
}
