const prefix = (str: string | number, pre = '00') =>
    (pre.toString() + str).slice(- pre.toString().length);

export function date2str(strDate: string) {
    const now = new Date();

    const d = new Date(strDate);
    
    const del = ~~((now.getTime() - d.getTime()) / 1000);

    const year = d.getFullYear();
    const day = prefix(d.getDate());
    const month = prefix(d.getMonth() + 1);
    const h = prefix(d.getHours());
    const m = prefix(d.getMinutes());

    return [
        '刚刚',
        '一分钟前',
        '两分钟前',
        '三分钟前',
        '四分钟前',
        '五分钟前'
    ][~~(del / 60)] || [
        [year, day, month].join('-'),
        [h, m].join(':')
    ].join(' ');
}