import axios, { AxiosRequestConfig } from "axios";

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

    get$<T>(url: string, params: any = {}) {
        return http.get<T>(url, params).then(resp => {
            return resp.code === 200 ? 
                Promise.resolve(resp.data) : 
                Promise.reject(resp);
        });
    },

    post<T = any>(url: string, data: any = {}, config?: AxiosRequestConfig): Promise< StdResp<T> > {
        return axios.post(url, data, config).then(response => {
            if (response.status === 200) {
                const ret: StdResp<T> = response.data;

                return Promise.resolve(ret);
            } else {
                return Promise.reject(response.data as StdResp<T>);
            }
        });
    },

    post$<T>(url: string, data: any = {}, config?: AxiosRequestConfig) {
        return http.post<T>(url, data, config).then(resp => {
            return resp.code === 200 ? 
                Promise.resolve(resp.data) : 
                Promise.reject(resp);
        });
    }
}

//@ts-ignore
window.http = http;
