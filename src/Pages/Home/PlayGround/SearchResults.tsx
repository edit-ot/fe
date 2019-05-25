import * as React from "react";
import { playGroundCtx } from ".";
import { getNowPageQuery } from "../../../utils/http";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import "./search-results.less";
import { searchRemote, ResultData } from "./pg-api";
import { DocInfo } from "../Doc/doc-api";
import { Group } from "../homeaside-api";
import { User } from "../../../components/Login";

import { TheCard, GroupCard, UserCard } from "../../../components/TheCard";
import { Link } from "react-router-dom";

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
                defaultValue={ decodeURIComponent(getNowPageQuery().q) } />

            <button><FontAwesomeIcon icon={ faSearch } /></button>

            { msg && <span>{ msg }</span> }
        </form>
    );
}

export function SearchResults() {
    const ctx = React.useContext(playGroundCtx);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        searchRemote(decodeURIComponent(ctx.keyword)).then(r => {
            ctx.setRes(r);
            setLoading(false);
        });
    }, [ ctx.keyword ]);

    return (
        <div className="search-results-main">
            <SearchBar />

            <div className="key-word-info">{ decodeURIComponent(ctx.keyword) } 的搜索结果</div>

            {
                loading ? (
                    <div className="_results">
                        加载中
                    </div>    
                ) : (
                    <div className="_results">
                        <TheLines items={ ctx.res.users }
                            title="相关用户"
                            noData="暂无相关用户搜索结果">{
                            u => <UserCard user={ u } />
                        }</TheLines>

                        <TheLines items={ ctx.res.groups }
                            title="相关小组"
                            noData="暂无相关小组搜索结果">{
                            g => <GroupCard group={ g } />
                        }</TheLines>

                        <TheLines items={ ctx.res.docs }
                            title="相关公开文档"
                            noData="暂无相关文档搜索结果">{
                            d => <TheDoc doc={ d } />
                        }</TheLines>
                    </div>
                )
            }
        </div>
    )
}

type TheLinesProps<T> = {
    items: T[];
    children: (item: T) => JSX.Element;
    noData: React.ReactNode;
    title: React.ReactNode;
}

function TheLines<T>(props: TheLinesProps<T>) {
    const list = props.items.map((item, key) => {
        return <div className="the-line" key={ key }>{
            props.children(item)
        }</div>
    });

    return (
        <div className="the-lines">
            <div className="_title">{ props.title }</div>
        {
            list.length ? list : <div className="_no-data">{ props.noData }</div>
        }</div>
    )
}

function TheDoc(props: { doc: DocInfo }) {
    return (
        <div>
            <div>
                { props.doc.title }, 作者: { props.doc.owner }, 公开分享权限为: { props.doc.permission }, <Link to={`/edit/${ props.doc.id }`}>点击查看</Link>
            </div>
        </div>
    )
}
