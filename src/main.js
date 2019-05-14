import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import "./css/common.css";

Vue.config.productionTip = false;
Vue.use(ElementUI);
router.beforeEach((to, from, next) => {
    document.title = "阿喵的小站";
    next();
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
