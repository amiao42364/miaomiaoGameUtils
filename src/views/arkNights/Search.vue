<template>
    <el-container style="background: #DCDFE6; height: auto;">
        <el-main>
            <el-row>
                <el-button type="primary" @click="search(1)">寻访一次</el-button>
                <el-button type="warning" @click="search(10)">寻访十次</el-button>
                <el-tooltip class="item" effect="dark" content="清空统计" placement="right-end">
                    <div class="ark-inline-block" @click="removeStatistic()">
                        <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                    </div>
                </el-tooltip>
            </el-row>
            <div class="line"></div>
            <el-row>
                <span>
                    <el-switch v-model="upValue" active-color="#13ce66" inactive-color="#ff4949" @change="upChange"></el-switch>
                </span>
                <span v-html="upContext" style="margin-left: 5px;"></span>
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
                <el-table :data="characterData" stripe border :height="tableHeight" style="width: 100%;">
                    <el-table-column prop="level" label="稀有度" min-width="20%">
                        <template slot-scope="scope">
                            <div slot="reference">
                                <span class="level6Color" v-if="6 === scope.row.level">★★★★★★</span>
                                <span class="level5Color" v-if="5 === scope.row.level">★★★★★</span>
                                <span class="level4Color" v-if="4 === scope.row.level">★★★★</span>
                                <span class="level3Color" v-if="3 === scope.row.level">★★★</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="干员" min-width="40%">
                        <template slot-scope="scope">
                            <div slot="reference">
                                <el-tooltip :content="scope.row.record" width="250" effect="light" placement="top">
                                    <el-tag size="large" class="level6Color" v-if="6 === scope.row.level">
                                        <el-image class="characterIcon" :src="scope.row.url"></el-image>
                                        {{scope.row.name}}
                                    </el-tag>
                                    <el-tag size="large" class="level5Color" v-if="5 === scope.row.level">
                                        <el-image class="characterIcon" :src="scope.row.url"></el-image>
                                        {{scope.row.name}}
                                    </el-tag>
                                    <el-tag size="large" class="level4Color" v-if="4 === scope.row.level">
                                        <el-image class="characterIcon" :src="scope.row.url"></el-image>
                                        {{scope.row.name}}
                                    </el-tag>
                                    <el-tag size="large" class="level3Color" v-if="3 === scope.row.level">
                                        <el-image class="characterIcon" :src="scope.row.url"></el-image>
                                        {{scope.row.name}}
                                    </el-tag>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="num" label="次数" min-width="40%">
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

<script>
    import arkSearch from "./ArkSearch";

    export default {
        data() {
            return {
                upValue: true,
                upContext: arkSearch.generateUpContent(true),
                isShow: true,
                tableHeight: document.documentElement.clientHeight - 370 + "px",
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
            upChange(value) {
                this.upContext = arkSearch.generateUpContent(value);
                this.$store.commit("arkNightsUp", value);
            },
            search(count) {
                this.isShow = false;
                let baseData = this.$store.state.arkNightsData;
                let result = arkSearch.search(count, baseData);
                arkSearch.statistics(result, this);
            },
            removeStatistic() {
                this.isShow = true;
                this.statisticData = [{
                    totalCount: 0,
                    lv6Count: 0,
                    lv5Count: 0,
                    appraise: "--"
                }];
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
        },
        created: function () {
            // 验证卡池数据
            arkSearch.judgeData(this.$store.state.arkNightsData);
        }
    };
</script>
