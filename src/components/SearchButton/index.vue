<template>
  <a-space>
    <slot></slot>
    <a-input v-model:value="searchWord" :placeholder="placeholder" allow-clear :style="{ width: inputWidth }" @change="onChange" />
    <slot name="suffix"></slot>
    <a-button type="primary" :loading="loading" @click="handleSearch">搜索</a-button>
    <a-button type="primary" ghost @click="handleReset">重置</a-button>
  </a-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
interface IProps {
  placeholder?: string;
  modelValue?: string;
  loading?: boolean;
  inputWidth?: string;
}
const props = withDefaults(defineProps<IProps>(), {
  placeholder: '请输入搜索关键词',
  modelValue: '',
  loading: false,
  inputWidth: '200px'
});
const emit = defineEmits(['update:modelValue', 'search', 'reset']);
const searchWord = ref(props.modelValue);
function onChange({ target }: any) {
  emit('update:modelValue', target.value);
}
function handleSearch() {
  emit('search', searchWord.value);
}
function handleReset() {
  searchWord.value = '';
  emit('update:modelValue', '');
  emit('reset');
}
</script>
