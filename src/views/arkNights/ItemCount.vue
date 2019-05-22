<template>
    <el-container style="height: 100%; background: #DCDFE6">
        <el-header style="height: auto;">
            <h1>请输入需要的材料及已拥有的数量，点击过滤去除不相关及数量足够的物品</h1>
            <h6>算法也许写的会有问题，掉落地点也有可能有错误，发现任何问题立即联系阿喵修改哦</h6>
            <el-row>
                <el-button size="mini" type="primary" @click="resetNum">重置</el-button>
                <el-button size="mini" type="success" @click="filter">过滤</el-button>
            </el-row>
        </el-header>
        <el-main style="margin-top: 10px">
            <el-col v-bind:style="itemColStyle(baseData[key]['colorId'])" v-show="baseData[key].isShow"
                    v-for="key in Object.keys(baseData)">
                <el-card :body-style="{ padding: '0px' }" class="card-main">
                    <el-tooltip :content="baseData[key].desc" placement="bottom" effect="light">
                        <img :src="getItemImg(baseData[key].name)" class="image" :alt="baseData[key].name">
                    </el-tooltip>
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
                        <el-input @input="numInputRequire(key)" style="width: 50%" v-model="baseData[key].require"
                                  size="mini"
                                  placeholder="需求"></el-input>
                        <el-input @input="numInputHave(key)" style="width: 50%" v-model="baseData[key].have"
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
        font-size: 14px;
        height: 40px;
    }

    .card-bottom {

    }

    .card-main {
        width: 108px;
    }

</style>

<script>
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
                return this.$globalConfig.DEFAULT_OSS_URL_ITEM + name + this.$globalConfig.DEFAULT_OSS_SUFFIX + "?x-oss-process=image/resize,w_100";
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
                if (require !== "") {
                    this.numInput();
                }
            },
            numInputHave: function (key) {
                let have = this.baseData[key].have;
                // 限制只能输入0-99
                have = have.replace(/[^0-9]/ig, "");
                if (Number.parseInt(have) > 99) {
                    have = "99";
                }
                this.baseData[key].have = have;
                if (have !== "") {
                    this.numInput();
                }
            },
            numInput: function () {
                const _this = this;
                Object.keys(_this.baseData).forEach(function (key) {
                    let item = _this.baseData[key];
                    let require = isNaN(Number.parseInt(item.require)) ? 0 : Number.parseInt(item.require);
                    let parentRequire = isNaN(Number.parseInt(item.parentRequire)) ? 0 : Number.parseInt(item.parentRequire);
                    let have = isNaN(Number.parseInt(item.have)) ? 0 : Number.parseInt(item.have);
                    let subHave = _this.getSubHave(item);

                    require += parentRequire;
                    have += subHave;
                    let need = require - have;
                    _this.baseData[key].need = need;
                    if (need > 0) {
                        item.needHtml = "<span>还需要</span><span style='color: #FF6600'>" + need + "</span><span>个</span>";
                        // 写入子材料的需求
                        let sub = item['subId'];
                        Object.keys(sub).forEach(function (key) {
                            let temp = isNaN(Number.parseInt(item.parentRequire)) ? 0 : Number.parseInt(item.parentRequire);
                            temp += ((need + subHave) * sub[key]);
                            _this.baseData[key].parentRequire = temp;
                        });
                    } else {
                        item.needHtml = "";
                        item.parentRequire = "";
                        // 写入子材料的需求
                        let sub = item['subId'];
                        Object.keys(sub).forEach(function (key) {
                            _this.baseData[key].parentRequire = "";
                        });
                    }

                });
            },
            getSubHave: function (item) {
                if (Object.keys(item['subId']).length === 0) {
                    return 0;
                }
                const _this = this;
                let sub = item['subId'];

                let count = 0;
                let flag = true;
                while (flag) {
                    let breakFlag = false;
                    Object.keys(sub).forEach(function (key) {
                        let have = isNaN(Number.parseInt(_this.baseData[key].have)) ? 0 : Number.parseInt(_this.baseData[key].have);
                        if (Object.keys(_this.baseData[key]['subId']).length > 0) {
                            let subHave = _this.getSubHave(_this.baseData[key]);
                            have += subHave;
                        }
                        if (have < (count + 1) * sub[key]) {
                            breakFlag = true;
                            return false;
                        }
                    });

                    if (breakFlag) {
                        flag = false;
                    } else {
                        count += 1;
                    }
                }
                return count;
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
