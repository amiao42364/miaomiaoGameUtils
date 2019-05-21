<template>
    <el-container style="background: #DCDFE6; height: 100%">
        <el-main>
            <el-card class="box-card">
                <div slot="header">
                    <span>csgo启动项配置</span>
                    <el-button id="csgo_copy" @click="save" style="margin-left: 15px;" size="small" type="success" :disabled="isDisabled">点我复制到粘贴板</el-button>
                </div>
                <el-row>
                    <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入配置"
                            v-model="csgoConf">
                    </el-input>
                </el-row>
                <el-row class="line"></el-row>
                <el-row>
                    <el-dropdown class="button-class" @command="changeConf">
                        <el-button type="primary">去除鼠标加速<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="-noforcemaccel">-noforcemaccel</el-dropdown-item>
                            <el-dropdown-item command="-noforcemparms">-noforcemparms</el-dropdown-item>
                            <el-dropdown-item command="-noforcemspd">-noforcemspd</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown class="button-class" @command="changeFps">
                        <el-button type="primary">锁屏帧数<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="-freq 60">60HZ</el-dropdown-item>
                            <el-dropdown-item command="-freq 75">75HZ</el-dropdown-item>
                            <el-dropdown-item command="-freq 144">144HZ</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown class="button-class" @command="changeColor">
                        <el-button type="primary">颜色位数<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="-32bpp">32bpp</el-dropdown-item>
                            <el-dropdown-item command="-64bpp">64bpp</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button @click="changeConf('-novid')" class="button-class" type="primary">去除游戏开始动画效果</el-button>
                    <el-dropdown class="button-class" @command="changeThread">
                        <el-button type="primary">线程<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="-threads 2">两线程</el-dropdown-item>
                            <el-dropdown-item command="-threads 4">四线程</el-dropdown-item>
                            <el-dropdown-item command="-threads 6">六线程</el-dropdown-item>
                            <el-dropdown-item command="-threads 8">八线程</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button @click="changeConf('-high')" class="button-class" type="primary">高优先级</el-button>
                    <el-button @click="changeConf('-noipx')" class="button-class" type="primary">关闭IPX协议</el-button>
                    <el-button @click="changeConf('-nojoy')" class="button-class" type="primary">关闭摇杆</el-button>
                    <el-button @click="changeConf('-preload')" class="button-class" type="primary">预读资源</el-button>
                    <el-button @click="changeConf('-processheap')" class="button-class" type="primary">缓解游戏长时间运行卡顿</el-button>
                    <el-button @click="changeConf('-noforcemparms')" class="button-class" type="primary">游戏时禁用win键</el-button>
                </el-row>
            </el-card>
        </el-main>
    </el-container>
</template>
<style>
    .button-class {
        margin-right: 10px;
        margin-left: 0 !important;
        margin-bottom: 10px;
    }
</style>
<script>
    export default {
        data() {
            return {
                csgoConf: "",
                isDisabled: false
            };
        },
        methods: {
            save: function () {
                const _this = this;
                // 防止按钮多次点击
                _this.isDisabled = true;
                setTimeout(function () {
                    _this.isDisabled = false;
                }, 500);

                _this.axios.post(_this.$globalConfig.DEFAULT_API_URL + "/csgo/startUp", {
                    startUp: _this.csgoConf
                });

                let clipboard = new _this.clipboard('#csgo_copy', {
                    text: function () {
                        return _this.csgoConf;
                    }
                });
                clipboard.on('success', e => {
                    _this.$message.success("复制成功");
                    clipboard.destroy();
                });
                clipboard.on('error', e => {
                    _this.$message.error("该浏览器不支持自动复制");
                    clipboard.destroy();
                });
            },
            changeConf: function (value) {
                if (this.csgoConf.indexOf(value) > -1) {
                    this.csgoConf = this.csgoConf.replace(value, "");
                } else {
                    this.csgoConf = this.csgoConf + " " + value;
                }
                this.csgoConf = this.csgoConf.replace("  ", " ");
                this.csgoConf = this.csgoConf.trim();
            },
            changeConfOnly: function(value, array) {
                let _this = this;
                array.forEach(function (item) {
                    if(value === item){
                        _this.changeConf(item);
                    }else{
                        if(_this.csgoConf.indexOf(item) > -1){
                            _this.changeConf(item);
                        }
                    }
                });
            },
            changeFps: function (value) {
                const array = ["-freq 60", "-freq 75", "-freq 144"];
                this.changeConfOnly(value, array);
            },
            changeColor: function (value) {
                const array = ["-32bpp", "-64bpp"];
                this.changeConfOnly(value, array);
            },
            changeThread: function (value) {
                const array = ["-threads 2", "-threads 4", "-threads 6", "-threads 8"];
                this.changeConfOnly(value, array);
            }
        },
        created: function () {
            const _this = this;
            _this.axios.get(_this.$globalConfig.DEFAULT_API_URL + "/csgo/startUp")
                .then(function (response) {
                    _this.csgoConf = response.content;
                });
        }
    };
</script>