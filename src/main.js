import Vue from 'vue';
import store from './utils/store';
import router from './utils/router';
import ELEMENT from 'element-ui';
import App from './App.vue';
import "./css/common.css";

Vue.config.productionTip = false;
Vue.use(ELEMENT);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
