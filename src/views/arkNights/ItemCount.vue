<template>
    <el-container style="height: 100%; background: #DCDFE6">
        <el-header style="height: auto;">
            <h1>请选择需要的材料及数量</h1>
            <el-row>
                <el-button size="mini" type="primary" @click="resetNum">重置</el-button>
                <el-button size="mini" type="success" @click="filter">过滤</el-button>
            </el-row>
        </el-header>
        <el-main style="margin-top: 10px">
            <el-col class="item-col" v-show="baseData[key].isShow" v-for="key in Object.keys(baseData)">
                <el-card :body-style="{ padding: '0px' }">
                    <!--<img :src="getItemImg(baseData[key].name)" class="image" :alt="baseData[key].name">-->
                    <div class="card-main">
                        <span v-bind:style="boxFontStyle(baseData[key]['colorId'])">{{baseData[key].name}}</span>
                        <span v-html="baseData[key].needHtml"></span>
                        <div class="bottom">
                            <el-input @input="numInput" style="width: 50%" v-model="baseData[key].require"
                                      size="mini"
                                      placeholder="需求"></el-input>
                            <el-input @input="numInput" style="width: 50%" v-model="baseData[key].have"
                                      size="mini"
                                      placeholder="已有"></el-input>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-main>
    </el-container>
</template>

<style>
    .item-col {
        margin-right: 20px;
        margin-bottom: 20px;
        width: 150px;
    }

</style>

<script>
    import itemData from "../../../public/ArlNightsItemData.json";

    function getDefaultData() {
        Object.keys(itemData).forEach(function (key) {
            itemData[key].need = 0;
            itemData[key].have = "";
            itemData[key].require = "";
            itemData[key].parentRequire = "";
            itemData[key].needHtml = "";
            itemData[key].isShow = true;
        });
        return itemData;
    }

    export default {
        data() {
            return {
                baseData: getDefaultData(),
                colorData: {
                    "10": "#FF6600",
                    "20": "#CC00FF",
                    "30": "#6666FF",
                    "40": "#67C23A",
                    "50": "#FFFFFF",
                },
                boxFontStyle: function (colorId) {
                    return {
                        "color": this.colorData[colorId]
                    }
                }
            };
        },
        methods: {
            getItemImg: function (name) {
                return this.$globalConfig.DEFAULT_OSS_URL_ITEM + name + this.$globalConfig.DEFAULT_OSS_SUFFIX;
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
                    if(_this.baseData[key].need <= 0){
                        _this.baseData[key].isShow = false;
                    }
                });
            },
            numInput: function () {
                const _this = this;

                Object.keys(_this.baseData).forEach(function (key) {

                    if("RMA70-24" === _this.baseData[key].name){
                        console.log()
                    }

                    let item = _this.baseData[key];
                    let require = isNaN(Number.parseInt(item.require)) ? 0 : Number.parseInt(item.require);
                    let parentRequire = isNaN(Number.parseInt(item.parentRequire)) ? 0 : Number.parseInt(item.parentRequire);
                    let have = isNaN(Number.parseInt(item.have)) ? 0 : Number.parseInt(item.have);
                    // 判断子材料的数量
                    require += parentRequire;
                    if (require > 0) {
                        let subHave = _this.getSubHave(item);
                        have += subHave;
                    }
                    let need = require - have;
                    _this.baseData[key].need = need;
                    if (need > 0) {
                        item.needHtml = "<span>还需要</span><span style='color: #FF6600'>" + need + "</span><span>个</span>";
                        // 写入子材料的需求
                        let sub = item['subId'];
                        Object.keys(sub).forEach(function (key) {
                            let temp = isNaN(Number.parseInt(item.parentRequire)) ? 0 : Number.parseInt(item.parentRequire);
                            temp +=  (need * sub[key]);
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
        }
    };
</script>
