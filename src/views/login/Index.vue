<template>
  <div class="login-page">
    <LoginBackground></LoginBackground>
    <a-card class="login-form">
      <h3>{{ appTitle }}</h3>
      <a-form ref="formRef" :model="state.loginInfo" :rules="rules" class="form" :wrapper-col="{ span: 24 }" @keydown.enter="handleLogin">
        <a-form-item name="username">
          <a-input v-model:value="state.loginInfo.username" placeholder="账号" type="text">
            <template #prefix>
              <icon-font type="icon-user" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input v-model:value="state.loginInfo.password" auto-complete="off" placeholder="密码" type="password">
            <template #prefix>
              <icon-font type="icon-lock" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="code">
          <div class="code">
            <a-input v-model:value="state.loginInfo.code" style="width: 55%" auto-complete="off" placeholder="验证码">
              <template #prefix>
                <icon-font type="icon-mobile1" />
              </template>
            </a-input>
            <img width="35%;" height="32px" :src="state.codeSrc" @click="changeCode()" />
          </div>
        </a-form-item>
        <a-form-item style="width: 100%">
          <a-button class="login" :loading="state.loading" type="primary" @click.prevent="handleLogin">登 录</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <div class="version" @click="state.isShowModal = true">
      版本号: <span>{{ appTitle }} {{ version }}</span>
    </div>
    <a-modal v-model:visible="state.isShowModal" title="更新日志" :footer="null" :width="800">
      <UpdateLog></UpdateLog>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { setStorage } from '@/utils/storage';
import config from '@/config';
import AuthApi from '@/api/auth';
import UpdateLog from './components/UpdateLog.vue';
import LoginBackground from './components/LoginBackground.vue';
import { cryptoPassword } from '@/utils';
import { message } from 'ant-design-vue';
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { LocationQuery } from 'vue-router';
import { saveAuthData } from '@/utils/token';
const rules = {
  username: [
    {
      type: 'string',
      required: true,
      trigger: 'blur',
      message: '请输入用户名'
    }
    // { validator: ruleUserName }
  ],
  password: [
    {
      type: 'string',
      required: true,
      trigger: 'blur',
      message: '请输入密码'
    }
  ],
  code: [
    {
      type: 'string',
      required: true,
      trigger: 'blur',
      message: '请输入验证码'
    }
  ]
};
const appTitle = config.appTitle;
const version = config.appVersion;
const route = useRoute();
const router = useRouter();
const formRef = ref();
let state = reactive({
  loginInfo: {
    username: 'admin',
    password: '123456',
    code: '1234'
  },
  loading: false,
  codeSrc: '',
  isShowModal: false
});
const redirect = computed(() => {
  let noRedirect = ['/err', '/login'];
  let redirectUrl = (route.query.redirect as string) || '/';
  return noRedirect.includes(redirectUrl) ? '/' : redirectUrl;
});
// 验证码
function changeCode() {
  let str = new Date().getTime();
  state.codeSrc = `${config.apiHost}/code/` + str;
}
function getOtherQuery(query: LocationQuery) {
  return Object.keys(query).reduce((acc, cur) => {
    return cur !== 'redirect' ? (acc[cur] = query[cur]) : acc;
  }, {} as any);
}
// 储存菜单及用户信息
async function getMenuList() {
  await AuthApi.getMenus().then((res) => {
    // 存储用户信息
    setStorage('userinfo', res.detail);
    setStorage('permissions', res.btnPermissions);
    // 存储返回的菜单
    setStorage('rawMenu', res.menus);
  });
}
// 登录
function handleLogin() {
  formRef.value
    .validate()
    .then(() => {
      state.loading = true;
      let { username, password, code } = state.loginInfo;
      AuthApi.login({
        username,
        password: cryptoPassword(password, config.cryptoKey),
        code
      })
        .then(async (res) => {
          message.success('登录成功！');
          saveAuthData(res);
          await getMenuList();
          router.replace({
            path: redirect.value,
            query: getOtherQuery(route.query)
          });
          state.loading = false;
        })
        .catch((err) => {
          console.log(err);
          state.loading = false;
          changeCode();
        });
    })
    .catch((err: Error) => {
      console.log(err);
      state.loading = false;
      message.error('用户名或密码输入不正确！');
      changeCode();
    });
}
</script>
<style lang="less" scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  position: relative;
}
.login-form {
  width: 360px;
  text-align: center;
  .code {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }
}
.version {
  position: absolute;
  bottom: 10px;
  z-index: 2;
  span {
    color: @link-color;
  }
}
</style>
