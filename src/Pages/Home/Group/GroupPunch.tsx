import * as React from "react";
import { Group } from "../homeaside-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faHatWizard } from "@fortawesome/free-solid-svg-icons";

import "./group-punch.less";

export type GroupPunchProps = {
    group: Group
}

export function GroupPunch(props: GroupPunchProps) {
    const openCalendar = () => {
        
    }

    const openCard = () => {

    }

    return (
        <div className="group-punch-main">
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
