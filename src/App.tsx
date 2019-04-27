import * as React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { HomePage } from "./Pages/Home";
import { EditPage } from "./Pages/Edit";
import { NeedLogin } from "./components/Login";
import { PopupCtxWrap } from "./Ctx/Popup/popup-ctx";
import { AboutPage } from "./Pages/About";
import { UserPage } from "./Pages/User";

export function App() {
    return (
        <Router>
            <NeedLogin>
                {/* Redirect To Home */}
                <Route path="/" exact component={ () => <Redirect to="/home" /> } />
                

                {/* Home */}
                <Route path="/home" component={ HomePage } />

                {/* Edit */}
                <Route path="/edit/:docId" exact component={ EditPage } />

                {/* About */}
                <Route path="/about" exact component={ AboutPage } />

                {/* User */}
                <Route path="/user/:username" exact component={ UserPage } />


                <PopupCtxWrap key="app-msg-ctx-wrap" />
            </NeedLogin>
        </Router>
    )
}
