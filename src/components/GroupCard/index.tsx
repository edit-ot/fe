import * as React from "react";
import { Avatar } from "../Avatar";
import { NavLink } from "react-router-dom";
import { Group } from "../../Pages/Home/homeaside-api";

import "./group-card.less";

export function GroupCard(props: { group: Group }) {
    const { group } = props;
    const { groupName, groupAvatar, groupIntro, groupId } = group;

    return (
        <div className="group-card-main">
            <div className="group-card">
                <div className="l">
                    <Avatar text={ groupName } src={ groupAvatar } />
                </div>

                <div className="r">
                    <div className="group-name">{ groupName }</div>
                    <div className="group-intro">{ groupIntro || '该组所有者比较懒，还未写介绍' }</div>
                </div>
            </div>

            <NavLink to={`/home/group/${ groupId }`} className="look-detail">查看详情</NavLink>
        </div>
    );
}
