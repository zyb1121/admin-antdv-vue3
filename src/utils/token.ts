import config from '@/config';
import router, { resetRouter } from '@/router';
import Cookie from 'js-cookie';
import { clearStorage } from './storage';
const refreshAheadTime = config.refreshAheadTime;
const { tokenExpiresKey, refreshTokenKey, tokenKey } = config;
/**
 * 获取token
 */
export function getToken() {
  return Cookie.get(tokenKey);
}
/**
 * 设置token
 * @param token
 */
export function setToken(token: string) {
  return Cookie.set(tokenKey, token);
}
/**
 * 移除token
 */
export function removeToken() {
  return Cookie.remove(tokenKey);
}
/**
 * 计算过期时间
 * @param expiresTime
 * @returns
 */
export function computedExpires(expiresTime: number) {
  return Date.now() + expiresTime * 1000 - refreshAheadTime;
}
/**
 * 保存认证信息
 * @param authData
 */
export function saveAuthData(authData: { access_token: string; refresh_token: string; expires_in: number }) {
  Cookie.set(tokenKey, authData.access_token);
  Cookie.set(refreshTokenKey, authData.refresh_token);
  Cookie.set(tokenExpiresKey, String(computedExpires(authData.expires_in)));
}
/**
 * 清除认证信息
 */
export function clearAuthData() {
  Cookie.remove(tokenKey);
  Cookie.remove(refreshTokenKey);
  Cookie.remove(tokenExpiresKey);
}
// 登出
export function logout() {
  clearAuthData();
  clearStorage();
  router.replace('/login');
  resetRouter();
  // location.reload();
}
