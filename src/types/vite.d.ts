/// <reference types="vite/client" />

// 环境变量
interface ImportMetaEnv {
  VITE_APP_TITLE: string;
  VITE_APP_API_HOST: string;
  VITE_APP_API_PREFIX: string;
  VITE_APP_MOCK_PRODUCTION: boolean;
  VITE_APP_BUILD_REPORT: boolean;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// export { };
