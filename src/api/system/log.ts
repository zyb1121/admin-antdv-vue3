import { get } from '../../utils/request';
const prefix = '/system/log';
export default { list: (params: object) => get(`${prefix}`, params) };
