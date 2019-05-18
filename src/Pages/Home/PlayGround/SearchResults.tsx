import * as React from "react";
import { playGroundCtx } from ".";
import { getNowPageQuery } from "../../../utils/http";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import "./search-results.less";

export function SearchBar() {
    const ctx = React.useContext(playGroundCtx);
    const $input = React.createRef<HTMLInputElement>();
    const [msg, setMsg] = React.useState('');

    return (
        <form onSubmit={ e => {
            e.stopPropagation();
            e.preventDefault();

            if ($input.current.value) {
                ctx.setKeyword($input.current.value);
            } else {
                setMsg('请输入有效内容');
            }
        }} className="search-bar">
            <input type="text" ref={ $input }
                defaultValue={ getNowPageQuery().q } />

            <button><FontAwesomeIcon icon={ faSearch } /></button>

            { msg && <span>{ msg }</span> }
        </form>
    );
}

export function SearchResults() {
    const ctx = React.useContext(playGroundCtx);

    return (
        <div className="search-results-main">
            <SearchBar />

            <div className="key-word-info">{ ctx.keyword } 的搜索结果</div>

            <div className="_results">
                结果在这里
            </div>
        </div>
    )
}
