import Vuex from 'vuex';

export default new Vuex.Store({
    state: {
        // 初始化状态
        count: 0,
        // 是否展示个人信息
        showPersonInfo: false,
        headImg: "https://arknights.oss-cn-shanghai.aliyuncs.com/default_headImg.png",
        nickName: "喵喵"
    },
    mutations: {
        // 修改个人信息展示
        modifyPersonInfo(state, data) {
            state.showPersonInfo = data.showPersonInfo;
            if (data.headImg != null) {
                state.headImg = data.headImg;
            }
            if (data.nickName != null) {
                state.nickName = data.nickName;
            }
        }
    },
    actions: {
        // 提交改变后的状态
        increment(context) {
            context.commit('increment')
        }
    }
})