<template>
  <AuthWrap :auth="auth">
    <a-button v-bind="$attrs"><slot></slot></a-button>
  </AuthWrap>
</template>
<script lang="ts">
export default {
  name: 'AuthButton'
};
</script>
<script lang="ts" setup>
import AuthWrap from './index.vue';
interface IProps {
  auth?: string;
}
withDefaults(defineProps<IProps>(), { auth: '' });
</script>
