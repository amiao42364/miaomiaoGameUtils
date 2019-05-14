<template>
    <el-container>
        <el-main>
            <el-row>
                <el-button type="primary" @click="search(1)">寻访一次</el-button>
                <el-button type="warning" @click="search(10)">寻访十次</el-button>
                <div style="margin-left: 5px; display: inline-block;">
                    <span>
                        <el-switch v-model="upValue" active-color="#13ce66" inactive-color="#ff4949"
                                   @change="upChange"></el-switch>
                    </span>
                    <span>
                        {{upText}}活动up：六星中50%概率为 <span class="upCharacter1">能天使</span>/<span
                            class="upCharacter2">安洁莉娜</span>
                    </span>
                </div>
            </el-row>
            <div class="line"></div>
            <el-row v-bind:class="{tableShow: isShow}">
                <el-table :data="statisticData" stripe border max-height="500" style="width: 100%;">
                    <el-table-column prop="totalCount" label="寻访数" width="180"></el-table-column>
                    <el-table-column prop="lv6Count" label="六星获取率" width="180"></el-table-column>
                    <el-table-column prop="lv5Count" label="五星获取率" width="180"></el-table-column>
                    <el-table-column prop="appraise" label="评价"></el-table-column>
                </el-table>
            </el-row>
            <div class="line"></div>
            <el-row v-bind:class="{tableShow: isShow}">
                <el-table :data="characterData" stripe border height="500" style="width: 100%;">
                    <el-table-column prop="level" label="稀有度" width="180">
                        <template slot-scope="scope">
                            <div slot="reference">
                                <span class="level6Color" v-if="6 === scope.row.level">★★★★★★</span>
                                <span class="level5Color" v-if="5 === scope.row.level">★★★★★</span>
                                <span class="level4Color" v-if="4 === scope.row.level">★★★★</span>
                                <span class="level3Color" v-if="3 === scope.row.level">★★★</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="干员" width="180">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" width="250" placement="top">
                                <p>{{ scope.row.record }}</p>
                                <div slot="reference">
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
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="num" label="次数"></el-table-column>
                </el-table>
            </el-row>
        </el-main>
    </el-container>
</template>

<style>
    .upCharacter1 {
        color: #409EFF;
    }

    .upCharacter2 {
        color: #F56C6C;
    }

    .line {
        margin-top: 20px;
    }

    .tableShow {
        display: none;
    }

    .level6Color {
        color: #FF6600
    }

    .level5Color {
        color: #FFCC00
    }

    .level4Color {
        color: #CC00FF
    }

    .level3Color {
        color: #6666FF
    }

    .characterIcon {
        width: 25px;
        height: 25px;
        margin-top: 3px;
    }

</style>

<script>
    import arkSearch from "../../utils/ArkSearch";

    let baseData = {
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
    };
    export default {
        data() {
            return {
                upValue: true,
                upText: "开启",
                isShow: true,
                characterData: [],
                statisticData: []
            };
        },
        methods: {
            upChange(value) {
                if (value) {
                    this.upText = "开启";
                } else {
                    this.upText = "关闭";
                }
                baseData.upValue = value;
            },
            search(count) {
                this.isShow = false;
                let result = arkSearch(count, baseData);
                statistics(result, this);
            }
        }
    };

    /**
     * 统计结果
     * @param result
     * @param _this
     */
    function statistics(result, _this) {
        let characterData = [];
        let statisticData = [];
        packageData(characterData, statisticData, result);
        _this.characterData = characterData;
        _this.statisticData = statisticData;
    }

    /**
     * 组装数据
     * @param characterData
     * @param statisticData
     * @param result
     */
    function packageData(characterData, statisticData, result) {
        // 组装干员数据
        let characters = result.characters;
        for (let lv = 6; lv >= 3; lv--) {
            if ("level" + lv in characters) {
                for (let i = 0; i < characters["level" + lv].length; i++) {
                    characterData.push({
                        id: characters["level" + lv][i].id,
                        url: characters["level" + lv][i].url,
                        record: characters["level" + lv][i].record,
                        level: lv,
                        name: characters["level" + lv][i].name,
                        num: characters["level" + lv][i].count
                    });
                }
            }
        }
        // 组装统数据
        let totalCount = result.totalCount;
        let lv6Rate = ((result.lv6Count / totalCount).toFixed(4) * 100).toFixed(2) + "%";
        let lv5Rate = ((result.lv5Count / totalCount).toFixed(4) * 100).toFixed(2) + "%";
        let appraise = getAppraise(result.lv6Count, totalCount);

        statisticData.push({
            totalCount: totalCount,
            lv6Count: lv6Rate,
            lv5Count: lv5Rate,
            appraise: appraise
        });
    }

    /**
     * 评价
     */
    function getAppraise(lv6Count, totalCount) {
        // 数学期望34.5抽可以获得一个六星干员
        let avgRate = 0.029;
        return "亚洲人";
    }
</script>
