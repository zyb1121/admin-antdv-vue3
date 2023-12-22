/* eslint-disable @typescript-eslint/ban-types */
// vue
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
