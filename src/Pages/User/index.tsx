import * as React from "react";
import { RouteComponentProps, Route, NavLink } from "react-router-dom";
import { loginCtx, UserWithGroups, User } from "../../components/Login";

import "./user.less";
import { HoverInfo, HoverHandler } from "../../components/HoverHandler";
import { popupCtx, CreatePopupComponent } from "../../Ctx/Popup";

import { GetInputPopup } from "../../components/GetInputPopup";
import { updateUserInfo, uploadAvatar, getUserInfo, UserMap, getFollowers, getFollowings, toUserMap, followOneRemote } from "./user-api";
import { Link } from "react-router-dom";
import { GroupCard } from "../../components/TheCard";
import { UserTab } from "./UserTab";
import { NavHeader } from "../../components/NavHeader";
import { UserFollowers } from "./UserFollowers";
import { ComponentSwitch, ComponentSwitchBindPosi } from "../../components/ComponentSwitch";
import { getNowPageQuery } from "../../utils/http";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "../../components/Avatar";

export * from "./PreviewSelected";

export type UserPageProps = RouteComponentProps<{
	username: string
}>;

export type userPageCtx = {
    user: UserWithGroups;
    setUser: (u: UserWithGroups) => void;

    followers: User[];
    setFollowers: (us: User[]) => void;

    followings: User[];
    setFollowings: (us: User[]) => void;

    loginedFollowings: User[];
    setLoginedFollowings: (us: User[]) => void;


    toFollowThis: () => void;
    followOne: (theUser: User) => void;
}

export const userPageCtx = React.createContext({} as userPageCtx);

export function UserPage(props: UserPageProps) {
    return (
        <loginCtx.Consumer>{ctx => 
            (ctx && ctx.user) ? (
                <UserPageInner { ...props } />
            ) : null            
        }</loginCtx.Consumer>
    );
}

function listUserToggle(theUser: User, users: User[]): User[] {
    const i = users.findIndex(u => u.username === theUser.username);
    const theUsers = users.slice() as User[];

    if (i === -1) {
        // 没有 
        theUsers.push(theUser);
    } else {
        // 有 
        theUsers.splice(i, 1);
    }

    return theUsers;
}

export function UserPageInner(props: UserPageProps) {
    const { username } = props.match.params;
    const _loginCtx = React.useContext(loginCtx);
    const [loading, setLoading] = React.useState(true);
    const [user, setUser] = React.useState({} as UserWithGroups);
    const [tabPosi, setTabPosi] = React.useState(0);
    const [followers, setFollowers] = React.useState({} as User[]);
    const [followings, setFollowings] = React.useState({} as User[]);
    const [loginedFollowings, setLoginedFollowings] = React.useState([] as User[]);

    const init = () => {
        Promise.all([
            // 目标
            getUserInfo(username).then(setUser),
            // 目标的followers
            getFollowers(username).then(setFollowers),
            // 目标的follow的人
            getFollowings(username).then(setFollowings),
            // 相关
            getFollowings(_loginCtx.user.username).then(setLoginedFollowings),
        ]).then(() => {
            setLoading(false);
        });
    }
    
    const followOne = (theUser: User) => {
        followOneRemote(theUser.username).then(init);

        setLoginedFollowings(
            listUserToggle(theUser, loginedFollowings)
        );
    }

    const toFollowThis = () => {
        followOneRemote(user.username).then(init);

        setFollowers(
            listUserToggle(_loginCtx.user, followers)
        );
    }

    React.useEffect(() => {
        setLoading(true);
        init();
    }, []);

    React.useEffect(() => {
        const query = getNowPageQuery();
        const targetTab = +query.tab || 0;
        setTabPosi(targetTab);
    }, [ props ]);

   
    return (
        <loginCtx.Consumer>{ctx => 
            <userPageCtx.Provider value={{
                user, setUser,
                followers, setFollowers, 
                followings, setFollowings, 
                loginedFollowings, setLoginedFollowings,
                toFollowThis, followOne
            }}>{
                ctx.user ? (
                    loading ? (
                        <div className="user-page-main">加载中</div>
                    ) : (
                        <div className="user-page-main">
                            <NavHeader />
                            <UserPageNav />
                            <div className="user-page-inner">
                                <ComponentSwitchBindPosi
                                    position={ tabPosi % 3 }
                                    setPosition={ setTabPosi }
                                    configs={[
                                        {
                                            name: <div className="user-nav-link"
                                                onClick={() => {
                                                    props.history.push(`/user/${username}?tab=0`)
                                                }}>用户资料</div>,
                                            inner: <UserTab />
                                        },
                                        {
                                            name: <div className="user-nav-link"
                                                onClick={() => {
                                                    props.history.push(`/user/${username}?tab=1`)
                                                }}>Followers</div>,
                                            inner: <TheList text="暂时还没有人关注这个人" users={ followers } />
                                        },
                                        {
                                            name: <div className="user-nav-link"
                                                onClick={() => {
                                                    props.history.push(`/user/${username}?tab=2`)
                                                }}>Followings</div>,
                                            inner: <TheList text="Ta 暂时还没有关注其他人" users={ followings } />
                                        }
                                    ]} />
                            </div>
                        </div>
                    )
                ) : null
            }</userPageCtx.Provider>
        }</loginCtx.Consumer>
    )
}

export function UserPageNav() {
    return (
        <div className="user-page-nav">
            <Link to="/">首页</Link> &gt; 用户资料
        </div>
    )
}

function Follower(props: { user: User, follow: boolean, onClk: () => void }) {
    const _loginCtx = React.useContext(loginCtx);
    const { user, follow } = props;

    return (
        <div className="one-follower-main" onClick={() => {
            window.open(`/user/${ user.username }`);
        }}>
            
            <div className="_avatar"><Avatar text={ user.username } src={ user.avatar } /></div>
            <div>
                <div className="_username">{ user.username }</div>
                <div className="_userintro">{ user.intro || '这个用户比较懒，暂时还未填写个人介绍' }</div>
            </div>

            {
                _loginCtx.user.username === user.username ? (
                    <div className="_follow_btn">这是我</div>
                ) : (
                    <div onClick={ e => {
                        e.stopPropagation();
                        props.onClk();
                    } }
                        className="_follow_btn">{
                            follow ? 'Unfollow' : 'Follow'
                    }</div>
                )
            }
        </div>
    );
}

function TheList(props: { users: User[], text: string }) {
    const ctx = React.useContext(userPageCtx);
    const map = toUserMap(ctx.loginedFollowings);

    const list = props.users.map((er, i) => {
        
        return (
            <Follower key={ i }
                onClk={() => {
                    ctx.followOne(er);
                }}
                user={ er }
                follow={ !!map[er.username] } />
        )
    });

    return (
        <div className="user-list followers">
            { list.length ? list : (
                <NoData text={ props.text } />
            )  }
        </div>
    )
}

function NoData(props: { text: string }) {
    return <div className="user-no-data">
        <div className="_icon"><FontAwesomeIcon icon={ faStar } /></div>
        <div className="_text">{ props.text }</div>
    </div>
}
