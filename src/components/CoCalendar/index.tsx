import * as React from "react";

import "./co-calendar.less";
import { CreatePopupComponent, popup$ } from "../../Ctx/Popup";
import { Group } from "../../Pages/Home/homeaside-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { WordCardCtxWrap, wordCardCtx } from "../WordCard";
import { DayList, DayListCtxWrap, dayListCtx } from "./DayList";
import { CalendarEditor } from "./CalendatEditor";
import { User } from "../Login";
import { HoverInfo } from "../HoverHandler";

export function showCoCalendar(group: Group) {
    popup$.push(CoCalendar, {
        group
    }, {
        style: { background: 'rgba(0, 0, 0, .5)' }
    });
}

export type CoCalendarProps = CreatePopupComponent<{
    group: Group
}>;

export function CoCalendar(props: CoCalendarProps) {
    return (
        <WordCardCtxWrap { ...props } use="calendar" path="/calendar">
            <wordCardCtx.Consumer>{ ctx => 
                <DayListCtxWrap wordCardCtx={ ctx }>{
                    ctx.loading ? (
                        <div>加载中</div>
                    ) : (
                        <div className="co-calendar-main">
                            <h1>日历
                                <span className="_calendar"><FontAwesomeIcon icon={ faCalendarAlt } /></span>
                                <div className="_msg">{ ctx.msg }</div>
                                <div className="_close" onClick={ props.pop }>
                                    <FontAwesomeIcon icon={ faTimes } />
                                </div>
                            </h1>

                            <CoCalendarInner />

                            <LoginedUsers users={ ctx.loginedUsers } />
                        </div>
                    )   
                }</DayListCtxWrap>
            }</wordCardCtx.Consumer>
        </WordCardCtxWrap>
    )
}

function LoginedUsers(props: { users: User[] }) {

    const $$ = props.users.map((u, i) => {
        return (
            <HoverInfo className="_user" key={ i } info={ u.username }
                onClick={() => {
                    window.open('/user/' + u.username);
                }}>
                <img src={ u.avatar } />
            </HoverInfo>
        )
    });

    return (
        <div className="_users">{ $$ }</div>
    );
}

export function CoCalendarInner() {
    return (
        <div className="co-calendar-inner">
            <DayList />
            {/* { JSON.stringify(ctx.words) } */}
            <CalendarEditor />
        </div>
    );
}
