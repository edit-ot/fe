import * as React from "react";

import "./playground.less";
import { SearchInput } from "./SearchInput";
import { SearchResults } from "./SearchResults";
// import { getNowPageQuery, objToQueryStr } from "../../../utils/http";
import { Route, RouteComponentProps } from "react-router-dom";
import { getNowPageQuery } from "../../../utils/http";
import { ResultData } from "./pg-api";




export type PlayGroundCtx = {
    keyword: string;
    setKeyword: (s: string) => void;
    res: ResultData,
    setRes: (r: ResultData) => void;
}

export const playGroundCtx = React.createContext({} as PlayGroundCtx);


export function PlayGround(props: RouteComponentProps<{}>) {
    const [keyword, setKeyword] = React.useState(getNowPageQuery().q || '');
    const [res, setRes] = React.useState(null as null | ResultData);

    React.useEffect(() => {
        if (keyword) {
            props.history.push(`/home/playground/search?q=${ keyword }`);
        } else {
            props.history.push(`/home/playground`);
        }
    }, [ keyword ]);

    return (
        <playGroundCtx.Provider value={{
            keyword, setKeyword,
            res, setRes
        }}>
            <div className="play-ground-main">
                <Route path="/home/playground" exact
                    component={ SearchInput } />
                <Route path="/home/playground/search" exact 
                    component={ SearchResults } />
            </div>
        </playGroundCtx.Provider>
    )
}
