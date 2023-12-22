import type { App } from 'vue';
// import debounce from './debounce';
import { getStorage } from '@/utils/storage';
import { authDirective } from '@bwrong/auth-tool';
import AuthButton from '@/components/AuthWrap/AuthButton.vue';
let authMap: string[] | null = null;
// const directives = {
//   debounce
// };
export default (app: App) => {
  // 注册指令
  // Object.keys(directives).forEach((key) => {
  //   app.directive(key, directives[key]);
  // });
  // 注册权限指令及按钮
  app
    .use(authDirective, {
      hasAuth(authValue: string) {
        authMap = authMap || getStorage('permissions');
        return authMap?.includes(authValue);
      }
    })
    .component('AuthButton', AuthButton);
};
