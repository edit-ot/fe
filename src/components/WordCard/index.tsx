import * as React from "react";

import "./wordcard.less";
import { CreatePopupComponent } from "../../Ctx/Popup";

export type WordCardProps = CreatePopupComponent<{
    groupId: string
}>

export function WordCard(props: WordCardProps) {
    return (
        <div className="word-card-main">
            <h1>小组单词卡</h1>
            { props.groupId }
        </div>
    )
}

