import * as React from "react";

import "./group-info-updater.less";
import { CreatePopupComponent, popup$ } from "../../Ctx/Popup";
import { Group } from "../../Pages/Home/homeaside-api";
import { CreateBtn } from "../NoDocs/CreateBtn";
import { Avatar } from "../Avatar";
import { PreviewSelected } from "../../Pages/User";
import { updateGroupInfo } from "./api";
import { globalBus } from "../../utils/GlobalBus";

export type GroupInfoUpdaterProps = CreatePopupComponent<{
    group: Group
}>

export function GroupInfoUpdater(props: GroupInfoUpdaterProps) {
    const $name = React.createRef<HTMLInputElement>();
    const $intro = React.createRef<HTMLInputElement>();
    const { group } = props;

    const [groupName$, setGroupName$] = React.useState(group.groupName);
    const [groupIntro$, setGroupIntro$] = React.useState(group.groupIntro);
    const [cropped, setCropped] = React.useState(null as null | HTMLCanvasElement);

    const toSave = () => {
        const name = $name.current.value;
        const intro = $intro.current.value;

        console.log('toSave', name, intro);
        updateGroupInfo(group.groupId, name, intro, cropped).then(g => {
            globalBus.emit('UpdateGroupInfo', {
                groupName: g.groupName,
                groupIntro: g.groupIntro,
                groupAvatar: g.groupAvatar
            });
        });
    }

    return (
        <div className="group-info-updater-main">
            <input id="avatar" hidden type="file" onChange={ e => {
                if (e.target.files && e.target.files.length > 0) {
                    const reader = new FileReader();
                    
                    reader.addEventListener("load", () =>
                        popup$.push(PreviewSelected, {
                            src: reader.result as string,
                            ok(canvas: HTMLCanvasElement) {
                                setCropped(canvas);
                                // uploadAvatar(canvas).then(() => {
                                //     loadUser();
                                // })
                            }
                        }, { style: { background: 'rgba(0, 0, 0, .5)' } })
                    );
                    
                    reader.readAsDataURL(e.target.files[0]);
                }
            } } />

            <h1>修改小组信息</h1>

            <div className="_item">
                <p>小组头像</p>
                
                <label htmlFor="avatar" className="change-avatar">
                    <div className="group-avatar-outter l">

                        { 
                            cropped ? 
                                <Avatar text={ group.groupName } src={ cropped.toDataURL() } /> :
                                <Avatar text={ group.groupName } src={ group.groupAvatar } />
                        }
                    </div>

                    <div className="r">
                        <div>点击此处修改</div>
                    </div>
                </label>
            </div>

            <div className="_item">
                <p>小组名</p>
                <input ref={ $name } defaultValue={ groupName$ } />
            </div>

            <div className="_item">
                <p>小组介绍</p>
                <input ref={ $intro } defaultValue={ groupIntro$ } />
            </div>

            <div className="_btns" onClick={ toSave }>
                <CreateBtn className="_btn">保存</CreateBtn>
                <CreateBtn className="_btn _close" onClick={() => {
                    props.pop();
                }}>关闭</CreateBtn>
            </div>
        </div>
    )
}

