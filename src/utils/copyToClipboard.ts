function fallbackCopyTextToClipboard(text: string) {
    console.log('fallbackCopyTextToClipboard');

    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    return new Promise((res, rej) => {
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
            res(successful);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', rej(err));
        }
    
        document.body.removeChild(textArea);
    })
    
}

export function copyTextToClipboard(text: string) {
    // @ts-ignore
    if (!navigator.clipboard) {
        return fallbackCopyTextToClipboard(text);
    } else {
        // @ts-ignore
        return navigator.clipboard.writeText(text) as Promise<any>;
    }
}