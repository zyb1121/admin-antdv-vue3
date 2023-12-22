<template>
  <a-input v-if="props.isEdit" v-model:value="value" v-bind="attrs" />
  <span v-else>{{ value }}</span>
</template>

<script lang="ts" setup>
import { computed, useAttrs } from 'vue';

const attrs = useAttrs();

interface IProps {
  value?: number | string;
  isEdit?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  isEdit: true,
  value: ''
});
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
