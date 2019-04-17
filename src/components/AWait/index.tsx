import * as React from "react";

export type AWaitProps<T> = {
    wait: () => Promise<T>,
    loading?: React.ReactElement,
    err?: React.ReactElement,
    onFinish?: () => void,
    children: (data: T) => React.ReactElement,
    whenOnChange?: any
}

export function AWait<T>(props: AWaitProps<T>): React.ReactElement {
    const [data, setData] = React.useState(null as null | T);
    const [load, setLoad] = React.useState(true);
    const [isErr, setErr] = React.useState(false);

    React.useEffect(() => {
        setLoad(true);
        props.wait().then(data => {
            setData(data);
            props.onFinish && props.onFinish();
        }).catch(errInfo => setErr(errInfo || true))
          .then(() => setLoad(false));

        return () => {};
    }, props.whenOnChange ? [ props.whenOnChange ] : []);

    return (
        isErr ? (
            props.err || null
        ) : (
            load ? (
                props.loading || null
            ) : (
                props.children(data) || null
            )
        )
    )
}