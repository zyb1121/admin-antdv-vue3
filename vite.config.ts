import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv, type ConfigEnv, type ProxyOptions } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import { viteMockServe } from 'vite-plugin-mock';
import viteCompression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';
import unpluginComponents from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { GitRevisionPlugin } from 'git-revision-webpack-plugin';
import { visualizer } from 'rollup-plugin-visualizer';
import pkg from './package.json';
// 完整配置，请查阅https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv) => {
  const ROOT = process.cwd(); // 项目根目录
  console.log('【info】 command:', command, ', mode: ', mode);
  console.log(loadEnv(mode, ROOT));

  const IS_PRODUCTION = mode === 'production';
  const IS_MOCK = mode === 'mock';
  // 读取环境配置
  const { VITE_APP_BASE_URL, VITE_APP_API_HOST, VITE_APP_TITLE, VITE_APP_API_PREFIX, VITE_APP_MOCK_PRODUCTION, VITE_APP_BUILD_REPORT } = loadEnv(mode, ROOT);
  console.log(VITE_APP_BUILD_REPORT);

  /***** 接口代理配置，有多个可以自己加 ******/
  const PROXY_CONFIG: Record<string, string | ProxyOptions> = {
    [VITE_APP_API_PREFIX]: {
      target: VITE_APP_API_HOST,
      // secure: false,
      // ws: true,
      changeOrigin: true, // 将Origin的来源更改为目标URL
      rewrite: (path) => path.replace(new RegExp(`^${VITE_APP_API_PREFIX}`), '/api')
    }
  };
  // 注入版本信息
  let appVersion = `app-version=${pkg.version},build-time=${new Date().toLocaleString()}`;
  if (IS_PRODUCTION) {
    try {
      const GitRevision = new GitRevisionPlugin();
      appVersion += `,git-hash=${GitRevision.version()},git-branch=${GitRevision.branch()}`;
    } catch (error) {
      console.warn('无法获取git信息,无法注入相关内容!');
    }
  }
  return defineConfig({
    root: ROOT, // 项目根目录
    base: VITE_APP_BASE_URL, // 基础路径
    server: {
      // 开发配置
      // host: '127.0.0.1',
      // port: 8080,
      open: true,
      // cors: false, // 跨域
      proxy: IS_MOCK ? {} : PROXY_CONFIG
    },
    preview: {
      open: true,
      proxy: PROXY_CONFIG
    },
    esbuild: {
      // drop: ['console','debugger'] // 使用esbuild压缩可使用
    },
    build: {
      // 生产配置
      target: 'modules', // 浏览器兼容目标,如es2015
      outDir: 'dist', // 输出目录
      assetsDir: 'assets', // 静态资源存放目录
      assetsInlineLimit: 4096, // 资源内联阈值
      cssCodeSplit: true, // 开启css拆分
      sourcemap: false, // 开启sourcemap
      minify: 'terser', // 压缩工具, terser压缩率更高1%-2%,esbuild压缩更快20-40 倍
      // terser配置
      terserOptions: {
        // 打包移除console
        compress: {
          keep_infinity: true,
          drop_console: true,
          drop_debugger: true
        }
      },
      reportCompressedSize: false //禁用 gzip 压缩大小报告,可以减少构建时间
    },
    resolve: {
      alias: {
        // 别名
        '@': createPath('./src'),
        components: createPath('./src/components'),
        types: createPath('./src/types')
      }
    },
    css: {
      devSourcemap: true, // 开启css sourcemap
      // css预处理器配置
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            hack: `true;@import "${resolve(__dirname, './src/assets/styles/_variable.less')}"`
          }
        }
      }
    },
    plugins: [
      viteMockServe({
        ignore: /^_/, // 忽略的文件
        mockPath: 'mock', // 设置mock文件目录
        supportTs: true, // 支持ts文件
        watchFiles: true, // 修改更新
        localEnabled: IS_MOCK,
        prodEnabled: IS_PRODUCTION && VITE_APP_MOCK_PRODUCTION === 'true', // 设置打包是否启用 mock 功能
        injectCode: `import { setupProdMockServer } from '../mock/_setupMockServer';setupProdMockServer();`
      }),
      vue({
        reactivityTransform: true // 开启语法糖转换
      }),
      createHtmlPlugin({
        minify: true,
        entry: '/src/main.ts',
        // template: 'index.html',
        inject: {
          data: {
            BASE_URL: VITE_APP_BASE_URL,
            title: VITE_APP_TITLE,
            appVersion
          }
        }
      }),
      // 支持jsx
      vueJsx(),
      // 自动导入组件
      unpluginComponents({
        dts: 'src/types/components.d.ts',
        dirs: ['src/components'],
        extensions: ['vue', 'tsx'],
        directoryAsNamespace: false,
        resolvers: [
          AntDesignVueResolver({
            importStyle: IS_PRODUCTION ? 'less' : false // 开发环境设置false，在main全量引入，让vite预构建
          })
        ]
      }),
      // 兼容浏览器设置，默认读取browserslistrc配置
      legacy({
        targets: ['defaults']
      }),
      // gzip压缩，需要nginx开启对应配置，否则不生效
      viteCompression({
        threshold: 1025, // 阈值，大于此值才会被压缩
        algorithm: 'gzip' // 压缩算法
      }),
      // 开启打包可视化分析报告,会增加打包时间，不需要可以关闭
      VITE_APP_BUILD_REPORT === 'true' &&
        visualizer({
          template: 'treemap',
          open: true,
          gzipSize: true,
          brotliSize: true,
          // emitFile: true,
          sourcemap: true
        })
    ]
  });
};
function createPath(url: string, metaUrl = import.meta.url) {
  return fileURLToPath(new URL(url, metaUrl));
}
