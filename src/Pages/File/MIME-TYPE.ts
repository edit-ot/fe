// @ts-ignore
import ICON_IMAGE from "../../icons/image.svg";
// @ts-ignore
import ICON_TEXT from "../../icons/txt.svg";
// @ts-ignore
import ICON_UNKNOWN from "../../icons/unknown.svg";


import { FileItem } from "../../components/GroupInfoUpdater/api";
export const MIMETYPE_ICON_MAP = {
    'image/png': ICON_IMAGE,
    'image/jpg': ICON_IMAGE,
    'image/jpeg': ICON_IMAGE,
    
    'unknown': ICON_UNKNOWN
}

export function getMIMEIcon(file: FileItem) {
    if (MIMETYPE_ICON_MAP[file.type]) {
        return MIMETYPE_ICON_MAP[file.type];
    }

    if (file.fileName.endsWith('.md')) {
        return ICON_TEXT;
    }

    return MIMETYPE_ICON_MAP.unknown;
}

export function getFileType(file: FileItem) {
    const icon = getMIMEIcon(file);

    if (icon === ICON_TEXT) {
        return 'TEXT'
    } else if (icon === ICON_IMAGE) {
        return 'IMAGE'
    } else {
        return 'UNKNWON'
    }
}

// @ts-ignore
window.MIMETYPE_ICON_MAP = MIMETYPE_ICON_MAP
