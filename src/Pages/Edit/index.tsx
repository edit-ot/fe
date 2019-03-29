import * as React from "react";
import Quill from "quill";
import { RouteComponentProps } from "react-router";

import "quill/dist/quill.snow.css";
import "./edit.less";
import { getDocById } from "./edit-api";
import { DocInfo } from "../Home/Doc/doc-api";
// import { Delta } from "edit-ot-quill-delta";


export type EditPageProps = RouteComponentProps<{
	docId: string
}>

export function EditPage(props: EditPageProps) {
    const [doc, setDoc] = React.useState(null as null | DocInfo);

    const { docId } = props.match.params;

    React.useEffect(() => {
        console.log('docId', docId, props.match);

        getDocById(+docId).then(resp => {
            if (resp.code === 200 && resp.data) {
                setDoc(resp.data);
            }
        });

        const toolbarOptions = [
            [{ container: 'my-toolbar' }],
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block'],
            ['save']
        ];

        // @ts-ignore
        toolbarOptions.container = '#my-toolbar';

        const q = new Quill('#my-text-area', {
            modules: {
                toolbar: `#my-toolbar`,
                // toolbar: [
                //     [{ container: '#my-toolbar' }],
                //     [{ header: [1, 2, false] }],
                //     ['bold', 'italic', 'underline'],
                //     ['image', 'code-block'],
                //     ['save']
                // ],
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

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
    }

    return (
        <div className="edit-main">
            <div id="my-toolbar">
                {
                    React.createElement('select', {
                        className: 'ql-size',
                    }, [
                        <option value="small" key="qls-small" />,
                        React.createElement('option', {
                            selected: true
                        }),
                        <option value="large" key="qls-large"></option>,
                        <option value="huge" key="qls-huge"></option>
                    ])
                }
                <button className="ql-bold"></button>
                <button className="ql-link"></button>
                <button className="ql-image"></button>

                {/* <button className="ql-script" value="sub"></button> */}
                {/* <button className="ql-script" value="super"></button> */}
            </div>
            
            { doc ? (
                <div className="title-edit">
                    <input type="text" defaultValue={ doc.title }
                        onChange={ onTitleChange } />
                </div>
            ) : (
                <div className="title-edit loading">加载中...</div>
            ) }
            

            <div id="my-text-area"></div>
        </div>
    );
}
