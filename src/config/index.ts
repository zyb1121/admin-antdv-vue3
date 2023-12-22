const { PROD, VITE_APP_TITLE, VITE_APP_API_HOST, VITE_APP_API_PREFIX } = import.meta.env;
const apiHost = PROD ? VITE_APP_API_HOST : VITE_APP_API_PREFIX;
import type { MenuTheme } from 'ant-design-vue/es';
import pkg from '../../package.json';
export default {
  // 基础配置
  appTitle: VITE_APP_TITLE, // 应用名称，用于显示在浏览器标签
  appVersion: pkg.version,
  cryptoKey: '', // 密码加密使用的盐
  apiHost: apiHost as string, //接口服务器地址
  // token相关配置
  tokenKey: 'auth_token', // token在cookie中的key
  refreshTokenKey: 'refresh_token', // 刷新token在cookie中的key
  tokenExpiresKey: 'token_expires', // token过期时间在cookie中的key
  refreshAheadTime: 1800000, // 在token过期时间前提前多久更新token
  tokenPrefix: 'Bearer',
  // 路由相关配置
  homePage: '/home', // 登入应用默认的页面
  whiteRoutes: ['/login', '/err'], // 路由白名单
  // 样式相关配置
  theme: 'light' as MenuTheme,
  // lang: 'zh_CN',
  pagination: {
    showSizeChanger: false,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`,
    size: 'small',
    current: 1,
    defaultPageSize: 10,
    pageSize: 10,
    total: 0
  }
};
