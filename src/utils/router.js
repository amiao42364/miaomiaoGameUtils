import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store';

const vm = new Vue();
const vueRouter = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'Index',
            component: () => import('../views/Index.vue')
        },
        {
            path: '/readme',
            name: 'readme',
            component: () => import('../views/ReadMe.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue')
        },
        {
            path: '/ArkNights/search',
            name: '明日方舟-干员寻访模拟器',
            component: () => import('../views/arkNights/Search.vue')
        },
        {
            path: '/ArkNights/count',
            name: '明日方舟-精英材料计算',
            component: () => import('../views/arkNights/ItemCount.vue')
        },
        {
            path: '/nishuihan/answer',
            name: '逆水寒-科举答题器',
            component: () => import('../views/nishuihan/Answer.vue')
        },
        {
            path: '/csgo/config',
            name: 'csgo-一键配置',
            component: () => import('../views/csgo/Index.vue'),
            meta: {
                requireAuth: true
            }
        }
    ]
});
vueRouter.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth)) {
        // 缓存不存在token则跳转到登录页
        if (vm.$commonUtil.get(vm.$globalConfig.MIAOMIAO_TOKEN_PREFIX) == null) {
            next({
                path: "/login",
                query: {
                    nextPath: to.path
                }
            });
            return;
        }
        // 判断服务器是否存在token
        vm.axios.get(vm.$globalConfig.DEFAULT_API_URL + "/user/judge")
            .then(function (response) {
                const user = response["content"];
                if (user == null) {
                    next({
                        path: "/login",
                        query: {
                            nextPath: to.path
                        }
                    });
                    return;
                }
                // 登录后显示个人信息
                store.commit("modifyPersonInfo", {
                    showPersonInfo: true,
                    headImg: user["imageUrl"],
                    nickName: user["nickName"],
                });
                next();
            });
        return;
    }
    next();
});
export default vueRouter;
