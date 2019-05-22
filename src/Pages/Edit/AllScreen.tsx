import * as React from "react";
import { Delta } from "edit-ot-quill-delta";
import { CreatePopupComponent, popup$ } from "../../Ctx/Popup";
import Quill from "quill";

import "./all-screen.less";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export function allScreen(title: string, q: Quill) {
    const delta = q.getContents();
    delta.forEach(op => {
        if (op.attributes) {
            delete op.attributes.author
        }
    });

    popup$.push(AllScreen, {
        delta: new Delta(delta.compose(new Delta())),
        title
    }, {
        style: { background: 'rgb(240, 240, 240)' }
    });
}

export function AllScreen(props: CreatePopupComponent<{ delta: Delta, title: string }>) {
    const [q, setQ] = React.useState(null);

    React.useEffect(() => {
        const q = new Quill('#all-screen-edit', {
            modules: {
                toolbar: null
            },
            // theme: 'snow'  // or 'bubble'
        });

        q.setContents(props.delta);

        q.disable();

        setQ(q);
    }, []);

    return (
        <div className="all-screen-main">
            <div className="_close" onClick={ props.pop }>
                <FontAwesomeIcon icon={ faTimes } />
            </div>
            <h1>{ props.title }</h1>
            <div id="all-screen-edit"></div>
        </div>
    )
}
