import * as React from "react";

export type HomeAsideProps = {}

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faFolder, faDownload, faPlus, faCog, faSeedling } from '@fortawesome/free-solid-svg-icons'; 
import { NavLink } from "react-router-dom";
    

import "./homeaside.less";
import { popupCtx } from "../../Ctx/Popup";
import { GetInputPopup } from "../../components/GetInputPopup";
import { getGroups, Group, createGroup, changeGroupName, getJoinedGroups, deleteGroup } from "./homeaside-api";
import { loginCtx } from "../../components/Login";
import { MenuBtns } from "../../components/MenuBtns";
import { msgConnect } from "../../utils/WS/MsgConnect";


export function HomeAside(props: HomeAsideProps) {
    const _loginCtx = React.useContext(loginCtx);
    const _popupCtx = React.useContext(popupCtx);

    const [loading, setLoading] = React.useState(true);
    const [groups, setGroups] = React.useState([] as Group[]);
    const [joinedGroups, setJoinedGroups] = React.useState([] as Group[]);

    React.useEffect(() => {
        const $$ = () => {
            console.log('home msg read state change');
            init();
        }

        msgConnect.socket.on('msg-read-state-change', $$);
        return () => msgConnect.socket.removeListener(
            'msg-read-state-change', $$);
    }, []);


    const init = () => {
        setLoading(true);
        getGroups()
            .then(setGroups)
            .then(getJoinedGroups)
            .then(setJoinedGroups)
            .then(() => setLoading(false))
    }

    React.useEffect(init, [ _loginCtx.user ]);

    const onClk = () => {
        _popupCtx.push(GetInputPopup, {
            title: '新建小组',
            placeholder: '请输入小组名',
            onConfirm: input => {
                createGroup(input).then(init);
            },
            checker: str => !!str,
            errorInfo: '小组名请勿为空'
        }, {
            style: { backgroundColor: 'rgba(0, 0, 0, .5)' }
        });
    }

    return (
        <div className="home-aside-main">
            <div className="text-title">
                工作台
            </div>

            <NavLink className="line" to="/home/docs"
                activeClassName="line-active"
                isActive={ match => match && match.url && match.url.startsWith('/home/docs') }>
                <FontAwesomeIcon icon={ faFolder } />
                <span className="text">我的文档</span>
            </NavLink>

            <NavLink className="line" to="/home/files"
                activeClassName="line-active"
                isActive={ match => match && match.url && match.url.startsWith('/home/files') }>
                <FontAwesomeIcon icon={ faDownload } />
                <span className="text">我的文件</span>
            </NavLink>

            <NavLink className="line"
                activeClassName="line-active"
                isActive={
                    match => match && match.url &&
                        match.url.startsWith(`/home/playground`)
                }
                to={`/home/playground`}>
                <FontAwesomeIcon icon={ faSeedling } />
                <span className="text">广场</span>
            </NavLink>

            <div className="text-title _learn">
                <span>我的小组</span>

                <span className="_icon" onClick={ onClk }>
                    <FontAwesomeIcon icon={ faPlus } />
                </span>
            </div>

            {
                loading ? (
                    <div className="line">
                        加载登陆中 ...
                    </div>
                ) : (
                    (groups.length + joinedGroups.length) ? (
                        groups.concat(joinedGroups).map((group, idx) => (
                            <NavLink className="line" key={ idx }
                                activeClassName="line-active"
                                isActive={
                                    match => match && match.url &&
                                        match.url.startsWith(`/home/group/${ group.groupId }`)
                                }
                                to={`/home/group/${ group.groupId }`}>
                                <span>{ group.groupName }</span>

                                <MenuBtns className="fa-cog-icon" slides={[{
                                    name: '修改小组名',
                                    onBtnClick() {
                                        _popupCtx.push(GetInputPopup, {
                                            title: '修改小组名',
                                            placeholder: '请输入小组名',
                                            onConfirm: input => {
                                                changeGroupName(group.groupId, input)
                                                    .then(init);
                                            },
                                            checker: str => !!str,
                                            errorInfo: '小组名请勿为空'
                                        }, {
                                            style: { backgroundColor: 'rgba(0, 0, 0, .5)' }
                                        });
                                    }
                                }, {
                                    name: <span style={{ color: 'rgb(180, 66, 66)' }}>删除</span>,
                                    onBtnClick() {
                                        _popupCtx.push(GetInputPopup, {
                                            title: '你确定要删除该小组吗 ?',
                                            pureConfirm: true,
                                            confrimText: '删除',
                                            onConfirm() {
                                                deleteGroup(group.groupId).then(init);
                                            }
                                        }, {
                                            style: { backgroundColor: 'rgba(0, 0, 0, .5)' }
                                        })
                                    }
                                }]}>{
                                    ref =>
                                        <span ref={ ref }> 
                                            <FontAwesomeIcon icon={ faCog } />
                                        </span>
                                }</MenuBtns>
                            </NavLink>
                        ))
                    ) : (
                        <div className="line _disable">暂时未创建</div>
                    )
                )
            }


            
            
        </div>
    )
}
