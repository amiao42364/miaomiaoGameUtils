<template>
    <el-container style="height: 100%; background: #DCDFE6">
        <el-header style="height: auto;">
            <h1>请输入需要的材料及已拥有的数量，点击过滤去除不相关及数量足够的物品</h1>
            <el-row>
                <el-button size="mini" type="primary" @click="resetNum">重置</el-button>
                <el-button size="mini" type="success" @click="filter">过滤</el-button>
            </el-row>
        </el-header>
        <el-main style="margin-top: 10px">
            <el-col v-bind:style="itemColStyle(baseData[key]['colorId'])" v-show="baseData[key].isShow"
                    v-for="key in Object.keys(baseData)">
                <el-card :body-style="{ padding: '0px' }" class="card-main">
                    <div class="img-parent">
                        <el-tooltip :content="baseData[key].desc" placement="bottom" effect="light">
                            <img :src="getItemImg(baseData[key].name)" class="img-image" :alt="baseData[key].name">
                        </el-tooltip>
                        <img :src="getItemBoard(baseData[key].level)" class="img-board" :alt="baseData[key].name">
                    </div>
                    <div class="card-text">
                        <span v-bind:style="boxFontStyle(baseData[key]['colorId'])">{{baseData[key].name}}</span>
                        <br>
                        <span v-html="baseData[key].needHtml"></span>
                    </div>
                    <el-row style="border-top: 1px solid #000000"></el-row>
                    <div class="card-drop">
                        <span v-for="dropKey in Object.keys(baseData[key].drop)">{{dropKey}}：{{baseData[key].drop[dropKey]}}<br></span>
                    </div>
                    <div class="card-bottom">
                        <el-input @input="numInputRequire(key)" class="bottom-input" v-model="baseData[key].require"
                                  size="mini"
                                  placeholder="需求"></el-input>
                        <el-input @input="numInputHave(key)" class="bottom-input" v-model="baseData[key].have"
                                  size="mini"
                                  placeholder="已有"></el-input>
                    </div>
                </el-card>
            </el-col>
        </el-main>
    </el-container>
</template>

<style>
    .card-text {
        text-align: center;
        font-size: 14px;
        height: 40px;
    }

    .card-drop {
        text-align: center;
        font-size: 12px;
        height: 35px;
    }

    .img-image {
        position:absolute;
        z-index: 10;
        left:0; right:0; top:0; bottom:0;
        margin:auto;
    }
    .img-board {
        position:absolute;
        z-index: 5;
        left:0; right:0; top:0; bottom:0;
        margin:auto;
    }

    .img-parent {
        margin-top: 5px;
        position:relative;
        height: 55px;
    }

    .card-main {
        width: 108px;
    }

    .bottom-input {
        width: 48px;
        margin-left: 4px;
        margin-bottom: 4px;
    }
    .bottom-input input{
        padding-left: 5px;
        padding-right: 5px;
    }

</style>

<script>
    import count from "./itemCount"
    export default {
        data() {
            return {
                baseData: {},
                colorData: {
                    "10": "#FF6600",
                    "20": "#CC00FF",
                    "30": "#6666FF",
                    "40": "#67C23A",
                    "50": "#000000",
                },
                boxFontStyle: function (colorId) {
                    return {
                        "color": this.colorData[colorId]
                    }
                },
                itemColStyle: function (colorId) {
                    return {
                        "margin-right": "10px",
                        "margin-bottom": "10px",
                        "width": "114px",
                        "border": "2px solid " + this.colorData[colorId]
                    }
                }
            };
        },
        methods: {
            getItemImg: function (name) {
                return this.$globalConfig.DEFAULT_OSS_URL_ITEM + name + this.$globalConfig.DEFAULT_OSS_SUFFIX + "?x-oss-process=image/resize,w_48,h_48";
            },
            getItemBoard: function (level) {
                return this.$globalConfig.DEFAULT_OSS_URL_ITEM + "level" + level + this.$globalConfig.DEFAULT_OSS_SUFFIX + "?x-oss-process=image/resize,w_50,h_50";
            },
            resetNum: function () {
                const _this = this;
                Object.keys(this.baseData).forEach(function (key) {
                    _this.baseData[key].need = 0;
                    _this.baseData[key].have = "";
                    _this.baseData[key].require = "";
                    _this.baseData[key].parentRequire = "";
                    _this.baseData[key].needHtml = "";
                    _this.baseData[key].isShow = true;
                });
            },
            filter: function () {
                const _this = this;
                Object.keys(_this.baseData).forEach(function (key) {
                    if (_this.baseData[key].need <= 0) {
                        _this.baseData[key].isShow = false;
                    }
                });
            },
            numInputRequire: function (key) {
                let require = this.baseData[key].require;
                // 限制只能输入0-99
                require = require.replace(/[^0-9]/ig, "");
                if (Number.parseInt(require) > 99) {
                    require = "99";
                }
                this.baseData[key].require = require;
                count.numInput(this);
            },
            numInputHave: function (key) {
                let have = this.baseData[key].have;
                // 限制只能输入0-99
                have = have.replace(/[^0-9]/ig, "");
                if (Number.parseInt(have) > 99) {
                    have = "99";
                }
                this.baseData[key].have = have;
                count.numInput(this);
            }
        },
        created() {
            const _this = this;
            _this.axios.get(_this.$globalConfig.DEFAULT_API_URL + "/json/ark?type=items")
                .then(function (response) {
                    let data = response.content;
                    Object.keys(data).forEach(function (key) {
                        data[key].need = 0;
                        data[key].have = "";
                        data[key].require = "";
                        data[key].parentRequire = "";
                        data[key].needHtml = "";
                        data[key].isShow = true;
                    });
                    _this.baseData = data;
                });
        }
    };
</script>
