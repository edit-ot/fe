import * as React from "react";
import { DocInfo } from "./doc-api";
import { NavLink } from "react-router-dom";
import { date2str } from "../../../utils/date2str";
import { faFile, faCog } from '@fortawesome/free-solid-svg-icons'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SideBtn, SlideItem } from "../../../components/SideBtn";

import "./doc-file.less";
import { MenuBtns } from "../../../components/MenuBtns";

export type DocFileProps = {
    doc: DocInfo,
    slides: SlideItem[],
    initVisible?: boolean
}

export function DocFile({ doc, slides, initVisible }: DocFileProps) {
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

            <MenuBtns className="fa-cog-icon" slides={ slides }>{
                ref =>
                    <span ref={ ref }> 
                        <FontAwesomeIcon icon={ faCog } />
                    </span>
            }</MenuBtns>

            {/* <SideBtn initVisible={ !!initVisible }
                icon={ faCog }
                isAbsoulte={ true }
                slides={ slides } /> */}
        </NavLink>
    );
}
