<template>
  <div class="page-wrap">
    <a-card class="page-control">
      <a-space>
        <a-button type="primary" ghost @click="handleAdd"> <icon-font type="icon-plus" /> 新建 </a-button>
        <a-button type="primary" ghost @click="$router.push('/system/config/edit')"> 嵌套路由测试 </a-button>
      </a-space>
      <search-button v-model="tableState.searchWord" class="fr" placeholder="请输入系统配置项名称" @search="handleSearch" @reset="getData(1)" />
    </a-card>
    <a-card>
      <basis-table :columns="columns" show-index :data-source="tableState.tableData" :pagination="pagination" :loading="tableState.tableLoading" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <a-space v-if="column.dataIndex === 'action'">
            <a-button type="primary" size="small" @click="handleEdit(record)">编辑</a-button>
            <delete-button :title="record.title" @confirm="handleDel(record)" />
          </a-space>
        </template>
      </basis-table>
    </a-card>
    <!-- 新增编辑 -->
    <a-modal v-model:visible="editState.isShowEdit" :title="editState.isAdd ? '新建' : '编辑'" :keyboard="false" :mask-closable="false" :after-close="handleClose" @ok="handleOk">
      <a-form ref="formRef" :model="editState.form" :rules="editState.rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item label="配置项代码" name="code">
          <a-input v-model:value="editState.form.code" :disabled="!editState.isAdd" />
        </a-form-item>
        <a-form-item label="配置项名称" name="title">
          <a-input v-model:value="editState.form.title" />
        </a-form-item>
        <a-form-item label="配置值" name="value">
          <a-input v-model:value="editState.form.value" />
        </a-form-item>
        <a-form-item label="配置类型" name="type">
          <a-select v-model:value="editState.form.type">
            <a-select-option v-for="item in tableState.types" :key="item.value" :value="item.value"> {{ item.title }} </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="说明" name="describe">
          <a-textarea v-model:value="editState.form.describe" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="tsx" setup>
import configComponent from './components';
import configApi from '@/api/system/config';
import { inject, reactive, ref } from 'vue';
import type { IPagination } from 'types/interface/common';
import type { IConfig, IConfigComponent } from 'types/interface/system';
import type { ColumnProps } from 'ant-design-vue/es/table';
import { message } from 'ant-design-vue';

// 列表
const columns: ColumnProps[] = [
  {
    title: '配置项代码',
    dataIndex: 'code',
    width: 150,
    align: 'center'
  },
  {
    title: '配置项名称',
    dataIndex: 'title'
  },
  {
    title: '配置项类型',
    dataIndex: 'type',
    align: 'center',
    width: 150,
    customRender: ({ text }) => {
      const type = configComponent.find((item) => item.value === Number(text)) as IConfigComponent;
      return type.title;
    }
  },
  {
    title: '配置值',
    dataIndex: 'value',
    ellipsis: true,
    align: 'center',
    width: 150,
    customRender: ({ record }: any) => {
      const type = configComponent.find((item) => item.value === record.type);
      const handleUpdate = (val) => (record.value = val);
      return type?.component ? <type.component value={record.value} is-edit onInput={handleUpdate}></type.component> : '';
    }
  },
  {
    title: '说明',
    dataIndex: 'describe',
    ellipsis: true,
    customRender: ({ text }) => (
      <a-tooltip title={text}>
        <div class="text-nowrap">{text}</div>
      </a-tooltip>
    )
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: 200
  }
];
let pagination = reactive({ ...inject<IPagination>('$pagination') });
let tableState = reactive({
  searchWord: '',
  tableData: [] as IConfig[],
  tableLoading: false,
  types: configComponent
});
function getData(pageNow = 1) {
  tableState.tableLoading = true;
  configApi
    .list({
      searchWord: tableState.searchWord,
      pageSize: pagination.pageSize,
      pageNow
    })
    .then((res) => {
      pagination.current = res.current;
      pagination.total = res.total;
      tableState.tableData = res.list;
      tableState.tableLoading = false;
    });
}
getData(1);
function handleSearch(val: string) {
  console.log(val);
  getData(1);
}
function handleTableChange(paginationConfig) {
  Object.assign(pagination, paginationConfig);
  getData(paginationConfig.current);
}
// 新增编辑
const formRef = ref();
const initForm: IConfig = {
  code: '',
  title: '',
  value: '',
  type: configComponent[0].value,
  describe: ''
};
let editState = reactive({
  isShowEdit: false,
  isAdd: true,
  form: {} as IConfig,
  rules: {
    code: [
      {
        required: true,
        trigger: 'blur',
        message: '请输入配置项代码'
      }
    ],
    title: [
      {
        required: true,
        trigger: 'blur',
        message: '请输入配置项名称'
      }
    ],
    value: [
      {
        required: true,
        trigger: 'blur',
        message: '请输入配置项值'
      }
    ],
    type: [
      {
        required: true,
        trigger: 'blur',
        message: '请选择配置类型'
      }
    ]
  }
});
function handleAdd() {
  editState.isAdd = true;
  editState.isShowEdit = true;
  editState.form = { ...initForm };
}
function handleEdit(row: IConfig) {
  console.log(row);
  editState.isAdd = false;
  editState.isShowEdit = true;
  editState.form = { ...row };
}
function handleDel(row: IConfig) {
  console.log(row);
  message.success('操作成功');
}
function handleClose() {
  formRef.value.resetFields();
  editState.isShowEdit = false;
}
function handleOk() {
  formRef.value.validate().then(() => {
    message.success('操作成功');
    editState.isShowEdit = false;
  });
}
</script>
