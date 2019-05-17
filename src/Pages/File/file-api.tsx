import { http } from "../../utils/http";
import { FileItem } from "../../components/GroupInfoUpdater/api";

export function getFilesRemote() {
    return http.get$<FileItem[]>('/api/file');
}

export function uploadAnFile(file: File) {
    const data = new FormData();

    data.append('file', file);
    data.append('fileName', file.name);

    return http.post$<FileItem>('/api/user/upload-file', data, {
        headers: { 'Content-Type' : 'multipart/form-data' }
    });
}

