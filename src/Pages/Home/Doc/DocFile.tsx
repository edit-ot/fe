import * as React from "react";
import { DocInfo } from "./doc-api";
import { NavLink } from "react-router-dom";
import { date2str } from "../../../utils/date2str";
import { faFile, faCog } from '@fortawesome/free-solid-svg-icons'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./doc-file.less";
import { SideBtn } from "../../../components/SideBtn";

export type DocFileProps = {
    doc: DocInfo,

    onDelete?: (doc: DocInfo) => any
}

export function DocFile({ doc, onDelete }: DocFileProps) {
    return (
        <NavLink className="doc-file-main" to={`/edit/${ doc.id }`}>
            <div>
                <div className="_left">
                    <FontAwesomeIcon icon={ faFile } />
                </div>
                <div className="_right">
                    <div className="doc-title">{ doc.title }</div>
                    <div className="doc-info">
                        <span>{ date2str(doc.createAt) }</span>
                        <span>{ doc.owner }</span>
                    </div>
                </div>
            </div>

            <SideBtn icon={ faCog } slides={[
                {
                    name: 'shit2'
                },
                {
                    name: 'shit1',
                    inner: [
                        {
                            name: 'inner1'
                        }, {
                            name: 'inner2'
                        }, {
                            name: 'inner3'
                        }
                    ]
                },
                
                {
                    name: 'shit3'
                },
                {
                    name: 'shit4'
                }
            ]} />
            {/* <div className="doc-operation">
                <FontAwesomeIcon icon={ faCog }/>
            </div> */}
        </NavLink>
    );       
}
