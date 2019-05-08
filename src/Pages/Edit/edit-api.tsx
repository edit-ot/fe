import { http } from "../../utils/http";
import { DocInfo, DocInfoWithPmap } from "../Home/Doc/doc-api";

export function getDocById(docId: number) {
    return http.get<DocInfo>('/api/doc/byId', {
        docId
    }).then(resp => {
        return resp.code === 200 && resp.data ? 
            Promise.resolve(resp.data) : 
            Promise.reject(resp);
    });
}

export function getDocWithPmapById(docId: number) {
    return http.get<DocInfoWithPmap>('/api/doc/byId', {
        withPmap: true,
        docId
    }).then(resp => {
        return resp.code === 200 && resp.data ? 
            Promise.resolve(resp.data) : 
            Promise.reject(resp)
    });
}

export type NewDocData = Partial< Pick<DocInfo, 'title' | 'content'> > & Pick<DocInfo, 'id'>;
export function docSave(newDocData: NewDocData) {
    
    return http.post<NewDocData>('/api/doc/save', newDocData).then(resp => {
        return resp.code === 200 && resp.data ? 
            Promise.resolve(resp.data) : 
            Promise.reject(resp);
    })
}
