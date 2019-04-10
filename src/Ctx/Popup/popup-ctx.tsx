import * as React from "react";
import "./popup-ctx.less";
import { Popup, Props } from "./Popup";

const popup = new Popup();

export const popupCtx = React.createContext(
    popup
);

// @ts-ignore
window.popup = popup;

export function PopupCtxWrap() {
    const [ popUps, setPopUps ] = React.useState([] as [React.ReactNode, Props][]);

    React.useEffect(() => {
        return popup.onPush(setPopUps);
    }, [ popUps ]);

    return (
        <popupCtx.Provider value={ popup }>
            <div className="popup-main">{
                popUps.map(([compo, outterProps], idx) => {
                    if (!outterProps.style) outterProps.style = {};
                    outterProps.style.zIndex = idx + 100000;

                    return (
                        <div className="fixed-to-top" key={idx} { ...outterProps }>
                            { compo }
                        </div>
                    );
                })
            }</div>
        </popupCtx.Provider>
    )
}
