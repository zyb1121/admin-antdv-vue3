import { get } from '../../utils/request';
const prefix = '/system/message';
export default { list: (params: object) => get(`${prefix}`, params) };
