import * as React from "react";
import { RouteComponentProps } from "react-router";
import { getGroup, Group } from "../homeaside-api";

import "./group.less";
import { NoDocs } from "../../../components/NoDocs";
import { loginCtx, User } from "../../../components/Login";
import { popupCtx } from "../../../Ctx/Popup";
import { DocInfo } from "../Doc/doc-api";
import { DocMain } from "../Doc";
import { createDocForGroup, cancelShare } from "./group-api";

export type GroupProps = RouteComponentProps<{
	groupId: string
}>

type RenderGroupProps = {
    group: Group, 
    user: User,
    reInit: () => void
}

function RenderGroup(props: RenderGroupProps) {
    const { group, user, reInit } = props;

    const onCreateDoc = () => {
        createDocForGroup(group.groupId)
            .then(reInit);
    }

    return (
        <div>
            <div className="_title">{ group.groupName }</div>

            <div className="_lr">
                <div className="l">{
                    group.docs && 
                        <DocMain
                            docs={ group.docs } initDocs={ reInit } onCreateDoc={ onCreateDoc }
                        />
                }</div>

                <div className="r">成员</div>
            </div>
        </div>
    )
}

export function Group(props: GroupProps) {
    const _loginCtx = React.useContext(loginCtx);
    const _popupCtx = React.useContext(popupCtx);

    const [group, setGroup] = React.useState(null as null | Group);
    const [loading, setLoading] = React.useState(true);

    const init = () => {
        setLoading(true);
        getGroup(props.match.params.groupId)
            .then(setGroup)
            .then(() => setLoading(false));
    }

    React.useEffect(init, [ _loginCtx.user, props ])

    return (
        <div className="group-main">
        
            {
                loading ? (
                    <div>加载中</div>
                ) : (
                    group ? (
                        <loginCtx.Consumer>{ctx => 
                            <RenderGroup group={ group } user={ ctx.user } reInit={ init } />
                        }</loginCtx.Consumer>
                    ) : (
                        <NoDocs text="未找到这个学习小组，请检查 URL" />
                    )
                )
            }
        </div>
    )
}
