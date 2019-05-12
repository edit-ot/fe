import { Popup, popup$ } from "../../../Ctx/Popup";
import { searchUser } from "../../../components/ChangePermissionPopup/cpp-api";
import { GeneralPermission } from "../../../components/GeneralPermissionProps";

import { setPermissionRemote } from "./group-api";
import { Group } from "../homeaside-api";
import { GroupInfoUpdater } from "../../../components/GroupInfoUpdater";

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

export function openGroupInfoUpdater(group: Group) {
    console.log('openGroupInfoUpdater');

    popup$.push(GroupInfoUpdater, {
        group
    }, {
        style: { backgroundColor: 'rgba(0, 0, 0, .5)' }
    })
}
