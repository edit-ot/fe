import * as React from "react";

import "./menu-btns.less";
import { ClickHandler } from "../ClickHandler";
import { popupCtx, CreatePopupComponent } from "../../Ctx/Popup";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

export type SlideAlign = 'left' | 'right' | 'center';

export type MenuBtnsProps = {
    align?: SlideAlign,
    className?: string,
    slides: SlideItem[],
    children: (ref: React.RefObject<any>) => React.ReactElement
}

export type SlideItem = {
    name: React.ReactNode,
    icon?: IconDefinition,
    onBtnClick?: (item: SlideItem) => boolean | any,
    opened?: boolean,
    inner?: SlideItem[]
}

export type MenuSlidesProps = CreatePopupComponent<{
    slides: SlideItem[],
    align?: SlideAlign,
    rect: ClientRect | DOMRect
}>

function RecursiveSlides(
    { slides, handler, isInner }: {
        slides: SlideItem[],
        handler: (keep: boolean) => boolean | void,
        isInner?: boolean
    }
) {
    React.useEffect(() => {
        slides.forEach(slideItem => {
            if (slideItem.opened) {
                const result = (
                    slideItem.onBtnClick &&
                        slideItem.onBtnClick(slideItem)
                );

                !slideItem.inner && handler(!!result);
            }
        })
    }, []);

    const rendered = slides.map((slideItem, idx) => {
        return (
            <div key={ idx } onClick={e => {
                e.preventDefault();
                e.stopPropagation();

                const result = (
                    slideItem.onBtnClick &&
                        slideItem.onBtnClick(slideItem)
                );

                !slideItem.inner && handler(!!result);
            }}>
                { slideItem.name }
                
                { slideItem.inner && 
                    <div className="_icon-right">
                        <FontAwesomeIcon icon={ faCaretRight } />
                    </div> }
                
                { slideItem.inner &&
                    <RecursiveSlides slides={ slideItem.inner }
                        handler={ handler }
                        isInner={ true } /> }
            </div>
        )
    });

    return (
        <div className={ '_slide-btns ' + (!!isInner ? '_inner' : '') }>
            { rendered }
        </div>
    )
}


export function ShowMenuSlides(props: MenuSlidesProps) {
    const { rect, align } = props;
    const style = {} as React.CSSProperties;

    if (align === 'left') {
        style.left = rect.left;
    }

    if (align === 'right') {
        style.right = rect.right;
    }

    if (align === 'center') {
        style.transform = 'translateX(-50%)';
        style.left = rect.left + rect.width / 2;
    }

    style.top = rect.bottom;
    
    return (
        <div className="menu-slides-main" onClick={ props.pop }>
            <div className="_set-position" style={ style } >
                <RecursiveSlides
                    slides={ props.slides }
                    isInner={ false }
                    handler={ keep => {
                        !keep && props.pop();
                    } } />
            </div>
        </div>
    );
}


export function MenuBtns(props: MenuBtnsProps) {
    const _popupCtx = React.useContext(popupCtx);
   
    return (
        <ClickHandler className={ props.className }
            persist={ true }
            preventDefault={ true }
            onRect={ rect => {
                console.log('rect', rect);

                _popupCtx.push(ShowMenuSlides, {
                    slides: props.slides,
                    align: props.align || 'center',
                    rect
                }, {});
            }}>
            { props.children }
        </ClickHandler>
    )
}
