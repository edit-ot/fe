import { User } from "../../../components/Login";

const COLORS = [
    'rgb(203,187,88)',
    'rgb(154,173,189)',
    'rgb(192,89,73)',
    'rgb(149,79,71)',
    'rgb(117,58,72)',
];

function hashCode(str: string) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function hashColor(str: string) {
    const hash = hashCode(str);
    return COLORS[hash % COLORS.length];
}

export class DomStyle {
    style: string = '';
    $style: HTMLStyleElement = null;

    update(style: string) {
        this.style = style;
        this.unmount();
        this.mount();
    }

    mount() {
        const $style = document.createElement('style');
        $style.innerHTML = this.style;
        this.$style = $style;
        document.body.appendChild($style);
    }

    unmount() {
        this.$style && this.$style.remove()
    }
}

export class UserDomStyle extends DomStyle {
    calc(users: User[]) {
        return users.map(u => {
            const cls = `.author-${ u.username }`;
            const c = hashColor(u.username);
            return `${cls} {
                color: ${ c }; 
                border-bottom: 2px dotted ${c};
                position: relative;
            }
            ${cls}::after {
                content: "${ u.username }";
                position: absolute;
                content: "eczn";
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: #222;
                padding: 2px 12px;
                font-size: 12px;
                display: none;
            }

            ${cls}::after:hover {
                display: block;
            }
            `;
        }).join('\n');
    }

    reload(users: User[]) {
        this.update(this.calc(users));
    }
}

export const userDomStyle = new UserDomStyle();
