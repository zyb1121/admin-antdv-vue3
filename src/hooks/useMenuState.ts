import type { IMenu } from '@/types/interface/common';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

/**
 * 获取当前路由/菜单相关信息
 */
export default (menus: IMenu[]) => {
  const route = useRoute();
  const activeMenu = computed(() => route.meta?.activeMenu || '');
  const matchedParentChain = computed(() => {
    const matched = findParentChain(menus, (item) => item.url === (activeMenu.value || route.path)) || [];
    return matched;
  });
  return {
    matchedParentChain,
    activeMenu
  };
};
/**
 *
 * @param tree 数状数据
 * @param filter 过滤函数
 * @param options 选项
 * @returns 返回满足过滤函数的元素在树状数据中的父级链
 */
export function findParentChain(
  tree: { [k: string]: any }[],
  filter: (item: any) => boolean,
  options?: {
    parentChain?: any[];
  }
) {
  const parentChain = options?.parentChain || [];

  if (!tree) return [];
  for (const data of tree) {
    parentChain.push(data);
    if (filter(data)) return parentChain;
    if (data.children) {
      const findChildren = findParentChain(data.children, filter, { parentChain });
      if (findChildren.length) return findChildren;
    }
    parentChain.pop();
  }
  return [];
}
