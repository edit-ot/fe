import * as React from "react";

export type PopupAdditionProps = {
    pop: Function
}

export type CreatePopupComponent<Props> = PopupAdditionProps & Props;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type OnPushCb = (newPopups: React.ReactNode[]) => void

export class Popup {
    components: React.ReactNode[] = [];
    pushCbs: OnPushCb[] = [];

    push<Props extends PopupAdditionProps>(
        Component: React.FunctionComponent<Props>,
        props: Omit<Props, keyof PopupAdditionProps>
    ) {


        const idx = this.components.length;
        const newPopUps = this.components.concat(
            // @ts-ignore
            <Component key={ idx }
                { ...props }
                pop={() => {
                    const t = this.components.slice();
                    t.splice(idx, 1);
                    this.setComponents(t);
                }} />
        );

        this.setComponents(newPopUps);
    }

    setComponents(newComponents: React.ReactNode[]) {
        this.components = newComponents;
        this.pushCbs.forEach(cb => cb(this.components));
    }

    onPush = (fn: OnPushCb) => {
        const idx = this.pushCbs.length;
        this.pushCbs.push(fn);

        return () => this.pushCbs.splice(idx, 1);
    }
}
