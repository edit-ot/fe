import * as React from "react";
import { NavHeader } from "../../components/NavHeader";
import { Aside } from "../../components/Aside";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import "./home.less";
import { HomeAside } from "./HomeAside";
import { Doc } from "./Doc";

const ASIDE_WIDTH = '200px';

export function HomePage() {
    return (
        <div>
            <NavHeader />
            <Aside width={ ASIDE_WIDTH }>
                <HomeAside />
            </Aside>

            <div style={{ paddingLeft: ASIDE_WIDTH }}>
                <div className="home-content">
                    <Route path="/home" exact component={() => 
                        <Redirect to="/home/docs" />
                    } />
                    <Route path="/home/docs" component={ Doc } />
                    <Route path="/home/files" component={ () => (
                        <div>wenjian</div>
                    )} />
                </div>
            </div>
        </div>
    );
}
