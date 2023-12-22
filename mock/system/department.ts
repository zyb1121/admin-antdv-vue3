import type { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/api/system/department',
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
            title: '@ctitle',
            code: '@zip()',
            describe: '@csentence(20,30)',
            'children|2': [
              {
                id: '@guid',
                title: '@ctitle',
                code: '@zip()',
                describe: '@csentence(20,30)'
              }
            ]
          }
        ]
      }
    })
  }
] as MockMethod[];
