<template>
  <span v-if="type === 'icon'" class="delete-button-icon" v-bind="$attrs" @click.stop="handleClick">
    <icon-font type="icon-delete" title="删除"></icon-font>
    <slot></slot>
  </span>
  <a-button v-else-if="type === 'button'" danger size="small" v-bind="$attrs" @click.stop="handleClick">
    <slot>删除</slot>
  </a-button>
</template>

<script lang="tsx" setup>
import { Modal } from 'ant-design-vue';
interface IProps {
  title?: string;
  type?: 'button' | 'icon';
}
const props = withDefaults(defineProps<IProps>(), {
  title: '',
  type: 'button'
});
const emit = defineEmits(['confirm']);
function handleClick() {
  Modal.confirm({
    title: () => '提示',
    content: () => (props?.title ? <span>您确定要删除【{<span class="text-primary">{props.title}</span>}】吗？</span> : '您确定要删除该数据吗？'),
    okButtonProps: { danger: true },
    onOk: () => {
      emit('confirm');
    }
  });
}
</script>
<style lang="less" scoped>
.delete-button-icon {
  color: @error-color;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}
</style>
