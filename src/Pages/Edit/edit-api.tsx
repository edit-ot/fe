import { http } from "../../utils/http";
import { DocInfo } from "../Home/Doc/doc-api";

export function getDocById(docId: number) {
    return http.get<DocInfo>('/api/doc/byId', {
        docId
    }).then(resp => {
        return resp.code === 200 && resp.data ? 
            Promise.resolve(resp.data) : 
            Promise.reject(resp);
    });
}
