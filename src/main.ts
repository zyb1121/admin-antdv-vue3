import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import plugins from '@/plugins';
import directives from '@/directives';
import config from '@/config';
import '@/assets/styles/common.less';
import App from './App.vue';
// 在开发时导入全部antd样式，让vite预构建
(() => import.meta.env.DEV && import('ant-design-vue/dist/antd.less'))();

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(plugins); // 注册插件
app.use(directives); // 注册指令
app.provide('$pagination', config.pagination); // 注入分页配置
app.mount('#app');
export default app;
