import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // 初始化状态
        count: 0,
        // 明日方舟抽卡初始数据
        arkNightsData: {
            upValue: true,  // 是否开启up池
            totalCount: 0,  // 总抽卡次数
            lv6Count: 0,    // 获得6星总数
            lv5Count: 0,    // 获得5星总数
            lv4Count: 0,    // 获得4星总数
            lv3Count: 0,    // 获得3星总数
            lv6Rate: 2,     // 获取6星概率
            lv5Rate: 8,     // 获取5星概率
            lv4Rate: 50,    // 获取4星概率
            lv3Rate: 40,    // 获取3星概率
            noLv6Count: 0,  // 没有获得六星的累计次数
            characters: {}  // 已经抽取到的人物
        }
    },
    mutations: {
        // 处理状态
        increment(state, payload) {
            state.count += payload.step
        },
        arkNightsModify(state, data) {
            state.arkNightsData = data;
        },
        arkNightsUp(state, upValue) {
            state.arkNightsData.upValue = upValue;
        }
    },
    actions: {
        // 提交改变后的状态
        increment (context) {
            context.commit('increment')
        }
    }
})