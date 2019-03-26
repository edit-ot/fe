import axios from "axios";

export type StdResp<T> = {
    code: number, 
    msg?: string,
    data?: T
}

export const http = {
    get<T>(url: string, params: any = {}): Promise< StdResp<T> > {
        return axios.get(url, {
            params
        }).then(response => {
            if (response.status === 200) {
                const ret: StdResp<T> = response.data;

                return Promise.resolve(ret);
            } else {
                return Promise.reject(response.data as StdResp<T>);
            }
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
