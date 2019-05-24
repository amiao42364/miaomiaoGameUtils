<template>
    <el-row type="flex" justify="center" v-bind:style="defaultStyle">
        <el-col :span="mainContainerWidth">
            <el-container>
                <el-header style="height: 100%;">
                    <el-menu :default-active="$route.path" class="el-menu-demo" router mode="horizontal"
                             @select="handleSelect" background-color="#545c64" text-color="#fff"
                             active-text-color="#ffd04b">
                        <el-menu-item index="/readme">
                            <el-image class="characterIcon"
                                      src="https://arknights.oss-cn-shanghai.aliyuncs.com/miaomiao.png"></el-image>
                        </el-menu-item>
                        <el-submenu index="/ArkNights">
                            <template slot="title">明日方舟</template>
                            <el-menu-item index="/ArkNights/search">干员寻访模拟器</el-menu-item>
                            <el-menu-item index="/ArkNights/count">精英材料计算</el-menu-item>
                            <el-menu-item index="/ArkNights/level">干员升级计算</el-menu-item>
                        </el-submenu>
                        <el-submenu index="/csGo">
                            <template slot="title">CSGO</template>
                            <el-menu-item index="/csGo/config">一键配置</el-menu-item>
                        </el-submenu>
                        <el-submenu index="/person" v-show="showPersonInfo" style="float: right;">
                            <template slot="title">
                                <el-image class="characterIcon" :src=headImg></el-image>
                                {{nickName}}
                            </template>
                            <el-menu-item index="/person/info">个人中心</el-menu-item>
                            <el-menu-item @click="logout">注销</el-menu-item>
                        </el-submenu>
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
    body {
        background: url("https://arknights.oss-cn-shanghai.aliyuncs.com/background.jpg");
    }
</style>

<script>
    export default {
        data() {
            return {
                fullscreenLoading: false,
                mainRouteClass: {
                    "padding-top": "2px",
                    "height": document.documentElement.clientHeight - 80 + "px"
                },
                defaultStyle: {
                    "font-size": this.$commonUtil.isPC() ? "15px" : "12px"
                },
                mainContainerWidth: this.$commonUtil.isPC() ? 16 : 24
            };
        },
        methods: {
            // 注销
            logout() {
                localStorage.removeItem(this.$globalConfig.MIAOMIAO_TOKEN_PREFIX);
                sessionStorage.removeItem(this.$globalConfig.MIAOMIAO_TOKEN_PREFIX);
                this.$store.commit("modifyPersonInfo", {
                    showPersonInfo: false
                });
                this.$router.push("/");
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
        computed: {
            showPersonInfo() {
                return this.$store.state.showPersonInfo;
            },
            headImg() {
                return this.$store.state.headImg;
            },
            nickName() {
                return this.$store.state.nickName;
            }
        }
    }
</script>