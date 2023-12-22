import type { RequestConfig } from '@/utils/request/Request';
import { get } from '../../utils/request';
const prefix = '/system/config';
export default {
  list: <T = any>(params: object, config?: RequestConfig) => get<T>(`${prefix}`, params, config)
};
