import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'
import { Dialog } from 'vant'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: '预约系统'
    },
    component: () => import(/* webpackChunkName: "Home" */ '../views/Home.vue')
  },
  {
    path: '/invite/list',
    name: 'Invite-list',
    meta: {
      title: '我的预约'
    },
    component: () => import(/* webpackChunkName: "invite-list" */ '../views/invite/invite-list.vue')
  },
  {
    path: '/invite/list/all',
    name: 'Invite-list-all',
    meta: {
      title: '所有预约'
    },
    component: () => import(/* webpackChunkName: "Invite-list-all" */ '../views/invite/all-list.vue')
  },
  {
    path: '/invite/form',
    name: 'inviteForm',
    meta: {
      title: '新建预约'
    },
    component: () => import(/* webpackChunkName: "invite-form" */ '../views/invite/form.vue')
  },
  {
    path: '/guest/list',
    name: 'guest-list',
    meta: {
      title: '常用访客'
    },
    component: () => import(/* webpackChunkName: "guest-list" */ '../views/guest/guest-list.vue')
  },
  {
    path: '/configuration/notification',
    name: 'notification',
    meta: {
      title: '公告配置'
    },
    component: () => import(/* webpackChunkName: "notification" */ '../views/configuration/notification.vue')
  },
  {
    path: '/demo',
    name: 'demo',
    meta: {
      title: 'demo'
    },
    component: () => import(/* webpackChunkName: "Demo" */ '../views/Demo.vue')
  },
  {
    path: '/person/detail',
    name: 'personDetail',
    meta: {
      title: '详情'
    },
    component: () => import(/* webpackChunkName: "personDetail" */ '../components/business/person-detail.vue')
  },
  {
    path: '/guest/form',
    name: 'guest-form',
    meta: {
      title: '访客编辑'
    },
    component: () => import(/* webpackChunkName: "guest-form" */ '../views/guest/form.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to: any, from: any, next: any)=> {
  if(['/invite/form','/configuration/notification','/guest/form'].includes(from.path)) {
    if((window as any).ROBOT_FORM_SAVE === true) {
      next(true)
    } else {
      const res = confirm('是否确定离开表单页面？')
      next(res)
    }
  } else {
    next(true)
  }
  document.title = to.meta.title || ''
})

export default router
