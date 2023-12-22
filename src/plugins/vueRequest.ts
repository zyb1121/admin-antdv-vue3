import { setGlobalOptions } from 'vue-request';

setGlobalOptions({
  // 分页配置，根据后端返回数据格式配置
  pagination: {
    currentKey: 'current',
    pageSizeKey: 'size',
    totalKey: 'total'
  }
});
