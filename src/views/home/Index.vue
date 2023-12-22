<template>
  <div class="page-wrap">
    <a-card>
      <h3>首页</h3>
      <a-space>
        <auth-button auth="testAuth"> auth-button </auth-button>
        <a-button v-auth="'testAuth'"> v-auth </a-button>
      </a-space>
      <h3>请求取消</h3>
      <div>
        <a-space>
          <a-button @click="run"> 自动取消重复请求（快速点击测试） </a-button>
          <a-button @click="handleCancelRequest"> 取消请求 </a-button>
          <a-button @click="handleCancelAllRequest"> 取消全部请求 </a-button>
        </a-space>
      </div>
      <h3>文件下载</h3>
      <div>
        <a-button @click="handleDownloadFile"> 文件下载 </a-button>
        <p>文件大小：{{ bytesToSize(progress.total) }}</p>
        <p>已下载：{{ bytesToSize(progress.loaded) }}</p>
        <p>进度： <a-progress style="width: 400px" :percent="progress.progress" /></p>
      </div>
      <h3>Hooks</h3>
      <div>
        <a-space>
          <a-button :loading="loading" @click="run"> vueRequest测试 </a-button>
          <a href="https://next.cn.attojs.org/" target="_blank">查看文档</a>
        </a-space>
        <p>测试结果</p>
        <p>data:{{ data }}</p>
        <p>err:{{ error }}</p>
      </div>
      <h3>表格</h3>
      <basis-table show-index :columns="columns" :loading="loading" :data-source="data?.list" :pagination="pagination">
        <template #bodyCell="{ column, record }">
          <a-space v-if="column.dataIndex === 'action'" class="table-action">
            <span class="text-primary"> <icon-font type="icon-form" /></span>
            <delete-button type="icon" :title="record.title" @confirm="handleDelete(record)" />
          </a-space>
        </template>
      </basis-table>
      <h3>图标</h3>
      <p style="color: red"> <icon-font type="icon-stepforward" :style="{ color: 'blue' }" /><icon-font type="icon-user" /> </p>
      <h3>按钮</h3>
      <a-space>
        <a-button type="primary" size="large"> 普通 </a-button>
        <a-button disabled size="large"> 禁用 </a-button>
        <a-button type="primary" ghost> 普通 </a-button>
        <a-button disabled ghost> 禁用 </a-button>
        <a-button type="primary" shape="round" size="small"> 普通 </a-button>
        <a-button disabled shape="round" size="small"> 禁用 </a-button>
      </a-space>
      <h3>颜色</h3>
      <p class="text-primary"> 主色 #006DFF </p>
      <p class="text-heading"> 标题 #152C4B </p>
      <p class="text-normal"> 内容 #4B617F </p>
      <p class="text-secondary"> 辅助 #5F7498 </p>
      <p class="text-success"> 成功 #4B617F </p>
      <p class="text-disabled"> 禁用 #D2DAE8 </p>
      <p class="text-error"> 错误 #FF2528 </p>
      <h3>字体</h3>
      <p class="text-mini"> 辅助文本 12px </p>
      <p class="text-normal"> 内容文本 14px </p>
      <p class="text-medium"> 标题文本 16px </p>
      <p class="text-large"> 大标题文本 18px </p>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
import { inject, reactive } from 'vue';
import configApi from '@/api/system/config';
import type { IPagination } from 'types/interface/common';
import type { ColumnProps } from 'ant-design-vue/es/table';
import { message } from 'ant-design-vue';
import request from '@/utils/request';
import fileApi from '@/api/file';
import type { AxiosProgressEvent } from 'axios';
import { bytesToSize } from '@/utils';
import { useRequest } from 'vue-request';
const columns: ColumnProps[] = [
  {
    title: 'title',
    dataIndex: 'title'
  },
  {
    title: 'code',
    dataIndex: 'code'
  },
  {
    title: 'type',
    dataIndex: 'type'
  },
  {
    title: 'describe',
    dataIndex: 'describe'
  },
  {
    title: 'updateTime',
    dataIndex: 'updateTime'
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'action'
  }
];
const ApiConfig = {
  // requestUniqueKey: 'configApi'
};
let { loading, data, error, run } = useRequest<{ list: string[] }>(configApi.list, {
  defaultParams: [{ a: 123 }, ApiConfig]
});
const pagination = {
  ...inject<IPagination>('$pagination'),
  pageSize: 5
};
function handleDelete(record) {
  console.log(record);
  message.success('操作成功！');
}
function handleCancelRequest() {
  request.cancelRequest(ApiConfig);
}
function handleCancelAllRequest() {
  request.cancelAllRequest();
}
const progress = reactive<Partial<AxiosProgressEvent>>({
  total: 0,
  loaded: 0,
  progress: 0
});
function handleDownloadFile() {
  fileApi.download('文件下载测试', {}, progress);
}
</script>
<style scoped>
h3 {
  margin: 20px 0;
}
</style>
