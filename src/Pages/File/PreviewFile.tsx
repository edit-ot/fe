import * as React from "react";
import { CreatePopupComponent, popup$ } from "../../Ctx/Popup";
import { FileItem } from "../../components/GroupInfoUpdater/api";

import "./preview-file.less";
import { getFileType } from "./MIME-TYPE";
import { HoverInfo } from "../../components/HoverHandler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

export type PreviewFileProps = CreatePopupComponent<{
    file: FileItem
}>;

export function toPreviewFile(file: FileItem) {
    popup$.push(PreviewFile, { file }, {
        style: { background: 'rgba(0, 0, 0, .5)' }
    });
}



export function PreviewFile(props: PreviewFileProps) {
    const type = getFileType(props.file);
    
    
    return (
        <div className="preview-file-main">
            {
                type === 'IMAGE' && <ImgPreview { ...props.file } /> 
            }
            {
                type === 'TEXT' && <TextPreview { ...props.file } />
            }

            {
                type === 'UNKNWON' && <NoPreview />
            }

            <div className="close-btns">
                <HoverInfo className="_btn" info="点击关闭" onClick={ props.pop }>
                    <FontAwesomeIcon icon={ faTimesCircle } />
                </HoverInfo>
            </div>
        </div>
    )
}

function ImgPreview(file: FileItem) {
    return (
        <div className="image-preview">
            <img src={ file.URL } alt="" />
        </div>
    )
}

function TextPreview(file: FileItem) {
    const [loading, setLoading] = React.useState(true);
    const [text, setText] = React.useState(null);

    React.useEffect(() => {
        fetch(file.URL).then(d => d.text()).then(remoteText => {
            setText(remoteText);
            setLoading(false);
        });
    }, []); 

    return (
        <div className="text-preview">
            <pre>{ text }</pre>
        </div>
    );
}

function NoPreview() {
    return (
        <div className="no-preview">未知的文件类型，无法预览</div>
    )
}
