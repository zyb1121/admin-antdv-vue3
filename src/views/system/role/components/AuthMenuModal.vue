<template>
  <a-modal :visible="show" title="授权" :keyboard="false" :mask-closable="false" @cancel="handleCancel" @ok="handleOk">
    <div class="auth-menu-wrap">
      <div style="padding-bottom: 10px">
        <a-checkbox v-model:checked="state.checkAll" @change="handleCheckAll">全选</a-checkbox>
      </div>
      <a-tree v-model:checkedKeys="state.checkedKeys" checkable :tree-data="state.menus" :replace-fields="{ children: 'children', title: 'title', key: 'id' }" @check="onCheck" />
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { getStorage } from '@/utils/storage';
import { convertToTree } from '@/utils';
import type { IMenu } from 'types/interface/common';
import { reactive } from 'vue';
const menu = getStorage<IMenu[]>('menus') || [];
const menuTree = convertToTree({
  data: menu,
  pid: 0
});
interface IProps {
  show: boolean;
  value: any[];
}
const props = withDefaults(defineProps<IProps>(), {
  show: false,
  value: () => []
});
const emit = defineEmits(['update:show', 'update:value', 'cancel', 'confirm']);
const state = reactive({
  menus: menuTree,
  checkedKeys: props.value,
  checkAll: false
});
function handleCancel() {
  emit('update:show', false);
  emit('cancel');
}
function handleOk() {
  emit('update:value', state.checkedKeys);
  emit('update:show', false);
  emit('confirm', state.checkedKeys);
}
// 全选操作
function handleCheckAll() {
  if (state.checkAll) {
    state.checkedKeys = getAllIds(state.menus);
  } else {
    state.checkedKeys = [];
  }
}
function onCheck(checkedKeys: string[], e: { checked: boolean }) {
  e.checked || (state.checkAll = false);
}
function getAllIds(data: IMenu[], ids: string[] = []) {
  data.forEach((item: IMenu) => {
    ids.push(item.id as unknown as string);
    item.children && getAllIds(item.children, ids);
  });
  return ids;
}
</script>

<style lang="less" scoped>
.auth-menu-wrap {
  max-height: 500px;
  overflow-y: auto;
}
</style>
