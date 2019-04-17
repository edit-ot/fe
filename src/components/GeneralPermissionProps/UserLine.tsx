import * as React from "react";

export type UserLineProps = React.PropsWithChildren<{
    avatar: string,
    username: string
}>

export function UserLine(props: UserLineProps) {
    return (
        <div className="_user-line">
            <div className="_avatar">
                <img src={ props.avatar } />
            </div>

            <div>{ props.username }</div>

            
            { props.children }

            {/* <div>
                <SideBtn slides={[{
                    name: '设为只读',
                    onBtnClick: () => setPermission(otherUser, { r: true })
                }, {
                    name: '可读可写',
                    onBtnClick: () => setPermission(otherUser, { r: true, w: true })
                }, {
                    name: '移除',
                    onBtnClick: () => delPermission(otherUser)
                }]}>
                    <div className="_btn" style={{ textAlign: 'center', width: '100%' }}>
                        { RWToString(doc.pmap[otherUser]) } <FontAwesomeIcon icon={ faCaretDown } />
                    </div>
                </SideBtn>
            </div> */}
        </div>
    )
}