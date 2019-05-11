import * as React from "react";
import { NavHeader } from "../../components/NavHeader";
import { Aside } from "../../components/Aside";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import "./home.less";
import { HomeAside } from "./HomeAside";
import { DocPage } from "./Doc";
import { Group } from "./Group";

const ASIDE_WIDTH = '200px';

export function HomePage() {
    return (
        <div>
            <NavHeader />
            <Aside width={ ASIDE_WIDTH }>
                <HomeAside />
            </Aside>

            <div style={{ paddingLeft: ASIDE_WIDTH, height: window.innerHeight - 48 }}>
                <div className="home-content">
                    <Route path="/home" exact component={() => 
                        <Redirect to="/home/docs" />
                    } />

                    <Route path="/home/docs" component={ DocPage } />

                    <Route path="/home/group/:groupId" component={ Group } />

                    <Route path="/home/files" component={ () => (
                        <div>wenjian</div>
                    )} />
                </div>
            </div>
        </div>
    );
}
