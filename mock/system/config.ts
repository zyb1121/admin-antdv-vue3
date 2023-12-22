import type { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/api/system/config',
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
            title: '@ctitle',
            id: '@guid',
            updateTime: '@datetime(yyyy-MM-dd HH:mm:ss)',
            code: '@zip()',
            describe: '@csentence(20,30)',
            value: '@pick(0,1)',
            type: '@pick(0,1)'
          }
        ]
      }
    })
  }
] as MockMethod[];
