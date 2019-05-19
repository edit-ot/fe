import { http } from "../../../utils/http";
import { User } from "../../../components/Login";
import { Group } from "../homeaside-api";
import { DocInfo } from "../Doc/doc-api";

export type ResultData = {
    users: User[];
    groups: Group[];
    docs: DocInfo[]
}

export function searchRemote(q: string) {
    return http.get$<ResultData>('/api/sys/search', {
        q
    });
}
