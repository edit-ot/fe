import { Popup } from "../../../Ctx/Popup";
import { searchUser } from "../../../components/ChangePermissionPopup/cpp-api";
import { GeneralPermission } from "../../../components/GeneralPermissionProps";

import { setPermissionRemote } from "./group-api";
import { Group } from "../homeaside-api";

export function openManage(popup: Popup, group: Group, onPop?: () => void) {
    if (group.pmap) {

        popup.push(GeneralPermission, {
            title: '小组成员管理',

            getData() {
                return Promise.resolve(group);
            },

            searchUser,

            setPermission(g, username, rw) {
                setPermissionRemote(group.groupId, username, rw);
            },

            delPermission(g, username) {
                setPermissionRemote(group.groupId, username);
                return true;
            }
        }, {
            style: { backgroundColor: 'rgba(0, 0, 0, .5)' }
        }, onPop);
    }
}