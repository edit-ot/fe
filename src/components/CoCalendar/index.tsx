import * as React from "react";

import "./co-calendar.less";
import { CreatePopupComponent, popup$ } from "../../Ctx/Popup";
import { Group } from "../../Pages/Home/homeaside-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { WordCardCtxWrap, wordCardCtx } from "../WordCard";

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
    const content = (
        <div className="word-card-main">
            <h1>日历
                <div className="_close" onClick={ props.pop }>
                    <FontAwesomeIcon icon={ faTimes } />
                </div>

                <CoCalendarInner />
            </h1>
        </div>
    );

    return (
        <WordCardCtxWrap { ...props } use="calendar" path="/calendar">
            <wordCardCtx.Consumer>{ ctx => 
                ctx.loading ? (
                    <div>加载中</div>
                ) : (
                    content
                )
            }</wordCardCtx.Consumer>
        </WordCardCtxWrap>
    )
}

export function CoCalendarInner() {
    return (
        <div>CoCalendarInner</div>
    )
}
