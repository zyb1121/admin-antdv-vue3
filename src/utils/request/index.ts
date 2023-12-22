/*
 * @Author: Bwrong
 * @Github: https://github.com/BWrong
 * @Date: 2022-09-06 14:12:08
 * @LastEditors: Bwrong
 * @LastEditTime: 2022-10-19 17:00:10
 */
// import Qs from 'qs';
import appConfig from '@/config';
import { handleNetworkError, handleCheckAuth, handleBusinessError, handleShowTips } from './helper';
import Request, { type RequestConfig } from './Request';
import { getToken } from '../token';
import { downloadFile } from '..';
const { apiHost, tokenPrefix } = appConfig;
export type ResponseType = {
  code: number;
  msg: string;
  data: {
    current: number;
    list: any[];
    size: number;
    total: number;
  };
  [key: string]: any;
};

const request = new Request<ResponseType>({
  timeout: 30000,
  baseURL: apiHost,
  // responseType: 'json',
  withCredentials: false, // 是否允许带cookie
  // paramsSerializer:(params) => Qs.stringify(params, {allowDots: true}), // 开启qs序列化
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  // validateStatus: function () {
  // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
  // return true;
  // }
  // 取消重复请求
  cancelDuplicateRequest: true,
  interceptors: {
    requestInterceptor(config) {
      // 注入认证信息
      const token = getToken();
      token && request.setHeader({ Authorization: `${tokenPrefix} ${token}` });
      // 检查更新认证信息
      handleCheckAuth(config);
      return config;
    },
    responseInterceptor({ data, config }) {
      // 跳过拦截器
      if (config.skipIntercept) return Promise.resolve(data);
      if (data.code === 200) {
        // 自动提示
        handleShowTips(data, config);
        return Promise.resolve(data.data);
      }
      // 处理业务错误
      handleBusinessError(data);
      return Promise.reject(data);
    },
    responseInterceptorCatch(error) {
      handleNetworkError(error);
      return Promise.reject(error);
    }
  }
});

export default request;

export const get = request.get.bind(request);
export const post = request.post.bind(request);
export const put = request.put.bind(request);
export const patch = request.patch.bind(request);
export const del = request.delete.bind(request);
/**
 * 下载文件
 * @param fileName 文件名
 * @param url
 * @param data
 * @param config
 * @returns
 */
export const download = (fileName: string, url: string, data?: any, config?: RequestConfig) => {
  return request
    .get<Blob>(url, data, {
      skipIntercept: true,
      skipShowTips: true,
      responseType: 'blob',
      ...config
    })
    .then((res) => downloadFile(res, fileName))
    .catch((err) => {
      console.log('文件下载失败：', err);
    });
};
/**
 * 上传文件
 * @param url
 * @param data
 * @param config
 * @returns
 */
export const upload = (url: string, data?: any, config?: RequestConfig) => {
  return request.post(url, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
    ...config
  });
};
