import * as React from "react";

export type SwitchConfig = {
    name: React.ReactNode,
    inner: React.ReactNode
}

type Switcher = (position: number) => void;

export type ComponentSwitchProps = {
    configs: SwitchConfig[],
    initPosi?: number
}

export function ComponentSwitch(props: ComponentSwitchProps) {
    const [position, setPosition] = React.useState(props.initPosi || 0);

    const config = props.configs[position];

    return (
        <div className="compo-switcher">
            <div className="swicher-keys">{
                props.configs.map((c, idx) => 
                    <span className={
                        idx === position ?
                            'switcher-item active' :
                            'switcher-item'
                    } key={ idx } onClick={ () => {
                        setPosition(idx);
                    }}>
                        { c.name }
                    </span>
                )
            }</div>

            <div className="switcher-now">
                { config.inner }
            </div>
        </div>
    )
}
