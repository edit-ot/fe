import * as React from "react";

import "./create-btn.less";

export type CreateBtnProps = React.PropsWithChildren<{
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => any,
    className?: string
}>


export function CreateBtn({ onClick, children, className }: CreateBtnProps) {
    const toReplace = children || '新建文档';

    return (
        <div className={ 'doc-create-btn ' + className || '' } onClick={ onClick }>
            { toReplace }
        </div>
    );
}
