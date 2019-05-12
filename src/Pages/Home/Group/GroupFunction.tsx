import * as React from "react";
import { Group } from "../homeaside-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faHatWizard, faHandPeace } from "@fortawesome/free-solid-svg-icons";

import "./group-function.less";
import { popup$ } from "../../../Ctx/Popup";
import { WordCard } from "../../../components/WordCard";
import { GroupPunch } from "../../../components/GroupPunch";

export type GroupFunctionProps = {
    group: Group
}

export function GroupFunction(props: GroupFunctionProps) {
    const openPunch = () => {
        popup$.push(GroupPunch, {
            groupId: props.group.groupId
        }, {
            style: { background: 'rgba(0, 0, 0, .5)' }
        })
    }

    const openCalendar = () => {
        window.location.href = `/calendar/${ props.group.groupId }`
    }

    const openCard = () => {
        popup$.push(WordCard, {
            groupId: props.group.groupId
        }, {
            style: { background: 'rgba(0, 0, 0, .5)' }
        });
    }

    return (
        <div className="group-function-main">
            <div className="calendar func" onClick={ openPunch }>
                <FontAwesomeIcon icon={ faHandPeace } />
                <span>打卡</span>
            </div>

            <div className="calendar func" onClick={ openCalendar }>
                <FontAwesomeIcon icon={ faCalendar } />
                <span>小组日历</span>
            </div>

            <div className="words func" onClick={ openCard }>
                <FontAwesomeIcon icon={ faHatWizard } />
                <span>小组单词卡</span>
            </div>
        </div>
    )
}
