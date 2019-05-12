import * as React from "react";
import cls from "classnames";

import "./avatar.less";

function TextAvatar(props: { text: string }) {
    return <div className="text-avatar">
        { props.text[0] || 'M' }
    </div>
}

export type AvatarProps = {
    className?: string,
    text: string,
    src?: string | null
}


export function Avatar(props: AvatarProps) {   
    return (
        <div className={ cls('avatar-main', (props.className || '')) }>
            { props.src ? 
                <img src={ props.src } /> :
                <TextAvatar text={ props.text } />
            }
        </div>
    )
}
