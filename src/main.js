import Vue from 'vue';
import store from './utils/store';
import router from './utils/router';
import axios from './utils/axios';
import ELEMENT from 'element-ui';
import App from './App.vue';
import commonUtil from "./utils/common";
import globalConfig from "./globalConfig";
import Clipboard from 'clipboard'
import "./css/common.css";

Vue.config.productionTip = false;
Vue.prototype["$commonUtil"] = commonUtil;
Vue.prototype["$globalConfig"] = globalConfig;
Vue.prototype.clipboard = Clipboard;
Vue.use(ELEMENT);

new Vue({
    router,
    store,
    axios,
    render: h => h(App)
}).$mount('#app');