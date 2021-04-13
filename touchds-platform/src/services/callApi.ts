import axios from 'axios';
import { createHeaders } from './createHeader';
import { getApiBaseName } from './baseName';

/**
 * [全局公共插件]
 * @return {[object]} [插件对象]
 */
export async function callApi(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any) {
   const bodyStream = data && method.toUpperCase() !== 'GET' ? JSON.stringify(data) : '';
   endpoint = paramsForGetMethod(endpoint, method, data);

   const headers = createHeaders(method, endpoint, bodyStream);
   return axios({
       method: method || 'POST',
       url: endpoint,
       data: bodyStream,
       timeout: 20000,
       responseType: 'json',
       headers
   })
       .then((res: any) => Promise.resolve(res.data))
       .catch((error) => {
           const toThrow = error.response.data || error;
           console.error(toThrow);
           throw toThrow;
       });
}

// 设置请求方法GET的参数
function paramsForGetMethod(endpoint: string, method: string, data: any) {
    if (method.toUpperCase() === 'GET' && data && typeof (data) === 'object') {
        const paramsArr: any = [];
        const keys = Object.keys(data);
        keys.forEach((key) => {
            paramsArr.push(`${key}=${data[key].toString()}`);
        });
        endpoint = paramsArr.length ? `${endpoint}?${paramsArr.join('&')}` : endpoint;
    }

    return endpoint;
}

// 设置api前缀
export function apiPrefix(endpoint: string) {
    return getApiBaseName.api + endpoint;
}
