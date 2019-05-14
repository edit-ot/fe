import * as React from "react";

import "./group-punch.less";
import { CreatePopupComponent, popup$ } from "../../Ctx/Popup";
import { getGroup, Group } from "../../Pages/Home/homeaside-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faTimesCircle, faArrowCircleRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { HoverInfo } from "../HoverHandler";
import { Calendar } from "../Calendar";
import { getPunchInfo, toPunchRemote, Punch, DateMap, getKeyFromDate, punchesToMap } from "./group-punch-api";
import cls from "classnames";
import { OthersPunch } from "./OthersPunch";

export type GroupPunchProps = CreatePopupComponent<{
    groupId: string,
    usernanme: string
}>


function CalendarItem({ d, className }: { d: Date, className?: string }) {
    return (
        <div className={ cls('punch-day', className) }>{ d.getDate() }</div>
    )
}


function openOthers(group: Group) {
    popup$.push(OthersPunch, {
        group
    }, {
        style: { background: 'rgba(0, 0, 0, .5)' }
    });
}



export function GroupPunch(props: GroupPunchProps) {
    const [loading, setLoading] = React.useState(true);
    const [group, setGroup] = React.useState(null as null | Group);
    const [punches, setPunches] = React.useState([] as Punch[]);
    
    const [map, setMap] = React.useState({} as DateMap);
    const [n, setN] = React.useState(0);

    const initPunches = (punches$: Punch[]) => {
        console.log('punches', punches$);
        const m = punchesToMap(punches$)

        setMap(m);
        setPunches(punches$);

        if (punches$.length) {
            setN(punches$[0].nDayBefore);
        }
    }

    const init = () => {
        setLoading(true);

        getGroup(props.groupId).then(setGroup).then(() => {
            setLoading(false);
        });

        getPunchInfo(props.usernanme, props.groupId).then(initPunches);
    }


    React.useEffect(init, []);

    const toPunch = () => {
        toPunchRemote(props.groupId).then(() => {
            initPunches([{
                date: new Date().toString(),
                groupId: props.groupId,
                nDayBefore: n + 1,
                username: props.usernanme,
            }, ...punches]);
        }).catch(({ code, msg }) => {
            if (code === 403) {
                alert(msg);
            }
        });
    }

    const _today_ = new Date();
    const _today_key_ = getKeyFromDate(_today_);
    const _tomonth_ = ('00' + (_today_.getMonth() + 1).toString()).slice(-2);

    return (
        loading ? (
            <div className="group-punch-main" style={{ textAlign: 'center' }}>Loading</div>
        ) : (
            <div className="group-punch-main">
                <h1>打卡签到</h1>

                <div className="check-in-btn" onClick={ toPunch }>
                    <HoverInfo info="点击签到">
                        <FontAwesomeIcon icon={ faCalendarCheck } />
                    </HoverInfo>
                </div>
                {/* { props.groupId } */}

                <Calendar
                    date={ _today_ }
                    generator={ d => {
                        const k = getKeyFromDate(d);
                        return <CalendarItem d={ d } className={cls({
                            punched: map[k],
                            today: k === _today_key_
                        })} />;
                    } } />

                <div className="punch-info">
                    <div className="_month">
                        { _tomonth_ } 月
                    </div>
                    <div>已连续签到 { n } 天</div>
                </div>


                <div className="close-btns">
                    <HoverInfo className="_btn" info="点击关闭" onClick={ props.pop }>
                        <FontAwesomeIcon icon={ faTimesCircle } />
                    </HoverInfo>

                    <HoverInfo className="_btn" info="其他人的打卡记录" onClick={ () => openOthers(group) }>
                        <FontAwesomeIcon icon={ faArrowCircleRight } />
                    </HoverInfo>
                </div>
            </div>
        )
        
    )
}


export type GroupPunchStaticProps = CreatePopupComponent<{
    title: string,
    n: number,
    map: DateMap
}>;

export function GroupPunchStatic(props: GroupPunchStaticProps) {
    const { title, n, map } = props;

    const _today_ = new Date();
    const _today_key_ = getKeyFromDate(_today_);
    const _tomonth_ = ('00' + (_today_.getMonth() + 1).toString()).slice(-2);

    return (
        <div className="group-punch-main">
            <h1>{ title }
                <div className="_close" onClick={ props.pop }>
                    <FontAwesomeIcon icon={ faTimes } />
                </div>
            </h1>
            <Calendar
                date={ _today_ }
                generator={ d => {
                    const k = getKeyFromDate(d);
                    return <CalendarItem d={ d } className={cls({
                        punched: map[k],
                        today: k === _today_key_
                    })} />;
                } } />

            <div className="punch-info">
                <div className="_month">
                    { _tomonth_ } 月
                </div>
                <div>已连续签到 { n } 天</div>
            </div>
        </div>
    )
}
