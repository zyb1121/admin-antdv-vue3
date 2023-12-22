import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import NProgress from '@/plugins/nprogress';
import { setStorage, getStorage } from '@/utils/storage';
import config from '@/config';
import routes, { noMatchRoute } from './constRoutes';
import asyncRoutes from './asyncRoutes';
// import { ganerAuthData } from '@bwrong/auth-tool';
import AuthTool from '../utils/AuthTool';
import useTitle from '@/hooks/useTitle';
import { getToken } from '@/utils/token';
// import authApi from '@/api/auth';
let routerLoaded = false; // 动态路由是否已加载
let removeRouters: Array<() => void> = [];
// 创建路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({
    top: 0,
    left: 0
  }),
  routes
});
router.beforeEach(async (to) => {
  NProgress.start();
  const token = getToken();
  // 其实路由拦截后所做跳转仅有以下几种情况：
  // 1.已登录时跳转到登录页（非登出的情况）需要重定向到根路径
  if (to.path === '/login' && token) return '/';
  // 2.路由在白名单，或者已经登录且动态路由已加载完成，均放行
  if (config.whiteRoutes.includes(to.path) || (token && routerLoaded)) return;
  // 3.未登录且不在白名单，重定向到登录页，带上回调地址，方便回归
  if (!token) return `/login?redirect=${encodeURIComponent(to.fullPath)}`;
  // 4.根据后台返回权限标识洗出有权限的路由，并将洗过的路由表动态添加到路由中
  const allowRoutes = await _getAllowRoutes(asyncRoutes);
  allowRoutes.push(noMatchRoute);
  // 未加载则动态加载
  removeRouters = allowRoutes.map((item) => router.addRoute(item));
  routerLoaded = true;
  return {
    ...to,
    replace: true
  };
});

// 路由后置守卫
router.afterEach((to) => {
  NProgress.done();
  // 设置页面标题
  useTitle(to.meta?.title ? `${to.meta.title} - ${config.appTitle}` : `${config.appTitle}`);
});

// 获取路由
async function _getAllowRoutes(asyncRoutes: RouteRecordRaw[]) {
  // const menus = await authApi.getMenus().then((res: any) =>  {
  //   setStorage('userinfo', res.detail);
  //   return res.menus;
  // });

  const menus = getStorage<Record<string, unknown>[]>('rawMenu') || [];
  return _ganerRoutesAndMenus(asyncRoutes, menus);
}
/**
 * 生成权限路由和菜单
 * @param {*} routes 需要鉴权的路由
 * @param {*} permissions 菜单和权限标识集
 */
function _ganerRoutesAndMenus(routes: Array<RouteRecordRaw>, permissions: Record<string, unknown>[]) {

  /**/
  const authTool = new AuthTool({ routes, permissions });
  let filterRoutes = authTool.getAuthRoutes();
  const menus = authTool.getMenuList();
  /**/

  // const {
  //   routes: filterRoutes,
  //   menus,
  //   authMap
  // } = ganerAuthData({
  //   routes,
  //   permissions,
  //   authKey: 'permission'
  // });
  console.log(filterRoutes);

  // setStorage('authMap', authMap);
  setStorage('menus', menus);
  return filterRoutes as RouteRecordRaw[];
}
// 重置路由
export function resetRouter() {
  removeRouters.map((item) => item());
  routerLoaded = false;
}
export default router;
