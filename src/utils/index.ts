export function throttle<T extends (...args: any[]) => any>(fn: T, gapTime: number = 500): T {
    let _lastTime = Date.now();
    
    // @ts-ignore
    return function(...args: Parameters<T>) {
        const _nowTime = Date.now();

        if (_nowTime - _lastTime > gapTime) {
            fn(args);

            _lastTime = _nowTime
        }
    }
}

export function debounce<T extends (...args: any[]) => any>
    (fn: T, wait: number = 500): (...args: Parameters<T>) => void {
    let timer = null;

    return (...args) => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }

        timer = setTimeout(fn, wait, ...args);
    }
}
  
