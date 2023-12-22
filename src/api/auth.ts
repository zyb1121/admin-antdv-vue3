import { get, post } from '../utils/request';
interface LoginRes {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}
interface LoginParams {
  username: string;
  password: string;
  code: string;
}
export default {
  login: (params: LoginParams) =>
    post<LoginRes, LoginParams>('/auth/login', params, {
      skipCheckAuth: true,
      skipShowTips: true
    }),
  refreshToken: (params: object) =>
    post('/auth/refresh_token', params, {
      skipCheckAuth: true,
      skipShowTips: true
    }),
  getMenus: () => get('/auth/menus'),
  unloadCount: () => get('/auth/unreadCount')
};
