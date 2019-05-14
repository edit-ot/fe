import * as React from "react";
import { CreatePopupComponent, popup$ } from "../../Ctx/Popup";

import "./others-punch.less";
import { Group } from "../../Pages/Home/homeaside-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { getGroupPunchPK, PunchPKUserInfo, getPunchInfo, punchesToMap } from "./group-punch-api";
import { HoverInfo } from "../HoverHandler";
import { GroupPunchStatic } from ".";

export type OthersPunchProps = CreatePopupComponent<{
    group: Group
}>;


function TheUserLine(props: { pk: PunchPKUserInfo, onClick: () => void }) {
    const { pk, onClick } = props;

    return (
        <div className="_userline">
            <img className="_avatar" src={ pk.avatar } />
            <div className="_username">{ pk.username }</div>
            <div className="_n">{ pk.n }</div>
            <div className="_detail" onClick={ onClick }>
                <HoverInfo info="查看签到详情">
                    <FontAwesomeIcon icon={ faInfoCircle } />
                </HoverInfo>
            </div>
        </div>
    )
}

export function OthersPunch(props: OthersPunchProps) {
    const [loading, setLoading] = React.useState(true);
    const [pkInfos, setPkInfos] = React.useState([] as PunchPKUserInfo[]);

    React.useEffect(() => {
        getGroupPunchPK(props.group.groupId).then(setPkInfos).then(() => {
            setLoading(false);
        });
    }, []);

    const content = (
        <div className="others-punch-inner">
            <div className="_userline _header">
                <div className="_avatar" />
                <div className="_username">用户</div>
                <div className="_n">连续签到天数</div>
                <div className="_detail"></div>
            </div>

            { pkInfos.map((pk, key) => {
                return (
                    <TheUserLine key={ key } pk={pk} onClick={() => {
                        getPunchInfo(pk.username, props.group.groupId).then(punches => {
                            const map = punchesToMap(punches);
                            const n = punches.length ? punches[0].nDayBefore : 0;

                            popup$.push(GroupPunchStatic, {
                                map, n, 
                                title: `${ pk.username } 的签到记录`
                            }, {
                                style: { background: 'rgba(0, 0, 0, .5)' }
                            });
                        })
                    }} />
                )
            }) }
        </div>
    )
    
    return (
        <div className="others-punch-main">
            <h1>小组打卡记录榜
                <div className="_close" onClick={ props.pop }>
                    <FontAwesomeIcon icon={ faTimes } />
                </div>
            </h1>
            
            { loading ? 'Loading ...' : content }
        </div>
    )

}
