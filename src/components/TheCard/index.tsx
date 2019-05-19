import * as React from "react";
import { Avatar } from "../Avatar";
import { NavLink } from "react-router-dom";
import { Group } from "../../Pages/Home/homeaside-api";

import "./the-card.less";
import { User } from "../Login";

export type TheCardProps = {
    name: string;
    avatar: string;
    intro: string;
    defaultIntro: string;
    children: React.ReactNode
}

export function TheCard(props: TheCardProps) {
    const { name, avatar, intro, defaultIntro, children } = props;

    return (
        <div className="the-card-main">
            <div className="the-card">
                <div className="l">
                    <Avatar text={ name } src={ avatar } />
                </div>

                <div className="r">
                    <div className="the-name">{ name }</div>
                    <div className="the-intro">{ intro || defaultIntro }</div>
                </div>
            </div>

            <div className="look-detail">
                { children }
            </div>
        </div>
    );
}

export function GroupCard(props: { group: Group }) {
    const { group } = props;
    const { groupName, groupAvatar, groupIntro, groupId } = group;

    return <TheCard name={ groupName }
        avatar={ groupAvatar }
        intro={ groupIntro }
        defaultIntro="改组拥有者比较懒，暂未填写介绍">

        <div onClick={() => {
            window.open(`/home/group/${ groupId }`);
        }}>查看详情</div>
    </TheCard>
}

export function UserCard(props: { user: User }) {
    const { user } = props;
    const { username, avatar, intro } = user;

    return <TheCard name={ username }
        avatar={ avatar }
        intro={ intro }
        defaultIntro="这个人比较懒，还没填自己的个人介绍">
        
        <div onClick={() => {
            window.open(`/user/${ username }`);
        }}>查看详情</div>
    </TheCard>
}
