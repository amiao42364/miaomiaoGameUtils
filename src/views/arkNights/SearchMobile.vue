<template>
    <el-container style="background: #DCDFE6; height: 100%;">
        <el-main>
            <el-row>
                <el-button size="mini" type="primary" @click="search(1)">寻访一次</el-button>
                <el-button size="mini" type="warning" @click="search(10)">寻访十次</el-button>
                <el-tooltip class="item" effect="dark" content="清空统计" placement="right-end">
                    <div class="ark-inline-block" @click="removeStatistic()">
                        <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </div>
                </el-tooltip>
            </el-row>
            <div class="line"></div>
            <el-row>
                <span>
                    <el-switch size="mini" v-model="upValue" active-color="#13ce66" inactive-color="#ff4949" @change="upChange"></el-switch>
                </span>
                <span v-html="upContext" style="margin-left: 0.4rem;"></span>
            </el-row>
            <div class="line"></div>
            <el-row>
                <span>
                    <el-switch size="mini" v-model="up2Value" active-color="#13ce66" inactive-color="#ff4949" @change="up2Change"></el-switch>
                </span>
                <span v-html="up2Context" style="margin-left: 0.4rem;"></span>
            </el-row>
            <div class="line"></div>
            <el-row>
                <el-table :data="statisticData" stripe border style="width: 100%;">
                    <el-table-column prop="totalCount" label="寻访数" min-width="20%"></el-table-column>
                    <el-table-column prop="lv6Count" label="六星获取率" min-width="20%"></el-table-column>
                    <el-table-column prop="lv5Count" label="五星获取率" min-width="20%"></el-table-column>
                    <el-table-column prop="appraise" label="评价" min-width="40%"></el-table-column>
                </el-table>
            </el-row>
            <div class="line"></div>
            <el-row v-bind:class="{tableShow: isShow}">
                <el-table :data="characterData" stripe border style="width: 100%;">
                    <el-table-column prop="level" label="稀有度" min-width="40%">
                        <template slot-scope="scope">
                            <div slot="reference">
                                <span class="level6Color" v-if="6 === scope.row.level">★★★★★★</span>
                                <span class="level5Color" v-if="5 === scope.row.level">★★★★★</span>
                                <span class="level4Color" v-if="4 === scope.row.level">★★★★</span>
                                <span class="level3Color" v-if="3 === scope.row.level">★★★</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="干员" min-width="35%">
                        <template slot-scope="scope">
                            <div slot="reference">
                                <el-tooltip :content="scope.row.record" width="250" effect="light" placement="top">
                                    <el-tag size="large" class="level6Color" v-if="6 === scope.row.level">{{scope.row.name}}</el-tag>
                                    <el-tag size="large" class="level5Color" v-if="5 === scope.row.level">{{scope.row.name}}</el-tag>
                                    <el-tag size="large" class="level4Color" v-if="4 === scope.row.level">{{scope.row.name}}</el-tag>
                                    <el-tag size="large" class="level3Color" v-if="3 === scope.row.level">{{scope.row.name}}</el-tag>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="num" label="次数" min-width="25%">
                        <template slot-scope="scope">
                            <div slot="reference">
                                <el-tooltip v-if="6 === scope.row.level" :content="scope.row.index" placement="top">
                                    <el-tag class="level6Color">{{scope.row.num}}次</el-tag>
                                </el-tooltip>
                                <el-tooltip v-if="5 === scope.row.level" :content="scope.row.index" placement="top">
                                    <el-tag class="level5Color">{{scope.row.num}}次</el-tag>
                                </el-tooltip>
                                <el-tooltip v-if="4 === scope.row.level" :content="scope.row.index" placement="top">
                                    <el-tag class="level4Color">{{scope.row.num}}次</el-tag>
                                </el-tooltip>
                                <el-tooltip v-if="3 === scope.row.level" :content="scope.row.index" placement="top">
                                    <el-tag class="level3Color">{{scope.row.num}}次</el-tag>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </el-main>
    </el-container>
</template>

<style>
    .el-main{
        padding: 0.5rem;
    }
    .el-header{
        padding: 0 0.5rem;
    }
    .el-table{
        font-size: 12px;
    }
</style>

<script>
    import search from "./search"

    export default {
        data() {
            return {
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
                },
                arkCharactersData: {},
                upValue: true,
                up2Value: false,
                upContext: "",
                up2Context: "",
                isShow: true,
                characterData: [],
                statisticData: [{
                    totalCount: 0,
                    lv6Count: 0,
                    lv5Count: 0,
                    appraise: "--"
                }]
            };
        },
        methods: {
            upChange: function (value) {
                this.upContext = search.generateUpContent(this, value);
                this.up2Value = !value;
                this.up2Context = search.generateUpContent(this, !value, true);
            },
            up2Change: function (value) {
                this.up2Context = search.generateUpContent(this, value, true);
                this.upValue = !value;
                this.upContext = search.generateUpContent(this, !value);
            },
            search: function (count) {
                this.isShow = false;
                let baseData = this.arkNightsData;
                let result = search.searchMain(this, count, baseData);
                search.statistics(this, result);
            },
            removeStatistic: function () {
                this.isShow = true;
                this.statisticData = [{
                    totalCount: 0,
                    lv6Count: 0,
                    lv5Count: 0,
                    appraise: "--"
                }];
                this.arkNightsData = {
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
                };
            }
        },
        created() {
            const _this = this;
            _this.axios.get(_this.$globalConfig.DEFAULT_API_URL + "/json/ark?type=characters")
                .then(function (response) {
                    _this.arkCharactersData = response.content;
                    _this.upContext = search.generateUpContent(_this, true);
                    _this.up2Context = search.generateUpContent(_this, false, true);
                });
        }
    };
</script>
