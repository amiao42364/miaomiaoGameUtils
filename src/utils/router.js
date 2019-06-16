import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store';

Vue.use(VueRouter);
let vm = new Vue();
let vueRouter = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'Index',
            component: () => import('../views/Index.vue'),
            meta: {
                title: '阿喵的小站'
            }
        },
        {
            path: '/readme',
            name: 'readme',
            component: () => import('../views/ReadMe.vue'),
            meta: {
                title: '阿喵的小站'
            }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue'),
            meta: {
                title: '登录'
            }
        },
        {
            path: '/ArkNights/search',
            name: '明日方舟-干员寻访模拟器',
            component: () => import('../views/arkNights/Search.vue'),
            meta: {
                title: '抽卡模拟器-明日方舟',
                mobile: true
            }
        },
        {
            path: '/m/ArkNights/search',
            name: '明日方舟-干员寻访模拟器m',
            component: () => import('../views/arkNights/SearchMobile.vue'),
            meta: {
                title: '抽卡模拟器-明日方舟'
            }
        },
        {
            path: '/ArkNights/count',
            name: '明日方舟-精英材料计算',
            component: () => import('../views/arkNights/ItemCount.vue'),
            meta: {
                title: '精英材料计算-明日方舟',
                mobile: true
            }
        },
        {
            path: '/m/ArkNights/count',
            name: '明日方舟-精英材料计算m',
            component: () => import('../views/arkNights/ItemCountMobile.vue'),
            meta: {
                title: '精英材料计算-明日方舟'
            }
        },
        {
            path: '/ArkNights/level',
            name: '明日方舟-人物升级计算',
            component: () => import('../views/arkNights/LevelCount.vue'),
            meta: {
                title: '人物升级计算-明日方舟',
                mobile: true
            }
        },
        {
            path: '/m/ArkNights/level',
            name: '明日方舟-人物升级计算m',
            component: () => import('../views/arkNights/LevelCountMobile.vue'),
            meta: {
                title: '人物升级计算-明日方舟'
            }
        },
        {
            path: '/ArkNights/hr',
            name: '明日方舟-公开招募计算',
            component: () => import('../views/arkNights/Hr.vue'),
            meta: {
                title: '公开招募计算-明日方舟',
                mobile: true
            }
        },
        {
            path: '/m/ArkNights/hr',
            name: '明日方舟-公开招募计算m',
            component: () => import('../views/arkNights/HrMobile.vue'),
            meta: {
                title: '公开招募计算-明日方舟',
            }
        },
        {
            path: '/nishuihan/answer',
            name: '逆水寒-科举答题器',
            component: () => import('../views/nishuihan/Answer.vue'),
            meta: {
                title: '科举答题器-逆水寒'
            }
        },
        {
            path: '/majsoul/moqie',
            name: '雀魂-今日何切',
            component: () => import('../views/majsoul/MoQie.vue'),
            meta: {
                title: '雀魂-今日何切',
                mobile: true
            }
        },
        {
            path: '/m/majsoul/moqie',
            name: '雀魂-今日何切',
            component: () => import('../views/majsoul/MoQieMobile.vue'),
            meta: {
                title: '雀魂-今日何切'
            }
        },
        {
            path: '/csgo/config',
            name: 'csgo-一键配置',
            component: () => import('../views/csgo/Index.vue'),
            meta: {
                title: '一键配置-csgo',
                requireAuth: true
            }
        }
    ]
});
vueRouter.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    if (to.matched.some(route => route.meta.requireAuth)) {
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
                nextMobile();
            });
        return;
    }
    nextMobile();

    function nextMobile() {
        if (!vm.$commonUtil.isPC() && to.matched.some(route => route.meta.mobile)) {
            next({
                path: "/m" + to.path
            });
        } else {
            next();
        }
    }
});
export default vueRouter;
