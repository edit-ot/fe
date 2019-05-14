import * as React from "react";
import cls from "classnames";

import "./calendar.less";

type CLine = React.ReactNode[]
type CalendarData = CLine[];


function CLine(props: { data: CLine, className?: string }) {
    const l = props.data.map((u, i) => {
        return (
            <div className="c-item" key={ i }><div>{ (u === null) ? '-' : u }</div></div>
        )
    });

    return (
        <div className={ cls('c-line', props.className) }>{ l }</div>
    );
}


export type DateItemGenerator<T> = (date: Date) => T;

export function getCalendarData<T>(
    firstDay: Date,
    endDay: Date,
    generator: DateItemGenerator<T>
): (T|null)[][] {
    if (+firstDay > +endDay) return [];

    let $ = firstDay;
    const d = firstDay.getDay();
    let line: (T|null)[] = new Array(d).fill(null);

    for (;;) {
        line.push(
            generator($)
        );

        $ = new Date($.getTime() + 86400000);

        if ($.getDay() === 0 || $.getDate() === 1) {
            break;
        }
    }

    if (line.length !== 7) {
        line = line.concat(new Array(7 - line.length).fill(null));
    }
    
    return [
        line, 
        ...getCalendarData(
            $,
            endDay,
            generator
        )
    ];
}


export type CalendarProps = {
    date: Date | string,
    generator: DateItemGenerator<React.ReactNode>
}

export function Calendar(props: CalendarProps) {
    const d = typeof props.date === 'string' ?
        new Date(props.date) :
        props.date;

    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    const firstDay = new Date(`${year}-${month}-1`);
    const endDay = new Date((+new Date(`${year}-${month + 1}-1`)) - 86400000);

    const cds = getCalendarData(firstDay, endDay, props.generator);

    const list = cds.map((cd, i) => {
        return <CLine data={ cd } key={ i } />
    });

    return (
        <div className="calendar-main">
            <CLine className="work"
                data={ ['天', '一', '二', '三', '四', '五', '六'] } />
            { list }
        </div>
    )
}
