export function wait(t = 0) {
    return new Promise(r => setTimeout(r, t));
}
