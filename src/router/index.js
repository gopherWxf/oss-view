// router配置
import Vue from 'vue'
import Router from 'vue-router'

// Vue.use(),使用Router
Vue.use(Router)

//使用ES提出的方法：路由懒加载，优化前端页面（不过此处只有一个路由）
const routes = [
    {
        path: '/', component: () => import('@/views/pageContainer/index')
    },
    {
        path: '/console',
        component: () => import('@/views/pageContainer/console'),
        redirect:'/overview',
        children:[
            {path: '/overview', component: () => import('@/components/Overview')},
            {path: '/ossAdmin', component: () => import('@/components/OssAdmin')},
            {path: '/system', component: () => import('@/components/System')},
            {path: '/log', component: () => import('@/components/Log')}
        ]
    },
    {
        path: "/excessive",
        component: () => import('@/components/Excessive'),
    }
]


//这里使用了history模式，这种模式充分利用 history.pushState API来完成URL跳转而无须重新加载页面
const router = new Router({
    mode: 'history', // base: process.env.BASE_URL,
    // mode:'hash',// 打包app需要修改
    routes
})

//暴露router供main.js全局调用
export default router
