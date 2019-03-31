import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faCaretRight, faCog } from '@fortawesome/free-solid-svg-icons'; 
import cls from "classnames";
import "./side-btn.less";

export type SlideItem = {
    name: React.ReactNode,
    icon?: IconDefinition,
    onBtnClick?: (item: SlideItem) => boolean | any,
    inner?: SlideItem[],
    opened?: boolean
}

function Slides(
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
                e.persist();

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
                    <Slides slides={ slideItem.inner }
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

export type SideBtnProps = React.PropsWithChildren<{
    icon?: IconDefinition,
    initVisible?: boolean,
    slides?: SlideItem[],
    isAbsoulte?: boolean
}>

export function SideBtn(props: SideBtnProps) {
    const { icon,  slides, initVisible } = props;

    const [ visible, setVisible ] = React.useState(!!initVisible);

    return (
        <div className={cls({
            'side-btn-main': true,
            '_absolute': !!props.isAbsoulte
        })} style={{
            right: 0, top: 0
        }} onClick={ e => {
            e.persist();
            e.preventDefault();
            setVisible(!visible);
        }}>
            <span className="_icon">{
                props.children ?
                    props.children : 
                    <FontAwesomeIcon icon={ icon || faCog }/>                
            }</span>
            

            {/* Visible 控制 */
                (visible && slides && slides.length !== 0) &&
                <Slides slides={ slides } handler={keep => {
                    if (!keep) setVisible(!visible);
                }} />
            }
        </div>
    );
}
