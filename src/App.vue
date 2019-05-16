<template>
    <el-row type="flex" justify="center" style="z-index: 1;">
        <el-col :span="mainContainerWidth">
            <el-container>
                <el-header>
                    <el-menu :default-active="$route.path" class="el-menu-demo" router mode="horizontal"
                             @select="handleSelect" background-color="#545c64" text-color="#fff"
                             active-text-color="#ffd04b">
                        <el-menu-item index="/readme">
                            <el-image class="characterIcon"
                                      src="https://arknights.oss-cn-shanghai.aliyuncs.com/miaomiao.png"></el-image>
                        </el-menu-item>
                        <el-submenu index="/ArkNights">
                            <template slot="title">明日方舟</template>
                            <el-menu-item index="/ArkNights/search">寻访模拟器</el-menu-item>
                            <el-menu-item index="2-2" disabled>……</el-menu-item>
                        </el-submenu>
                        <el-submenu index="/nishuihan">
                            <template slot="title">逆水寒</template>
                            <el-menu-item index="/nishuihan/answer">科举答题器</el-menu-item>
                            <el-menu-item index="2-2" disabled>……</el-menu-item>
                        </el-submenu>
                        <el-menu-item index="3" disabled>开发中…</el-menu-item>
                    </el-menu>
                </el-header>
                <el-main v-bind:style="mainRouteClass">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-col>
    </el-row>
</template>

<style>
    body{
        background: url("https://arknights.oss-cn-shanghai.aliyuncs.com/background.jpg");
    }
</style>

<script>
    import common from "./utils/common";
    export default {
        data() {
            return {
                mainRouteClass: {
                    "padding-top": "2px",
                    "height": document.documentElement.clientHeight - 80 + "px"
                },
                mainContainerWidth: common.isPC() ? 16 : 24
            };
        },
        methods: {
            handleSelect(key, keyPath) {
                // console.log(key, keyPath);
            }
        },
        mounted() {
            const _this = this;
            window.onresize = function () {
                _this.mainRouteClass = {
                    "padding-top": "2px",
                    "height": document.documentElement.clientHeight - 80 + "px"
                };
            };
        },
        watch:{
            $route(to,from){
                // 从明日方舟离开时销毁数据
                if("/ArkNights/search" === from.path){
                    this.$store.commit("arkNightsModify", {
                        upValue: true,
                        totalCount: 0,
                        lv6Count: 0,
                        lv5Count: 0,
                        lv4Count: 0,
                        lv3Count: 0,
                        lv6Rate: 2,
                        lv5Rate: 8,
                        lv4Rate: 50,
                        lv3Rate: 40,
                        noLv6Count: 0,
                        characters: {}
                    });
                }
            }
        },
    }
</script>