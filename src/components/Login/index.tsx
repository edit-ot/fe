import * as React from "react";
import { InputData, doLogin, User, doRegister, getUserInfo, doLogoutRemote } from "./login-api";
import md5 from "md5";

import "./login.less";

export * from "./login-api";

export type LoginCtx = {
    user: User | null;
    doLogout: () => void;
    update: (userInfo: Partial<User>) => void;
}

export const loginCtx = React.createContext({
    user: null,
    doLogout: () => {}
} as LoginCtx);

export function NeedLogin(props: { children: any[]; }) {
    const [user, setUser] = React.useState(null as null | User);
    const [isRegister, setRegister] = React.useState(false);

    React.useEffect(() => {
        getUserInfo().then(resp => {
            if (resp.code === 200 && resp.data) {
                setUser(resp.data);
            }
        })
    }, []);

    const onSubmit = e => {
        e.preventDefault();

        const $inputs: HTMLInputElement[] = Array.from(
            document.querySelectorAll('.login-form input')
        );

        const data = $inputs.reduce((data, $input) => {
            data[$input.name] = $input.value;
            return data; 
        }, {} as InputData);

        console.log('onLogin', data);

        if (!data.username) {
            return alert('请输入用户名');
        }

        if (!data.pwd) {
            return alert('请输入密码');
        }

        if (isRegister && !data.pwd2) {
            return alert('请再一次输入密码');
        }

        if (isRegister && data.pwd !== data.pwd2) {
            return alert('两次密码输入不一致');
        }

        data.pwd = md5(data.pwd);
        if (data.pwd2) {
            data.pwd2 = md5(data.pwd2);
        }

        if (isRegister) {
            doRegister(data).then(resp => {
                if (resp.code === 200 && resp.data) {
                    // setUser(resp.data);
                    alert('注册成功');
                    setRegister(false);
                } else {
                    alert('注册失败' + (resp.msg || ''));
                }
            });
        } else {
            doLogin(data).then(resp => {
                if (resp.code === 200 && resp.data) {
                    setUser(resp.data);
                } else {
                    alert('登录失败' + (resp.msg || ''));
                }
            });
        }
    }

    const doLogout = () => {
        doLogoutRemote().then(() => {
            setUser(null);
        })
    }

    return (
        <loginCtx.Provider value={{
            user,
            doLogout,
            update(info) {
                setUser({
                    ...user, 
                    ...info
                });
            }
        }}>
            {
                !user && (
                    <form className="login-container" onSubmit={ onSubmit }>
                        <div className="login-form">
                            <div className="field-line">
                                <div className="field-name">用户名</div>
                                <div>
                                    <input type="text" name="username" placeholder="alice" />
                                </div>
                            </div>

                            <div className="field-line">
                                <div className="field-name">密码</div>
                                <div>
                                    <input type="password" name="pwd" placeholder="***" />
                                </div>
                            </div>

                            {
                                isRegister && (
                                    <div className="field-line">
                                        <div className="field-name">再输入一次密码</div>
                                        <div>
                                            <input type="password" name="pwd2" placeholder="***" />
                                        </div>
                                    </div>
                                )
                            }

                            {
                                !isRegister && (
                                    <div className="field-line">
                                        <button type="submit">登录</button>
                                    </div>
                                )
                            }
                            
                            {
                                isRegister ? [
                                    <div className="field-line" key="r-0001">
                                        <button type="submit">提交注册</button>
                                    </div>,
                                    <div className="field-line" key="r-0002"
                                        onClick={ e => setRegister(false) }>
                                        <div className="fake-btn">返回</div>
                                    </div>
                                ] : (
                                    <div className="field-line" onClick={ e => setRegister(true) }>
                                        <button type="submit">注册</button>
                                    </div>
                                )
                            }
                        </div>
                    </form>
                )
            }

            { props.children }         
        </loginCtx.Provider>
    );
}
