import axios from 'axios';
import VueAxios from 'vue-axios'
import Router from './router'
import Vue from 'vue';

const vm = new Vue();
// loading
let loading;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    config.headers.authToken = vm.$commonUtil.get(vm.$globalConfig.MIAOMIAO_TOKEN_PREFIX);
    loading = vm.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });
    return config;
});

// 响应拦截器
axios.interceptors.response.use(function (response) {
    if (loading != null) {
        loading.close();
    }
    if (response.data.code === 200) {
        return response.data;
    } else {
        if (response.data.code === 1002) {
            localStorage.removeItem(vm.$globalConfig.MIAOMIAO_TOKEN_PREFIX);
            sessionStorage.removeItem(vm.$globalConfig.MIAOMIAO_TOKEN_PREFIX);
            vm.$notify.info({
                title: "消息",
                message: "请重新登录"
            });
            Router.push({
                path: "/login",
                query: {
                    nextPath: "/"
                }
            });
            return response.data;
        } else {
            vm.$notify.error({
                title: "错误",
                message: response.data.message + "：" + response.data.content
            });
            return Promise.reject(response.data.message);
        }
    }
}, function (error) {
    if (loading != null) {
        loading.close();
    }
    vm.$notify.error({
        title: "错误",
        message: "未知异常"
    });
    return Promise.reject(error);
});


Vue.use(VueAxios, axios);

export default new VueAxios();