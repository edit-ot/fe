import * as React from "react";
import { DocInfo } from "./doc-api";
import { NavLink } from "react-router-dom";
import { date2str } from "../../../utils/date2str";
import { faFile, faTrashAlt } from '@fortawesome/free-solid-svg-icons'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./doc-file.less";

export type DocFileProps = {
    doc: DocInfo,

    onDelete?: (doc: DocInfo) => any
}

export function DocFile({ doc, onDelete }: DocFileProps) {
    return (
        <NavLink className="doc-file-main" to={`/edit?docId=${ doc.id }`}>
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

            <div className="doc-operation">
                <span  onClick={ e => {
                    e.preventDefault();
                    onDelete && onDelete(doc);
                }}>
                    <FontAwesomeIcon icon={ faTrashAlt }/>
                </span>
                
            </div>
        </NavLink>
    );       
}
