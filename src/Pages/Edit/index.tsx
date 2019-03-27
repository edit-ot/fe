import * as React from "react";
import Quill from "quill";
import { RouteComponentProps } from "react-router";

import "quill/dist/quill.snow.css";
import "./edit.less";
import { getDocById } from "./edit-api";


export type EditPageProps = RouteComponentProps<{
	docId: string
}>

export function EditPage(props: EditPageProps) {
    const { docId } = props.match.params;

    React.useEffect(() => {
        console.log('docId', docId, props.match);

        getDocById(+docId).then(console.log);

        const q = new Quill('#my-text-area', {
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'list'],
                    ['image', 'code-block'],
                    ['save']
                ]
            },
            theme: 'snow'  // or 'bubble'
        });

        

        q.on('text-change', function(delta, oldDelta, source) {
            if (source == 'api') {
                console.log("An API call triggered this change.");
            } else if (source == 'user') {
                console.log(delta, oldDelta, source);
                console.log("A user action triggered this change.");
            }
        });


        // @ts-ignore
        window.q = q;
    }, []);

    return (
        <div className="edit-main">
            <div id="my-text-area"></div>
        </div>
    );
}
