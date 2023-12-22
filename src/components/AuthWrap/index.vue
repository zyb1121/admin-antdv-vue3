<template>
  <slot v-if="hasAuth" v-bind="$attrs"></slot>
</template>
<script lang="ts">
export default {
  name: 'AuthWrap'
};
</script>
<script lang="ts" setup>
import { computed } from 'vue';
import { getStorage } from '@/utils/storage';
interface IProps {
  auth?: string;
}
const props = withDefaults(defineProps<IProps>(), { auth: '' });
const permissions = Object.freeze(getStorage<string[]>('permissions')) || [];
const hasAuth = computed(() => !props.auth || permissions.includes(props.auth));
</script>
