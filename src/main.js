import Vue from 'vue';
import ELEMENT from 'element-ui';
import App from './App.vue';
import router from './router';
import "./css/common.css";

Vue.config.productionTip = false;
Vue.use(ELEMENT);

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
