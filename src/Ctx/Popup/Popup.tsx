import * as React from "react";

type PopFunction = (...args: any[]) => any;

export type PopupAdditionProps = {
    pop: PopFunction
}

export type CreatePopupComponent<Props> = PopupAdditionProps & Props;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type OnPushCb = (newPopups: [React.ReactNode, OutterProps][]) => void;

export type OutterProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>, HTMLDivElement
>;

export class Popup {
    components: [ React.ReactNode, OutterProps ][] = [];
    pushCbs: OnPushCb[] = [];

    push<Props extends PopupAdditionProps>(
        /**
         * 组件类
         */
        Component: React.FunctionComponent<Props>,

        /**
         * 组件参数
         */
        props: Omit<Props, keyof PopupAdditionProps>,

        /**
         * 外部参数
         */
        outterProps: OutterProps = {}
    ): PopFunction {
        const idx = this.components.length;

        var pop = () => {
            const posi = this.components.indexOf($$);
            if (posi === -1) return;
            const t = this.components.slice();
            t.splice(posi, 1);
            this.setComponents(t);
        }

        // The Dark
        var $$ = [
            // @ts-ignore
            <Component key={ idx }
                { ...props }
                pop={ () => pop() } />,
            // Outter Props
            outterProps
        ] as [React.ReactNode, OutterProps];

        const newPopUps = [
            ...this.components, $$
        ];

        this.setComponents(newPopUps);

        return pop;
    }

    setComponents(newComponents: [ React.ReactNode, OutterProps ][]) {
        this.components = newComponents;
        this.pushCbs.forEach(cb => cb(this.components));
    }

    onPush = (fn: OnPushCb) => {
        const idx = this.pushCbs.length;
        this.pushCbs.push(fn);

        return () => this.pushCbs.splice(idx, 1);
    }
}
