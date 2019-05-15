import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/',
            name: 'index',
            component:() => import('./views/Index.vue')
        },
        {
            path: '/readme',
            name: 'readme',
            component:() => import('./views/ReadMe.vue')
        },
        {
            path: '/ArkNights/search',
            name: '明日方舟-干员寻访模拟器',
            component:() => import('./views/arkNights/Search.vue')
        },
        {
            path: '/nishuihan/answer',
            name: '逆水寒-科举答题器',
            component:() => import('./views/nishuihan/Answer.vue')
        }
    ]
})
