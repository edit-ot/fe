import * as React from "react";

import "./change-permission-popup.less";

export type ChangePermissionPopupProps = {
    
}

export function ChangePermissionPopup(props: ChangePermissionPopupProps) {
    return (
        <div className="change-permission-popup-main">
            <h1>修改权限</h1>

            <input placeholder="搜索用户名" />
        </div>
    )
}
