import type { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/api/system/message',
    method: 'get',
    response: ({ query }) => ({
      code: 200,
      msg: '',
      data: {
        total: 200,
        current: Number(query.pageNow),
        size: Number(query.pageSize),
        'list|10': [
          {
            id: '@guid',
            content: '节点-xxxxxx, 内存已超出预警阀值, 目前：@integer(90,100)%。',
            sender: '@cname',
            state: '@pick(0,1)',
            createTime: '@datetime(yyyy-MM-dd HH:mm:ss)',
            type: '@pick(WARNING,SYSTEM,OTHER)'
          }
        ]
      }
    })
  }
] as MockMethod[];
