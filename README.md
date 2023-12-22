# vue3-antdv

本框架提供两个版本：
- 完整版本（main分支）：包含基础功能和实例页面
- 精简版本（simple分支）：只包含最基础功能

请根据需要进行下载，如果有任何问题请在仓库提交issues。

## 技术体系
- 核心：TypeScript4.0 + VueJS3.0 + VueRouter4.0 + Pinia2.0
- UI：AntDesignVue3.0
- 构建系统：Vite3.0 + ESLint8.0 + PostCSS8.0
- HTTP请求：Axios
- 依赖管理：pnpm

## 目录规划
```js
|- docs // 文档
|- dist // 构建成果
|- mock // 数据mock
|- public
|- src
  |- api // api接口管理
  |- assets  // 静态资源
  |- components // 全局组件
  |- config // 全局配置
  |- directives // 全局指令
  |- enums // 枚举值
  |- hooks // 全局hooks，用于抽离公用逻辑
  |- layouts // 布局组件
  |- plugins // 第三方插件
  |- router  // 路由
  |- store   // 状态
  |- types   // 类型声明
  |- utils   // 工具函数
  |- views   // 页面
  |- App.vue  // 根组件
  |- main.ts
|- index.html // 入口页面
```

## 使用说明
``` bash
# 安装依赖
pnpm install

# mock环境启动，第一次请使用该方式
pnpm run serve:mock

# 开发环境启动
pnpm run serve
# 或
pnpm run start

# 生产环境打包
pnpm run build

# 生产环境打包并生成构建依赖信息
pnpm run build:report
```


## 主要功能

### 基础功能
- [x] 框架目录统一规划
- [x] UI框架集成
- [x] 路由管理集成
- [x] 状态管理集成
- [x] 数据请求、拦截器、接口鉴权、API管理
- [x] 数据Mock服务
- [x] 用户登录验证、路由拦截器
- [x] 路由、动态菜单、资源按钮
- [x] 跨域代理、多环境支持
- [x] 常用工具函数和组件
- [x] css预处理器支持及主题颜色更改
- [x] 字体图标支持

### 性能优化
- [x] Gzip压缩支持
- [x] 按需加载和依赖分包并行加载支持
- [x] 重复请求取消支持

### 开发规范
- [x] ESlint
- [x] 开发规范文档
- [x] Git分支策略
- [x] API接口约定

### 布局组件
- [x] 头部组件
- [x] 导航菜单
- [x] 面包屑
- [x] 工作区
### 其他
- [x] Git及版本信息埋点支持
- [] 创建无权限的分支
