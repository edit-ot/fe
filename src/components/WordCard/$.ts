import { popup$ } from "../../Ctx/Popup";
import { GetInputPopup } from "../GetInputPopup";

export function getInput(title: string) {
    return new Promise(r => {
        popup$.push(GetInputPopup, {
            title,
            onConfirm: r,
            checker: str => !!str,
            errorInfo: '请勿为空'
        }, {
            style: { backgroundColor: 'rgba(0, 0, 0, .5)' }
        });
    })
}