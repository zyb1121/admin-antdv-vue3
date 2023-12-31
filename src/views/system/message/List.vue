<template>
  <div class="page-wrap">
    <a-card class="page-control">
      <a-space class="fl">
        <a-button type="primary" ghost @click="handleAllRead"><icon-font type="icon-check" />全部已读</a-button>
        <a-button type="primary" ghost @click="handleBatchRead"><icon-font type="icon-filter" />批量已读</a-button>
      </a-space>
      <a-space class="fr">
        <a-select v-model:value="state.searchType" placeholder="消息类型(可选)" style="width: 200px" allow-clear>
          <a-select-option v-for="(item, key) in MESSAGE_TYPE" :key="key" :value="key">{{ item }}</a-select-option>
        </a-select>
        <a-select v-model:value="state.searchStatus" placeholder="消息状态(可选)" style="width: 200px" allow-clear>
          <a-select-option v-for="(item, key) in MESSAGE_STATUS" :key="key" :value="key">{{ item }}</a-select-option>
        </a-select>
        <a-range-picker v-model:value="state.searchTimes" show-time format="YYYY-MM-DD HH:mm:ss" allow-clear></a-range-picker>
        <a-button type="primary" @click="handleSearch">搜索</a-button>
        <a-button type="primary" ghost @click="handleReset">重置</a-button>
      </a-space>
    </a-card>
    <a-card>
      <basis-table
        :row-selection="{
          selectedRowKeys: state.selectedRowKeys,
          onChange: onSelectChange
        }"
        show-index
        :columns="columns"
        :data-source="state.tableData"
        :pagination="pagination"
        :loading="state.tableLoading"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <a-space v-if="column.dataIndex === 'action'">
            <a-button type="primary" size="small" @click="handleView(record)">详情</a-button>
          </a-space>
        </template>
      </basis-table>
    </a-card>
    <a-modal title="消息详情" :visible="state.isShowDetail" :keyboard="false" :mask-closable="false" @ok="handleOk" @cancel="handleCancel">
      <p>{{ state.detail.content }}</p>
      <template #footer>
        <a-button class="block-center" type="primary" @click="handleOk"><icon-font type="icon-check" />已读</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="tsx" setup>
import { inject, reactive } from 'vue';
import { Modal } from 'ant-design-vue';
import messageApi from '@/api/system/message';
import { MESSAGE_TYPE, MESSAGE_STATUS } from '@/enums/message';
import { message } from 'ant-design-vue';
import type { IPagination } from 'types/interface/common';
import type { IMessage } from 'types/interface/system';
import type { ColumnProps } from 'ant-design-vue/es/table';

let pagination = reactive({ ...inject<IPagination>('$pagination') });
const columns: ColumnProps[] = [
  {
    title: '发送者',
    dataIndex: 'sender',
    width: '180px'
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: '180px',
    customRender: ({ text }) => MESSAGE_TYPE[text]
  },
  {
    title: '内容',
    dataIndex: 'content',
    ellipsis: true
  },
  {
    title: '状态',
    width: '100px',
    dataIndex: 'state',
    align: 'center',
    customRender: ({ text }) => <a-badge status={text === 1 ? 'warning' : 'processing'} text={MESSAGE_STATUS[text]} />
  },
  {
    title: '发送时间',
    dataIndex: 'createTime',
    align: 'center',
    width: '220px'
  },
  {
    title: '操作',
    width: '200px',
    ellipsis: true,
    align: 'center',
    dataIndex: 'action'
  }
];
const state = reactive({
  tableData: [] as IMessage[],
  tableLoading: false,
  searchType: undefined as string | undefined,
  searchStatus: '',
  searchTimes: [] as any,
  selectedRowKeys: [],
  isShowDetail: false,
  detail: {} as IMessage
});
// 获取表格数据
function getData(pageNow = 1) {
  state.tableLoading = true;
  messageApi
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
getData();
// 查询
function handleSearch() {
  getData(1);
}
// 重置
function handleReset() {
  state.searchType = '';
  state.searchStatus = '';
  state.searchTimes = [];
  getData(1);
}
function handleTableChange(paginationConfig) {
  Object.assign(pagination, paginationConfig);
  getData(paginationConfig.current);
}
// 详情
function handleView(row) {
  state.detail = { ...row };
  state.isShowDetail = true;
}
// 选择表格数据
function onSelectChange(selectedRowKeys) {
  state.selectedRowKeys = selectedRowKeys;
}
// 全部已读
function handleAllRead() {
  Modal.confirm({
    title: () => '提示',
    content: () => '确定把所有未读消息标记为已读吗?',
    onOk: () => {
      message.success('操作成功');
      state.selectedRowKeys = [];
    }
  });
}
// 批量已读
function handleBatchRead() {
  if (state.selectedRowKeys.length === 0) {
    message.error('未选择消息');
  } else {
    Modal.confirm({
      title: () => '提示',
      content: () => '确定把选择项标记为已读吗?',
      onOk: () => {
        message.success('操作成功');
        state.selectedRowKeys = [];
      }
    });
  }
}
// 取消
function handleCancel() {
  state.isShowDetail = false;
  // state.detail = {};
}
// 已读
function handleOk() {
  message.success('该消息状态变更为已读');
  handleCancel();
}
</script>

<style lang="less" scoped>
.footer {
  margin: 0 auto;
  width: 100px;
  height: 35px;
  border-radius: 2px;
  line-height: 35px;
  letter-spacing: 4px;
  color: #fff;
  background: #1890ff;
  cursor: pointer;
}
</style>
