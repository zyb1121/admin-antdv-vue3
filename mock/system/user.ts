import type { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/api/system/user',
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
            username: '@word',
            nickname: '@ctitle',
            name: '@cname',
            idCard: '@integer(000000000000000,999999999999999999)',
            tel: '186xxxxxxxx',
            email: '@email',
            deptId: '@guid',
            deptName: '@ctitle',
            deptCode: '@zip()',
            roleId: '@guid',
            roleName: '@pick(admin,默认,部门经理,开发者)',
            describe: '@csentence(20,30)',
            photo: '@image',
            sex: '@pick(0,1)',
            status: '@pick(0,1,2)',
            lastIp: '@ip',
            updateTime: '@datetime(yyyy-MM-dd hh:mm:ss)',
            createTime: '@datetime(yyyy-MM-dd hh:mm:ss)'
          }
        ]
      }
    })
  },
  {
    url: '/api/system/user/:id',
    method: 'get',
    response: (params) => ({
      code: 0,
      msg: '',
      data: {
        id: params.id || '@id',
        name: '@cname',
        department: '中医内科',
        jibTitle: '主治医生',
        org: '互联网门诊',
        count: {
          sum: '@integer(0,10000)',
          score: '@float(0,5,0,2)',
          today: '@integer(0,200)',
          reservation: '@integer(0,200)'
        }
      }
    })
  }
] as MockMethod[];
