import * as React from "react";

import "./file.less";
import { FileItem } from "../../components/GroupInfoUpdater/api";
import { getFilesRemote, uploadAnFile, deleteFileRemote } from "./file-api";
import { MIMETYPE_ICON_MAP, getMIMEIcon } from "./MIME-TYPE";
import { HoverInfo } from "../../components/HoverHandler";
import { getKey } from "../../components/CoCalendar/DayList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faLongArrowAltDown, faEye, faMagic, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { popup$ } from "../../Ctx/Popup";
import { PreviewSelected } from "../User";
import { toPreviewFile } from "./PreviewFile";
// import { ComponentSwitch } from "../../components/ComponentSwitch";

export type FilePageCtx = {
    initFiles: () => void;
    files: FileItem[];
    setFiles: (files: FileItem[]) => void;
    addFile: (file: FileItem) => void;

    theFile: FileItem;
    setTheFile: (file: FileItem) => void;
}

export const filePageCtx = React.createContext({} as FilePageCtx);

export function FilePage() {
    const [theFile, setTheFile] = React.useState(null as FileItem);
    const [files, setFiles] = React.useState([] as FileItem[]);

    const initFiles = () => {
        getFilesRemote().then(setFiles);
    }

    React.useEffect(initFiles, []);

    const addFile = (file: FileItem) => {
        setFiles(files.concat(file));
    }

    return (
        <filePageCtx.Provider value={{
            initFiles,
            files, setFiles, addFile,

            theFile, setTheFile
        }}>
            <div className="file-page-outter">
                <RenderFiles files={ files } />
                { theFile && <FileDetail /> }
            </div>
        </filePageCtx.Provider>
    )
}

function RenderFiles(props: { files: FileItem[] }) {
    const ctx = React.useContext(filePageCtx);

    const list = props.files.map((f, i) => {
        return <OneFile key={ i } file={ f } />
    });
    
    return (
        <div className="file-page">
            <input hidden id="file-upload" type="file" onChange={e => {
                if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    uploadAnFile(file).then(ctx.addFile);
                }
            }} />
            <h1>我的文件</h1>
            
            { list }

            { list.length ? (
                <div className="one-file add-file">
                    <label htmlFor="file-upload"
                        className="_align"><FontAwesomeIcon icon={ faPlus } /></label>
                </div>
            ) : (
                <div className="no-file">
                    <div className="_icon">
                        <FontAwesomeIcon icon={ faMagic } />
                    </div>
                    <div className="_text">暂无文件</div>
                    <label htmlFor="file-upload" className="_add">点击添加</label>
                </div>
            )} 
        </div>
    )
}

function FileDetail() {
    const ctx = React.useContext(filePageCtx);

    const Line = (field: string, value: string) => {
        return (
            <div className="_line">
                <div className="_field">{ field }</div>
                <div className="_value">{ value }</div>
            </div>
        )
    }

    return (
        <div className="file-detail">
            <div className="mime-icon">
                <img src={ getMIMEIcon(ctx.theFile) } />
            </div>
            <div className="text-area">
                { Line('文件名', ctx.theFile.fileName) }
                { Line('文件大小', ctx.theFile.size.toString() + ' B') }
                { Line('URL', ctx.theFile.URL) }
                { Line('创建时间', new Date(ctx.theFile.cratedAt).toLocaleDateString()) }
                { Line('文件 ID', ctx.theFile.fileId) }
                { Line('文件所有者', ctx.theFile.owner) }
                { Line('MIME_Type', ctx.theFile.type) }

                <div className="_icons">
                    <HoverInfo className="_icon" info="预览" onClick={() => {
                        toPreviewFile(ctx.theFile);
                    }}>
                        <FontAwesomeIcon icon={ faEye } />                        
                    </HoverInfo>
                    <HoverInfo className="_icon" info="下载" onClick={() => {
                        window.open(ctx.theFile.URL);
                    }}>
                        <FontAwesomeIcon icon={ faLongArrowAltDown } />
                    </HoverInfo>
                    <HoverInfo className="_icon" info="删除" onClick={() => {
                        window.confirm('你确定吗？') && 
                            deleteFileRemote(ctx.theFile).then(ctx.initFiles) && 
                            ctx.setTheFile(null);
                    }}>
                        <FontAwesomeIcon icon={ faTrashAlt } />
                    </HoverInfo>
                </div>
            </div>
        </div>
    );
}

export function OneFile({ file }: { file: FileItem }) {
    const ctx = React.useContext(filePageCtx);

    return (
        <HoverInfo
            onClick={ () => ctx.setTheFile(file) }
            className="one-file" info={`创建于${ getKey(new Date(file.cratedAt)) }`}>
            <div>
                <div className="img-outter" >
                    <img src={ getMIMEIcon(file) } />
                </div>
                <div className="file-name">
                    { file.fileName }
                </div>
            </div>
        </HoverInfo>
    )
}
