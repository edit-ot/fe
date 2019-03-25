import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { HomePage } from "./Pages/Home";
import { EditPage } from "./Pages/Edit";
import { LoginPage, loginCtx } from "./Pages/Login";



export function App() {
    return (
        <Router>
            <LoginPage>
                <nav>   
                    <p><Link to="/">Home</Link></p>
                    <p><Link to="/edit">Edit</Link></p>
                </nav>

                <Route path="/" exact component={ HomePage } />
                <Route path="/edit" component={ EditPage } />
            </LoginPage>
        </Router>
    );
}
