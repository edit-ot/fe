import * as React from "react";
import cls from "classnames";

import "./get-input-popup.less";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes as ERROR_ICON } from "@fortawesome/free-solid-svg-icons";
import { CreatePopupComponent } from "../../Ctx/Popup";

export type GetInputPopupProps = CreatePopupComponent<{
    title: string,
    placeholder?: string,
    confrimText?: string,
    cancelText?: string,
    errorInfo?: string
    checker?: (input: string) => boolean,
    onCancel?: () => any,
    onConfirm: (input: string) => any
}>

export function GetInputPopup(
    {
        title, confrimText, cancelText, onCancel, pop,
        placeholder, checker, onConfirm, errorInfo
    }: GetInputPopupProps
) {
    const [valid, setValid] = React.useState(true);
    const $input = React.useRef<HTMLInputElement>();

    const $onCancel = () => {
        pop();

        onCancel && onCancel();
    }

    const toCheck = () => {
        const theValid = checker ? 
            checker($input.current.value) : 
            true;
        
        setValid(theValid);

        return theValid;
    }

    const $onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.persist();

        if (!onConfirm) return pop();
        
        const theValid = toCheck();

        if (theValid) {
            pop();
            onConfirm($input.current.value);
        }
    }

    return (
        <form className="get-input-popup" onSubmit={ $onSubmit }>
            <div className="_title">{ title }</div>
            
            <div className="input-wrap">
                <input ref={ $input }
                    placeholder={ placeholder || '' }
                    onChange={ toCheck }
                    className={cls({
                        unvalid: !valid
                    })}/>

                {
                    !valid &&
                        <div className="error-info">
                            <span>{ errorInfo || '请检查输入' }</span>
                            <FontAwesomeIcon icon={ ERROR_ICON } />
                        </div>
                }
            </div>

            <div className="_btns">
                <button className="_btn _confirm" type="submit">
                    { confrimText || '提交' }
                </button>

                <div className="_btn _cancel" onClick={ $onCancel }>
                    { cancelText || '取消' }
                </div>
            </div>
        </form>
    );
}
