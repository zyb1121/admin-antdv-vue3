<template>
  <a-sub-menu :key="antKey">
    <template #title>
      <icon-font v-if="item.icon" :type="item.icon" />
      <span>{{ item.title }}</span>
    </template>
    <template v-for="subItem in item.children">
      <template v-if="!subItem.hide">
        <l-sub-menu
          v-if="Array.isArray(subItem.children) && subItem.children.length >= 1"
          :key="`${subItem.url}-if`"
          :level="level + 1"
          :item="subItem"
          :ant-key="subItem.url"
          :collapse="collapse"
        ></l-sub-menu>
        <a-menu-item v-else :key="subItem.url">
          <router-link :to="subItem.url">
            <icon-font :type="subItem.icon" v-if="subItem.icon" />
            <span>{{ subItem.title }}</span>
          </router-link>
        </a-menu-item>
      </template>
    </template>
  </a-sub-menu>
</template>

<script lang="ts" setup>
import type { IMenu } from 'types/interface/common';

interface IProps {
  level?: number;
  antKey?: string;
  item: IMenu;
  collapse?: boolean;
}
withDefaults(defineProps<IProps>(), {
  level: 0,
  antKey: '',
  collapse: false
});
</script>
