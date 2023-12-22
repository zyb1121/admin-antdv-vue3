<template>
  <a-switch checked-children="开" un-checked-children="关" :checkedValue="1" :unCheckedValue="0" v-bind="attrs" v-model:checked="value" />
</template>

<script lang="ts" setup>
import { computed, useAttrs } from 'vue';
interface IProps {
  value?: number | string;
  isEdit?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  value: '',
  isEdit: true
});
const attrs = useAttrs();
const emit = defineEmits(['input']);
const value = computed({
  get() {
    return props.value;
  },
  set(val) {
    emit('input', val);
  }
});
</script>
