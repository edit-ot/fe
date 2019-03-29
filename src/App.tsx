import * as React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { HomePage } from "./Pages/Home";
import { EditPage } from "./Pages/Edit";
import { NeedLogin } from "./components/Login";
import { PopupCtxWrap } from "./Ctx/Popup/popup-ctx";

export function App() {
    return [
        <Router key="app-root-router">
            <NeedLogin>
                {/* Redirect To Home */}
                <Route path="/" exact component={ () => <Redirect to="/home" /> } />
                

                {/* Home */}
                <Route path="/home" component={ HomePage } />

                {/* Edit */}
                <Route path="/edit/:docId" exact component={ EditPage } />
            </NeedLogin>
        </Router>,
        <PopupCtxWrap key="app-msg-ctx-wrap" />
    ];
}
