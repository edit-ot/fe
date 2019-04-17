import * as React from "react";

export type AWaitProps<T> = {
    wait: () => Promise<T>,
    loading?: React.ReactElement,
    err?: React.ReactElement,
    children: (data: T) => React.ReactElement
}

export function AWait<T>(props: AWaitProps<T>): React.ReactElement {
    const [data, setData] = React.useState(null as null | T);
    const [load, setLoad] = React.useState(true);

    React.useEffect(() => {
        setLoad(true);
        props.wait().then(setData)
            .catch(errInfo => setData(null))
            .then(() => setLoad(false));
    }, []);

    return (
        load ? (
            props.loading || <div>加载中</div>
        ) : (
            data ? (
                props.children(data)
            ) : (
                props.err || <div>错误</div>
            )
        )
    )
}