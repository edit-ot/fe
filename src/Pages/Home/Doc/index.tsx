import * as React from "react";
import { getDoc, DocInfo, createBlankDoc } from "./doc-api";
import { NavLink } from "react-router-dom";
import { NoDocs } from "../../../components/NoDocs";



export function Doc() {
    const [docs, setDocs] = React.useState([] as DocInfo[]);

    const initDocs = () => {
        getDoc()
            .then(docs => docs && setDocs(docs))
            .catch(console.error);
    }

    React.useEffect(initDocs, []);

    const onCreateDoc = e => {
        createBlankDoc().then(resp => {
            if (resp.code === 200 && resp.data) {
                initDocs();
            } else {
                console.error(resp);
            }
        }).catch(console.error);
    }
 

    return docs.length === 0 ? <NoDocs onClick={ onCreateDoc } /> : (
        <div className="doc-main">
            {
                docs.map((doc, idx) => {
                    return (
                        <NavLink to={`/edit?docId=${ doc.id }`} key={ idx }>
                            { doc.title }
                        </NavLink>
                    );
                })
            }
        </div>
    )
}
