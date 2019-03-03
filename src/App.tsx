import * as React from "react";
import { InputArea } from "./components/InputArea";

export function App() {
    const [origin, setOrigin] = React.useState('hello, world');

    return ( 
        <div>
            <div className="server-status">
                <div>Server Status</div>
                <div>{ origin }</div>
            </div>
            <div className="all-user-area">
                <InputArea label="userA" initText={ origin } />
                <InputArea label="userB" initText={ origin } />
            </div>
        </div>
    );
}