import * as React from "react";
import { CreatePopupComponent } from "../../Ctx/Popup";
import { HoverInfo } from "../../components/HoverHandler";

export type PreviewSelectedProps = CreatePopupComponent<{
    src: string,
    ok: (canvas: HTMLCanvasElement) => void
}>

export function PreviewSelected(props: PreviewSelectedProps) {
    const [$cropper, setCropper] = React.useState(null as null | Cropper);

    const $img = React.createRef<HTMLImageElement>();

    React.useEffect(() => {
        const $cropper = new Cropper($img.current, {
            aspectRatio: 1
        });

        setCropper($cropper);

        // @ts-ignore
        window.$cropper = $cropper;
    }, []);

    const width = window.innerWidth < 600 ? 300 : 600;
    // const height = window.innerWidth < 600 ? 300 : 600;

    return (
        <div className="preview-selected-main">
            <div style={{
                // width, 
                // height
            }}>
                <img ref={ $img } style={{
                    maxWidth: '100%',
                    visibility: 'hidden'
                }} src={ props.src } />
            </div>

            <HoverInfo info="鼠标缩放 / 双指缩放, 确定无误后点击即可" onClick={() => {
                if (!$cropper) return;
                props.ok($cropper.getCroppedCanvas());
                props.pop();
            }}>
                <div className="_confirm">提交</div>
            </HoverInfo>

            <div className="_confirm _cancel" onClick={ props.pop }>取消</div>
        </div>
    )
}
