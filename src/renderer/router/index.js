import Vue from 'vue'
import Router from 'vue-router'

const chat = () => import('@/page/chat/chat')
const friend = () => import('@/page/friend/friend')
const resume = () => import('@/page/resume/resume')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: chat
    }
  ],
  linkActiveClass: 'active' //用 active 替换点击时添加的class
})
export default router
