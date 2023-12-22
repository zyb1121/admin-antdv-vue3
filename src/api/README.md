# API管理
将api进行集中管理，便于维护和查找.
## 介绍
每个文件即为一个模块，可以按照业务功能进行模块拆分，每个模块中包含各自对应的一些api。
```js
// /src/api/auth.js
import { get,post } from '@/utils/request';
const prefix = '/auth';
export default {
  login: (params) => post(`${prefix}/login`, params, { skipCheckAuth: true, skipShowTips: true }), // skipCheckAuth: 标识该接口不用触发刷新token机制
  refreshToken: (params) => post(`${prefix}/refresh_token`, params, { skipCheckAuth: true, skipShowTips: true }),
  getMenus: () => get(`${prefix}/menus`)
};
```
常用的一些请求方法可以从`@/utils/request`中引入，如果有特殊需求，也可以直接引入`request`对象，该对象为axios的实例。

常用的请求方法接收三个参数，分别是：请求url、请求参数（get请求是params，其他请求是data）、配置config。在config中可以传入两个特殊的标记。
- `skipCheckAuth`: 默认情况所有的api请求均可能会触发刷新token的机制，如果设置此标记为true，则会不触发此机制。
- `skipIntercept`: 默认情况所有的api请求均会途经拦截器，添加此标识则会跳过响应拦截器。
- `skipShowTips`：默认情况下，`'post', 'delete', 'put'`三种方式的请求成功后会有一个`操作成功`的提示，如果不希望出现此行为，可以将该标记设为true。

## 使用方法
在需要的时候直接引入对应模块即可，
```js
import AuthApi from '@/api/auth';
AuthApi.login({}).then(() => {
  // ...
})
```
**建议**

建议使用按需引入的方式，此方式虽然需要在使用的时候多次引入，但是有几点好处值得我们使用：
- 可以清楚的看到当前组件使用了那个模块的接口
- 不会引入多余的模块，方便做`tree-shaking`
- 在使用时有接口提示

### 接口命名规范
接口建议后端使用`RESTful`风格，前端可以采用如下规则命名：
- 新增：addXXX
- 删除：deleteXXX
- 更新：updateXXX
- 根据ID查询记录：getXXXDetail
- 条件查询一条记录：findOneXXX
- 条件查询：findXXXs
- 查询所有记录：getAllXXXs
- 分页查询：getXXXPage
- 搜索：searchXXX
其余个性化接口根据语义进行命名
