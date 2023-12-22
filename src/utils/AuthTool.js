/*
 * @Author: Bwrong
 * @Github: https://github.com/BWrong
 * @Date: 2020-07-03 15:57:14
 * @LastEditors: Bwrong
 * @LastEditTime: 2020-11-30 17:01:46
 */
const Storage = localStorage; // 设置要使用的存储器
// 🐶TODO：考虑使用单例模式，分离副作用
class AuthTool {
  permissions = []; // 权限数据，包含菜单和按钮的
  menus = []; // 菜单数据
  routes = []; // 路由
  authMap = {}; // 权限映射表
  menuMap = {}; // 菜单映射表
  routeMap = {}; // 路由映射表
  authRoutes = []; // 清洗后，有权限额路由，用于动态注册路由
  menusWithPath = []; // 添加了path/url的菜单，用于渲染导航
  authKey = 'permission';
  saveStorage; // 存储antumap的函数
  constructor({ routes = [], permissions = [], authKey = 'permission', saveStorage = _setAuthMapToStorage }) {
    this.authKey = authKey;
    this.routes = routes;
    this.permissions = permissions;
    const { menus, authMap, menuMap } = this._separateByType(permissions);
    this.authMap = authMap;
    this.menuMap = menuMap;
    this.menus = menus;
    this.saveStorage = saveStorage;
    this.authRoutes = this._getAuthRoutes(this.routes);
    this.menusWithPath = this._addPathOfMenus(this.routeMap, this.menus);
    saveStorage(authMap);
  }
  /**
   * 获取菜单列表
   */
  getMenuList() {
    return this.menusWithPath;
  }
  getAuthRoutes() {
    return this.authRoutes;
  }
  /**
   * 清洗路由，获取具有权限的路由
   * @param {*} routes 前端路由映射表
   * @param {*} menuMap 权限标识表，map
   */
  _getAuthRoutes(routes = this.routes, menuMap = this.menuMap) {
    let authRoutes = [];
    routes.forEach((route) => {
      let newRoute = { ...route };
      if (this._checkAuth(newRoute, menuMap)) {
        newRoute.children && (newRoute.children = this._getAuthRoutes(newRoute.children, menuMap));
        authRoutes.push(newRoute);
        route.meta && (this.routeMap[route.meta.permission] = route); // 将路由存入routeMap
      }
    });
    return authRoutes;
  }
  /**
   * 分离数据，如果后端返回的权限菜单和权限在一起，可用此方法通过type区分进行数据分离,
   * 菜单menus中不会加入type为authorityType中值的项
   * @param {*} permissions
   * @param {*} authorityType 该参数中定义的type值不会被放入menus中
   */
  _separateByType(permissions, authorityType = [2]) {
    let menus = [];
    let authMap = {};
    permissions.forEach((item) => {
      authMap[item[this.authKey]] = item;
      // if (!authorityType.includes(item.type)) {
        menus.push(item);
      // }
    });
    return {
      menus,
      authMap,
      menuMap: authMap
    };
  }
  /**
   * 清洗方法，权限标识不存在或者存在且匹配返回true
   * @param {*} route 路由对象
   * @param {*} menuMap 权限标识表，map
   */
  _checkAuth(route, menuMap) {
    return route.meta?.permission ? !!menuMap[route.meta.permission] : true;
  }
  /**
   * 为菜单添加path
   * TODO: 增加对相对路径的支持
   * @param {*} routesMap
   * @param {*} menus
   */
  _addPathOfMenus(routeMap = {}, menus = []) {
    menus.map((item) => {
      item.url = (item[this.authKey] && routeMap[item[this.authKey]]?.path) || '';
      if (item.children && item.children.length) {
        this._addPathOfMenus(routeMap, item.children);
      }
    });
    return menus;
  }
}
export default AuthTool;

/**
 * 注册权限指令
 * @param {*} hidden 无权限时是否隐藏按钮
 * @param {*} disabledClass 无权限时按钮添加的class，配合UI库用，默认使用elementUI，仅在hidden为false有效
 */
export const authDirective = {
  install(Vue, { hidden = true, disabledClass = 'is-disabled', directiveName = 'auth', getStorage = _getAuthMapFromStorage } = {}) {
    const hasAuth = _hasAuth.bind(Vue, getStorage);
    Vue.prototype.$hasAuth = hasAuth;
    Vue.directive(directiveName, {
      inserted(el, binding) {
        if (!hasAuth(binding.value)) {
          if (!hidden) {
            el.setAttribute('disabled', true);
            el.setAttribute('title', '您没有操作权限！');
            el.className += ` ${disabledClass}`;
            return;
          }
          el.parentNode && el.parentNode.removeChild(el);
        }
      }
    });
  }
};
/**
 * 检测传入的标识是否有权访问
 * @param {*} authValue
 */
function _hasAuth(authValue, getStorage) {
  this.$authMap = this.$authMap || getStorage();
  return !!this.$authMap[authValue];
}
/********** 工具函数 ************/
/**
 * 将一维数组格式转换成树结构
 * TODO: 考虑使用尾递归优化算法
 * @param {*} data  需要转换的数据
 * @param {*} pid   顶级节点的id
 * @param {*} children   子集标识key
 * @param {*} pidName    父级标识key
 * @param {*} idName     id标识key
 */
export function convertToTree(data, pid = 0, children = 'children', pidName = 'parentId', idName = 'id') {
  let arr = [];
  data.map((item) => {
    if (item[pidName] === pid) {
      let child = item[children] || [];
      item[children] = child.concat(convertToTree(data, item[idName], children, pidName, idName));
      arr.push(item);
    }
  });
  return arr;
}
/**
 * 从数组中根据id获取所有父级元素，返回数组
 * TODO: 考虑使用尾递归优化算法
 * @param id  // 当前项的id
 * @param data  // 要查找的数组
 * @param {*} idName     id标识key
 * @param {*} pidName    父级标识key
 * @param result // 返回结果
 */
export function getParentsFromArray(id, data, idName = 'id', pidName = 'parentId', result = []) {
  for (const item of data) {
    if (item[idName] === id) {
      result.unshift(item);
      getParentsFromArray(item[pidName], data, idName, pidName, result);
    }
  }
  return result;
}
/**
 * 从permission获取所有父级permission,注意，此方式要求permission命名遵循层级关系
 * @param permission
 */
export function getParentsFromPermission(permission) {
  return permission.split('/').reduce((temp, item) => {
    temp.push((temp[temp.length - 1] || '') + (item ? '/' : '') + item);
    return temp;
  }, []);
}
/**
 * 存储authMap到缓存
 * @param {*} authMap 权限映射表
 */
function _setAuthMapToStorage(authMap) {
  Storage.setItem('authMap', JSON.stringify(authMap));
}
// 从缓存获取authMap
function _getAuthMapFromStorage() {
  return JSON.parse(Storage.getItem('authMap') || '{}');
}
