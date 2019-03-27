import { http } from "../../utils/http";
import { DocInfo } from "../Home/Doc/doc-api";

export function getDocById(docId: number) {
    return http.get<DocInfo>('/api/doc/byId', {
        docId
    });
}
