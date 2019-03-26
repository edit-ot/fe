import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { HomePage } from "./Pages/Home";
import { EditPage } from "./Pages/Edit";
import { NeedLogin } from "./components/Login";

export function App() {
    return (
        <Router>
            <NeedLogin>
                <Route path="/" exact component={ HomePage } />
                <Route path="/edit" component={ EditPage } />
            </NeedLogin>
        </Router>
    );
}
