<template>
  <a-layout class="layout">
    <LHeader v-model:collapse="collapse" class="layout-header-fixed">
      <template #logo>
        <LLogo style="margin: 0 20px 0 0"></LLogo>
      </template>
    </LHeader>
    <a-layout class="layout-main">
      <a-layout-sider v-model:collapsed="collapse" :theme="theme" :trigger="null" collapsible breakpoint="lg">
        <LSider v-model:collapse="collapse" :menus="menus" :theme="theme"></LSider>
      </a-layout-sider>
      <a-layout-content class="app-scroll-wrap">
        <LBreadCrumb v-model:collapse="collapse" :menus="menus" />

        <router-view v-slot="{ Component, route }">
          <transition mode="out-in" name="slide">
            <div class="app-main" :key="route.path"><component :is="Component" /></div>
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import LSider from '@/layouts/components/LSider.vue';
import LLogo from '@/layouts/components/LLogo.vue';
import LHeader from '@/layouts/components/LHeader.vue';
import LBreadCrumb from '@/layouts/components/LBreadCrumb.vue';
import { convertToTree } from '@/utils';
import { getStorage } from '@/utils/storage';
import type { IMenu } from 'types/interface/common';
import { useRootStore } from '@/store';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import type { IUser } from 'types/interface/system';
const rootStore = useRootStore();
const { theme } = storeToRefs(rootStore);
const { push } = useRouter();
const userInfo = getStorage<IUser>('userinfo');
if (userInfo) {
  rootStore.setUserinfo(userInfo);
} else {
  push('/login');
}
let menus: IMenu[] = getStorage('menus') || [];
menus = menus.filter((item) => item.type === 0);
menus = convertToTree({
  data: menus,
  pid: 0
});
const collapse = ref(false);
</script>
<style lang="less" scoped>
.layout {
  min-width: 1200px;
  height: 100vh;
  background: #f0f2f5;
}
.layout-header-fixed {
  position: fixed;
  width: 100%;
}
.app-scroll-wrap {
  width: 100%;
  height: calc(100vh - 64px);
  overflow-y: auto;
}
.layout-main {
  padding-top: 64px;
}
.app-main {
  padding: 16px;
  //margin: 20px;
  border-radius: 5px;
  overflow-y: auto;
  //background: #fff;
}
.ant-layout-sider {
  height: 100%;
  overflow: auto;
}
.page-wrap {
  min-height: calc(100vh - 244px);
}
.page-control {
  margin-bottom: 4px;
  .space {
    margin: 0 4px;
  }
}
</style>
