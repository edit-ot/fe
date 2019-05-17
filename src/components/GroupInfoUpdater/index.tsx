import * as React from "react";

import "./group-info-updater.less";
import { CreatePopupComponent, popup$ } from "../../Ctx/Popup";
import { Group } from "../../Pages/Home/homeaside-api";
import { CreateBtn } from "../NoDocs/CreateBtn";
import { Avatar } from "../Avatar";
import { PreviewSelected } from "../../Pages/User";
import { updateGroupInfo, useTextAvatarRemote } from "./api";
import { globalBus } from "../../utils/GlobalBus";

export type GroupInfoUpdaterProps = CreatePopupComponent<{
    group: Group
}>

export function GroupInfoUpdater(props: GroupInfoUpdaterProps) {
    const $name = React.createRef<HTMLInputElement>();
    const $intro = React.createRef<HTMLInputElement>();
    const $file = React.createRef<HTMLInputElement>();

    const [fileName, setFileName] = React.useState(null);
    const [group, setGroup] = React.useState(props.group);
    const [groupName$, setGroupName$] = React.useState(group.groupName);
    const [groupIntro$, setGroupIntro$] = React.useState(group.groupIntro);
    const [cropped, setCropped] = React.useState(null as null | HTMLCanvasElement);

    const toSave = () => {
        const name = $name.current.value;
        const intro = $intro.current.value;

        console.log('toSave', name, intro);

        updateGroupInfo(group.groupId, name, intro, fileName, cropped).then(g => {
            globalBus.emit('UpdateGroupInfo', {
                groupName: g.groupName,
                groupIntro: g.groupIntro,
                groupAvatar: g.groupAvatar
            });
            props.pop();

            // setGroup(g);
        });
    }

    const useTextAvatar = () => {
        setCropped(null);

        globalBus.emit('UpdateGroupInfo', {
            groupAvatar: null
        });

        useTextAvatarRemote(group.groupId);

        setGroup({ ...group, groupAvatar: null });
    }

    return (
        <div className="group-info-updater-main">
            <input ref={ $file } hidden key={ Date.now() } id="avatar" type="file" onChange={e => {
                if (e.target.files && e.target.files.length > 0) {
                    const reader = new FileReader();
                    const n = e.target.files[0].name;

                    reader.addEventListener("load", () =>
                        popup$.push(PreviewSelected, {
                            src: reader.result as string,
                            ok: canvas => {
                                setCropped(canvas);
                                setFileName(n);
                            }
                        }, { style: { background: 'rgba(0, 0, 0, .5)' } })
                    );
                    reader.readAsDataURL(e.target.files[0]);
                }
            }} />

            <h1>修改小组信息</h1>

            <div className="_item">
                <p>小组头像</p>
                
                <div className="change-avatar">
                    <div className="group-avatar-outter l">
                        {
                            cropped ? 
                                <Avatar text={ group.groupName } src={ cropped.toDataURL() } /> :
                                <Avatar text={ group.groupName } src={ group.groupAvatar } />
                        }
                    </div>

                    <div className="r">
                        <label htmlFor="avatar" className="function-btn">点击此处修改</label>

                        {
                            (group.groupAvatar || cropped) ? 
                                <div className="function-btn" onClick={ useTextAvatar }>
                                    使用文本头像
                                </div> : null
                        }
                    </div>
                </div>
            </div>

            <div className="_item">
                <p>小组名</p>
                <input ref={ $name } defaultValue={ groupName$ } />
            </div>

            <div className="_item">
                <p>小组介绍</p>
                <input ref={ $intro } defaultValue={ groupIntro$ } />
            </div>

            <div className="_btns">
                <CreateBtn className="_btn"  onClick={ toSave }>保存</CreateBtn>
                <CreateBtn className="_btn _close" onClick={() => {
                    props.pop();
                }}>关闭</CreateBtn>
            </div>
        </div>
    )
}
