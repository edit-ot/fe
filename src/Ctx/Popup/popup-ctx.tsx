import * as React from "react";
import "./popup-ctx.less";
import { Popup } from "./Popup";

const popup = new Popup();

export const popupCtx = React.createContext(
    popup
);

// @ts-ignore
window.popup = popup;

export function PopupCtxWrap() {
    const [ popUps, setPopUps ] = React.useState([] as React.ReactNode[]);

    React.useEffect(() => {
        return popup.onPush(setPopUps)
    }, [ popUps ]);

    return (
        <popupCtx.Provider value={ popup }>
            <div className="popup-main">{
                popUps.map((popup, idx) => 
                    <div className="fixed-to-top" key={idx}
                        style={{
                            zIndex: idx + 100000
                        }}>
                        { popup }
                    </div>
                )
            }</div>
        </popupCtx.Provider>
    )
}
