<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-container>
                    <el-header>
                        <el-menu :default-active="$route.path" class="el-menu-demo" router mode="horizontal"
                                 @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                            <el-menu-item index="/readme">
                                <img src="">
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
                    <el-main>
                        <router-view></router-view>
                    </el-main>
                </el-container>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            };
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
</script>