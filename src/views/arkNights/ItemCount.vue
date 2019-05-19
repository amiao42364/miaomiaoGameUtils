<template>
    <el-container class="background" style="height: 100%;">
        <el-header style="height: auto;">
            <h1>请选择需要的材料及数量</h1>
            <el-row>
                <el-button size="mini" type="primary" @click="resetNum">重置</el-button>
                <el-button size="mini" type="success" @click="filter">过滤</el-button>
            </el-row>
        </el-header>
        <el-main style="margin-top: 10px">
            <el-row :id="'arkNightsItemRow' + index" v-for="(data, index) in baseData">
                <el-card class="box-card" v-bind:style="boxCardStyle(data[0]['colorId'])">
                    <el-col class="item-col" v-show="item.isShow" v-for="item in data">
                        <el-card :body-style="{ padding: '0px' }">
                            <img :src="getItemImg(item.name)" class="image" :alt="item.name">
                            <div class="card-main">
                                <span v-bind:style="boxFontStyle(data[0]['colorId'])">{{item.name}}</span>
                                <span v-html="item.needHtml"></span>
                                <div class="bottom">
                                    <el-input @change="numChange" @input="numChange" style="width: 50%" v-model="item.require" size="mini"
                                              placeholder="需求"></el-input>
                                    <el-input @change="numChange" @input="numChange" style="width: 50%" v-model="item.have" size="mini"
                                              placeholder="已有"></el-input>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-card>
                <div class="line"></div>
            </el-row>
        </el-main>
    </el-container>
</template>

<style>
    .background {
        background: #DCDFE6;
    }

    .item-col {
        margin-right: 20px;
        margin-bottom: 20px;
        width: 150px;
    }

    .card-main {
        padding: 14px;
        text-align: center;
        font-size: 12px;
    }


</style>

<script>
    import itemData from "../../../public/ArlNightsItemData.json";

    function getDefaultData() {
        let data = [];
        let originData = itemData.data;
        originData.forEach(function (item) {
            item.need = "";
            item.have = "";
            item.require = "";
            item.realRequire = "";
            item.realHave = "";
            item.needHtml = "";
            item.isShow = true;
        });
        data.push(originData.filter(function (v) {
            return v.id < 2000;
        }));
        data.push(originData.filter(function (v) {
            return v.id < 3000 && v.id >= 2000;
        }));
        data.push(originData.filter(function (v) {
            return v.id < 4000 && v.id >= 3000;
        }));
        data.push(originData.filter(function (v) {
            return v.id < 5000 && v.id >= 4000;
        }));
        data.push(originData.filter(function (v) {
            return v.id >= 5000;
        }));
        return data;
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
                boxCardStyle: function (colorId) {
                    return {
                        "background": this.colorData[colorId]
                    }
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
                this.baseData.forEach(function (data, index) {
                    data.forEach(function (item) {
                        item.need = "";
                        item.have = "";
                        item.require = "";
                        item.realRequire = "";
                        item.realHave = "";
                        item.needHtml = "";
                        item.isShow = true;
                    });
                    document.getElementById("arkNightsItemRow" + index).style.display = "block";
                });
            },
            numChange: function () {
                const _this = this;
                let requireAry = [];
                _this.baseData.forEach(function (data) {
                    data.forEach(function (item) {
                        let realRequire = isNaN(Number.parseInt(item.require)) ? 0 : Number.parseInt(item.require);
                        item.realRequire = realRequire;
                        if (requireAry.length > 0) {
                            requireAry.forEach(function (value, index) {
                                if (value.id === item.id) {
                                    realRequire += value.num;
                                    item.realRequire = realRequire;
                                    requireAry.splice(index, 1);
                                    index--;
                                }
                            });
                        }
                        let realHave = isNaN(Number.parseInt(item.have)) ? 0 : Number.parseInt(item.have);
                        if(item["subId"].length > 0){
                            realHave += _this.getRealHave(item["subId"]);
                        }

                        item.realHave = realHave;
                        let need = realRequire - realHave;
                        if (need > 0) {
                            item.needHtml = "<span>还需要</span><span style='color: #FF6600'>" + need + "</span><span>个</span>";
                            let subAry = item["subId"];
                            if (subAry.length > 0) {
                                subAry.forEach(function (sub) {
                                    requireAry.push({
                                        id: sub.id,
                                        num: need * sub.num
                                    });
                                });
                            }
                        } else {
                            item.needHtml = "";
                            item.realRequire = "";
                        }
                    });
                });


            },
            filter: function () {
                const _this = this;
                _this.baseData.forEach(function (data, index) {
                    let flag = false;
                    data.forEach(function (item) {
                        let realRequire = isNaN(Number.parseInt(item.realRequire)) ? 0 : Number.parseInt(item.realRequire);
                        if (realRequire <= 0) {
                            item.isShow = false;
                        } else {
                            flag = true;
                        }
                    });
                    if (!flag) {
                        document.getElementById("arkNightsItemRow" + index).style.display = "none";
                    }else{
                        document.getElementById("arkNightsItemRow" + index).style.display = "block";
                    }
                })
            },
            getRealHave(subAry){
                const _this = this;
                let readHave = 0;
                _this.baseData.forEach(function (data) {
                    data.forEach(function (item) {
                        subAry.forEach(function (sub){
                            if(item.id === sub.id){
                                sub.have = item.have;
                            }
                        })
                    })
                })
            }
        }
    };
</script>
