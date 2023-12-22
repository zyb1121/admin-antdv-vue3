<template>
  <div class="page-wrap">
    <a-card class="page-control">
      <a-space class="fr">
        <search-button v-model="state.searchWord" class="fr" @search="handleSearch" @reset="handleReset">
          <a-select v-model:value="state.searchType" placeholder="请选择日志类型" style="width: 200px" allow-clear>
            <a-select-option v-for="(item, key) in LOG_TYPE" :key="key" :value="key"> {{ item }} </a-select-option>
          </a-select>
          <a-range-picker class="space text-left" allow-clear style="width: 280px" />
        </search-button>
      </a-space>
    </a-card>
    <a-card>
      <basis-table :columns="columns" show-index :data-source="state.tableData" :pagination="pagination" :loading="state.tableLoading" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <a-button v-if="column.dataIndex === 'action'" type="primary" size="small" @click="handleDetail(record)">详情</a-button>
        </template>
      </basis-table>
    </a-card>
    <a-modal v-model:visible="state.isShowDetail" title="详情" :width="700" :footer="null" :keyboard="false" :mask-closable="false">
      <a-descriptions bordered size="small" :column="2" layout="vertical" style="width: 100%">
        <a-descriptions-item label="动作"> {{ state.detail.name }} </a-descriptions-item>
        <a-descriptions-item label="类型">{{ state.detail.type }} </a-descriptions-item>
        <a-descriptions-item label="用户名"> {{ state.detail.username }} </a-descriptions-item>
        <a-descriptions-item label="时间"> {{ state.detail.createTime }} </a-descriptions-item>
        <a-descriptions-item label="接口地址" :span="2"> {{ state.detail.path }} </a-descriptions-item>
        <a-descriptions-item label="参数" :span="2">{{ state.detail.parameters }} </a-descriptions-item>
        <a-descriptions-item label="返回结果" :span="2"> {{ state.detail.result }} </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { inject, reactive } from 'vue';
import { LOG_TYPE } from '@/enums/system';
import logApi from '@/api/system/log';
import type { IPagination } from 'types/interface/common';
import type { ILog } from 'types/interface/system';
import type { ColumnProps } from 'ant-design-vue/es/table';

let pagination = reactive({ ...inject<IPagination>('$pagination') });
const columns: ColumnProps[] = [
  {
    title: '动作',
    dataIndex: 'name',
    ellipsis: true
  },
  {
    title: '类型',
    dataIndex: 'type',
    customRender: ({ text }) => LOG_TYPE[text]
  },
  {
    title: '操作者',
    dataIndex: 'username',
    ellipsis: true
  },
  {
    title: '接口地址',
    dataIndex: 'path',
    ellipsis: true
  },
  {
    title: '时间',
    dataIndex: 'createTime',
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: 130
  }
];
const state = reactive({
  tableData: [] as ILog[],
  tableLoading: false,
  searchWord: '',
  searchType: undefined as string | undefined,
  searchTimes: [],
  isShowDetail: false,
  detail: {} as ILog
});
function getData(pageNow = 1) {
  state.tableLoading = true;
  logApi
    .list({
      pageSize: pagination.pageSize,
      pageNow
    })
    .then((res) => {
      pagination.current = res.current;
      pagination.total = res.total;
      state.tableData = res.list;
      state.tableLoading = false;
    });
}
getData(1);
function handleTableChange(paginationConfig) {
  Object.assign(pagination, paginationConfig);
  getData(paginationConfig.current);
}
// 查询
function handleSearch() {
  getData(1);
}
// 重置
function handleReset() {
  state.searchWord = '';
  state.searchType = '';
  state.searchTimes = [];
  getData(1);
}
function handleDetail(row) {
  console.log(row);
  state.detail = row;
  state.isShowDetail = true;
}
</script>

<style lang="less" scoped></style>
