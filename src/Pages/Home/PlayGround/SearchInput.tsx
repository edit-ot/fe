import * as React from "react";

import "./search-input.less";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchPlus, faSearchMinus, faSearchLocation, faSearchDollar, faSearch, faMagic } from "@fortawesome/free-solid-svg-icons";
import { HoverInfo } from "../../../components/HoverHandler";
import { playGroundCtx } from ".";

export function SearchInput() {
    const ctx = React.useContext(playGroundCtx);
    const $input = React.createRef<HTMLInputElement>();
    const [msg, setMsg] = React.useState(null as null | string);
    
    return (
        <div className="search-input-main">
            <form onSubmit={ e => {
                e.preventDefault();
                e.stopPropagation();

                if (!$input.current.value) {
                    setMsg('请输入有效内容');
                } else {
                    ctx.setKeyword($input.current.value);
                }
            } }>
                <div className="_title">搜索你感兴趣的内容</div>

                <input ref={ $input }
                    className="_keyword"
                    type="text"
                    onChange={ () => setMsg(null) } />

                <div className="_btns">
                    <FontAwesomeIcon icon={ faSearchPlus } />
                    <FontAwesomeIcon icon={ faSearchMinus } />
                    <button>
                        <HoverInfo info="点击搜索">
                            <FontAwesomeIcon icon={ faSearch } />
                        </HoverInfo>
                    </button>
                    <FontAwesomeIcon icon={ faSearchLocation } />
                    <FontAwesomeIcon icon={ faSearchDollar } />

                    {
                        msg && (
                            <div className="_input_msg_">{ msg }</div>
                        )
                    }
                </div>
            </form>
        </div>
    )
}


