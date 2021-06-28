import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 路由重定向
    { path: '/', redirect: '/login' },
    // 登录路由
    { path: '/login', component: Login },
    { path: '/home', component: Home }
  ]
})

export default router
