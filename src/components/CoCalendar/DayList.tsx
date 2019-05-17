import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import EventEmitter from "wolfy87-eventemitter";
import { WordCardCtx } from "../WordCard";
import cls from "classnames";

export function getKey(d: Date) {
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

const ONEDAY_LENGTH = 86400000;

export function getDatelrn(d: Date, n = 3) {
    return new Array(2 * n + 1).fill(0).map((_, i) => {
        const offset = (i - n);
        const o = offset * ONEDAY_LENGTH;

        return new Date(d.getTime() + o);
    });
}

const workMap = [
    '星期天', '星期一', '星期二', '星期三',
    '星期四', '星期五', '星期六'
];

const monthMap = [
    '一月', '二月',   '三月',   '四月',
    '五月', '六月',   '七月',   '八月',
    '九月', '十月', '十一月', '十二月'
];

function OneDay({ d }: { d: Date }) {
    const date = d.getDate();
    const workDay = d.getDay();
    const month = d.getMonth();

    return (
        <div className="one-day">
            <div>
                <div className="_month">{ monthMap[month] }</div>
                <div className="_date">{ date }</div>
                <div className="_work">{ workMap[workDay] }</div>
            </div>
        </div>
    )
}

export type DayListCtx = {
    bus: EventEmitter;
    nowDate: Date;
    setNowDate: (newDate: Date) => void;
    wordCardCtx: WordCardCtx;
}

export const dayListCtx = React.createContext({} as DayListCtx);

export function DayListCtxWrap(props: React.PropsWithChildren<{
    wordCardCtx: WordCardCtx
}>) {
    const [bus] = React.useState(new EventEmitter());
    const [nowDate, setNowDate] = React.useState(new Date());
    
    return (
        <dayListCtx.Provider value={{
            bus, 
            nowDate, setNowDate, 
            wordCardCtx: props.wordCardCtx
        }}>{
            props.children
        }</dayListCtx.Provider>
    )
}

export function DayList() {
    const ctx = React.useContext(dayListCtx);

    const toL = () => {
        console.log('toL');
        ctx.setNowDate(new Date(ctx.nowDate.getTime() - ONEDAY_LENGTH));
    }

    const toR = () => {
        console.log('toR');
        ctx.setNowDate(new Date(ctx.nowDate.getTime() + ONEDAY_LENGTH));
    }

    const list = getDatelrn(ctx.nowDate, 4).map((d, i) => {
        const witdh = ((i - 1) * 14) + 8;
        const key = getKey(d);

        return (
            <div
                onClick={() => ctx.setNowDate(d)}
                className={cls({
                    'has-record': !!ctx.wordCardCtx.wordMap[ key ]
                })}
                style={{
                    left: witdh + '%'
                }}
                key={ key }>
                <OneDay d={d} />
            </div>
        );
    });

    return (
        <div className="day-list-main">
            <div className="day-list">
                { list }
            </div>

            <div className="_to-l" onClick={ toL }>
                <FontAwesomeIcon icon={ faAngleLeft } />
            </div>
            <div className="_to-r" onClick={ toR }>
                <FontAwesomeIcon icon={ faAngleRight } />
            </div>

            <div className="_top">
                <FontAwesomeIcon icon={ faAngleUp } />
            </div>
        </div>
    )
}