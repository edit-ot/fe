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
    onConfirm: (input: string) => any,

    mask?: boolean,
    pureConfirm?: boolean,
    introText?: string | React.ReactNode
}>

export function GetInputPopup(
    {
        title, confrimText, cancelText, onCancel, pop, mask,
        placeholder, checker, onConfirm, errorInfo, pureConfirm,
        introText
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
            onConfirm(
                // 针对 pureConfirm 的情况 
                ($input && $input.current && $input.current.value) || undefined
            );
        }
    }

    return (
        <form className="get-input-popup" onSubmit={ $onSubmit }>
            <div className="_title">{ title }</div>
            
            { !pureConfirm && (
                <div className="input-wrap">
                    <input ref={ $input }
                        placeholder={ placeholder || '' }
                        onChange={ toCheck }
                        className={cls({
                            unvalid: !valid
                        })}
                        type={ mask ? 'password' : '' }
                        />

                    {
                        !valid &&
                            <div className="error-info">
                                <span>{ errorInfo || '请检查输入' }</span>
                                <FontAwesomeIcon icon={ ERROR_ICON } />
                            </div>
                    }
                </div>
            )}

            {
                pureConfirm && introText && <div className="intro-text">{ introText }</div>
            }
            
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
