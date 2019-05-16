import * as React from "react";

import "./wordcard.less";
import { CreatePopupComponent, popup$ } from "../../Ctx/Popup";
import { Group } from "../../Pages/Home/homeaside-api";
import { WCWS } from "./WCWS";
import { User } from "../Login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { GetInputPopup } from "../GetInputPopup";
import { getInput } from "./$";
import { Card } from "./Card";
import { Delta } from "edit-ot-quill-delta";

export type Word = {
    id: string;
    word: string;
    interpretation?: Delta;
    creator: string;
}

export type WordMap = {
    [wordId: string]: Word
}

export type WordCardCtx = {
    words: Word[];
    setWords: (ws: Word[]) => void;
    addWord: (wordStr: string) => void;
    changeWordName: (wordId: string, word: string) => void;

    loading: boolean;
    setLoading: (l: boolean) => void;

    loginedUsers: User[];
    setLoginedUsers: (users: User[]) => void;

    wcws: WCWS;
    setWcws: (w: WCWS) => void;
}

export const wordCardCtx = React.createContext(null as null | WordCardCtx);

export type WordCardProps = CreatePopupComponent<{
    group: Group
}>;

export function WordCardCtxWrap(props: React.PropsWithChildren<WordCardProps>) {
    const [loading, setLoading] = React.useState(true);
    const [wcws, setWcws] = React.useState(null as null | WCWS);
    const [words, setWords] = React.useState([] as Word[]);
    const [loginedUsers, setLoginedUsers] = React.useState([] as User[]);

    React.useEffect(() => {
        const wcws = new WCWS(props.group);
        wcws.init();
        setWcws(wcws);

        const setLoadingToFalse = () => loading && setLoading(false);

        wcws.socket.on('setLoginedUsers', setLoginedUsers);
        wcws.socket.on('setLoginedUsers', setLoadingToFalse)
              
        wcws.socket.on('setWords', setWords);

        wcws.socket.emit('login');

        return () => {
            wcws.socket.removeAllListeners();
            wcws.socket.close();
        }
    }, []);

    const addWord = (title: string) => {
        wcws.socket.emit('addWord', title);
    }

    const changeWordName = (wordId: string, word: string) => {
        wcws.socket.emit('changeWordName', {
            wordId, word
        });
    }

    return (
        <wordCardCtx.Provider value={{
            loading, setLoading,
            wcws, setWcws,
            words, setWords, addWord, changeWordName,
            loginedUsers, setLoginedUsers,
        }}>
            { props.children }
        </wordCardCtx.Provider>
    )
}

export function WordCard(props: WordCardProps) {
    const content = (
        <div className="word-card-main">
            <h1>小组单词卡
                <div className="_close" onClick={ props.pop }>
                    <FontAwesomeIcon icon={ faTimes } />
                </div>
            </h1>

            <WordsLine />

            <Card />
        </div>
    );

    return (
        <WordCardCtxWrap { ...props }>
            <wordCardCtx.Consumer>{ ctx => 
                ctx.loading ? (
                    <div>加载中</div>
                ) : (
                    content
                )
            }</wordCardCtx.Consumer>
        </WordCardCtxWrap>
    )
}

export function WordsLine() {
    const [editPosi, setEditPosi] = React.useState(-1);
    const _wordCardCtx = React.useContext(wordCardCtx);
    const $input = React.createRef<HTMLInputElement>();

    React.useEffect(() => {
        if (!$input.current) return;
        $input.current.focus();

        const blur = () => {
            _wordCardCtx.changeWordName(
                _wordCardCtx.words[editPosi].id,
                $input.current.value
            );
            setEditPosi(-1);
        };

        $input.current.addEventListener('blur', blur);

        return () => {
            if ($input.current) {
                $input.current.removeEventListener('blur', blur);
            }
        }
    }, [$input]);

    const lines = _wordCardCtx.words.map((w, i) => {
        let signal = 0;
        let timer: NodeJS.Timeout;
        
        const oneclk = () => _wordCardCtx.wcws.emit('chooseWord', w);
        const twoclk = () => setEditPosi(i);

        const handle = () => {
            signal = signal + 1;
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (signal >= 2) twoclk();
                else oneclk();

                signal = 0;
            }, 200);
        }

        return (
            <div className="line" key={ i } onClick={ handle }>
                {
                    (i === editPosi) ? (
                        <input ref={$input} defaultValue={w.word} />
                    ) : w.word
                }
            </div>
        );
    });

    return (
        <div className="wrods-line">
            { lines }

            <div className="line" onClick={ () => {
                getInput('输入单词').then(_wordCardCtx.addWord);
            } }>
                <FontAwesomeIcon icon={ faPlus } />
            </div>
        </div>
    )
}
