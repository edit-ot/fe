import axios from "axios";

export type StdResp<T> = {
    code: number, 
    msg?: string,
    data?: T
}

export const http = {
    get(url: string, params: any) {
        return axios.get(url, {
            params
        });
    },

    post<T = any>(url: string, data: any): Promise< StdResp<T> > {
        return axios.post(url, data).then(response => {
            if (response.status === 200) {
                const ret: StdResp<T> = response.data;

                return Promise.resolve(ret);
            } else {
                return Promise.reject(response.data as StdResp<T>);
            }
        });
    }
}
