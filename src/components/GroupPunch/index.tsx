import * as React from "react";

import "./group-punch.less";
import { CreatePopupComponent } from "../../Ctx/Popup";

export type GroupPunchProps = CreatePopupComponent<{
    groupId: string
}>

export function GroupPunch(props: GroupPunchProps) {
    return (
        <div className="group-punch-main">
            <h1>打卡</h1>
            { props.groupId }
        </div>
    )
}

