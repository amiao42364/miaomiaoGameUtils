<template>
    <el-container style="background: #DCDFE6; height: 100%;">
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
                <span>
                    <el-switch v-model="up2Value" active-color="#13ce66" inactive-color="#ff4949" @change="up2Change"></el-switch>
                </span>
                <span v-html="up2Context" style="margin-left: 5px;"></span>
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
                this.upContext = this.generateUpContent(value);
                this.up2Value = !value;
                this.up2Context = this.generateUpContent(!value, true);
            },
            up2Change: function (value) {
                this.up2Context = this.generateUpContent(value, true);
                this.upValue = !value;
                this.upContext = this.generateUpContent(!value);
            },
            search: function (count) {
                this.isShow = false;
                let baseData = this.arkNightsData;
                let result = this.searchMain(count, baseData);
                this.statistics(result);
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
            },
            generateUpContent: function (upSwitch, activity) {
                if (!upSwitch) {
                    if(activity){
                        return "当前关闭活动UP";
                    }
                    return "当前关闭标准寻访UP";
                }
                let prefix = "up";
                let content = "当前开启标准寻访UP:";
                if (activity) {
                    prefix = "up2";
                    content = "当前开启活动UP:";
                }

                const _this = this;
                let flag = false; //标记是否存在活动池
                for (let level = 6; level >= 3; level--) {
                    if (_this.arkCharactersData.hasOwnProperty("level" + level + prefix)) {
                        let array = _this.arkCharactersData["level" + level + prefix];
                        if (array.length > 0) {
                            if (flag) {
                                content += ", ";
                            }
                            content += (_this.$commonUtil.convertNum2Chinese(level) + "星50%为");
                            for (let i = 0; i < array.length; i++) {
                                if (i === 0) {
                                    flag = true;
                                } else {
                                    content += "/";
                                }
                                content += "<span class='level" + level + "Color'>" + array[i].name + "</span>";
                            }
                        }
                    }
                }
                // 存在活动池
                if (flag) {
                    return content;
                } else {
                    return "当前无活动up";
                }
            },
            searchMain: function (count, baseData) {
                for (let i = 0; i < count; i++) {
                    baseData.totalCount += 1;
                    // 先判断人物星级
                    let level = 3;
                    let r1 = Math.floor(Math.random() * 100);
                    if (r1 < baseData.lv6Rate) {
                        level = 6;
                        baseData.lv6Count += 1;
                        baseData.lv6Rate = 2;
                        baseData.noLv6Count = 0;
                    } else if (r1 < (baseData.lv6Rate + baseData.lv5Rate)) {
                        baseData.noLv6Count += 1;
                        baseData.lv5Count += 1;
                        level = 5;
                    } else if (r1 < (baseData.lv6Rate + baseData.lv5Rate + baseData.lv4Rate)) {
                        baseData.noLv6Count += 1;
                        baseData.lv4Count += 1;
                        level = 4;
                    } else {
                        baseData.noLv6Count += 1;
                        baseData.lv3Count += 1;
                    }
                    if (baseData.noLv6Count > 50) {
                        baseData.lv6Rate += 2;
                    }
                    this.addCharacter(baseData, level);
                }
                return baseData;
            },
            addCharacter: function (baseData, level) {
                const _this = this;
                // 判断是否为活动池
                let upCharacter = false;
                if (baseData.upValue) {
                    let random = Math.floor(Math.random() * 100);
                    if (random < 50) {
                        upCharacter = true;
                    }
                }
                // 获取池子数据
                let pool = [];
                let prefix = "up";
                if(_this.up2Value){
                    prefix = "up2";
                }
                if (upCharacter) {
                    pool = _this.arkCharactersData["level" + level + prefix] == null || _this.arkCharactersData["level" + level + prefix].length === 0
                        ? _this.arkCharactersData["level" + level]
                        : _this.arkCharactersData["level" + level + prefix];
                } else {
                    pool = _this.arkCharactersData["level" + level];
                }
                // 抽取人物
                let random = Math.floor(Math.random() * pool.length);
                let character = pool[random];
                // 写入图片url
                character.url = _this.$globalConfig.DEFAULT_OSS_URL_CHARACTER + character.id + _this.$globalConfig.DEFAULT_OSS_SUFFIX + "?x-oss-process=image/resize,w_25";
                // 写入当前序号
                if ("index" in character) {
                    character.index.push(baseData.totalCount);
                } else {
                    character.index = [baseData.totalCount];
                }

                // 判断是否已拥有人物
                if (null == baseData.characters || null == baseData.characters["level" + level]) {
                    baseData.characters["level" + level] = [];
                }
                let selfPool = baseData.characters["level" + level];
                this.judgeContain(selfPool, character);
            },
            judgeContain: function (selfPool, character) {
                if (null == selfPool || 0 === selfPool.length) {
                    character.count = 1;
                    selfPool.push(character);
                } else {
                    for (let i = 0; i < selfPool.length; i++) {
                        if (character.name === selfPool[i].name) {
                            selfPool[i].count += 1;
                            return;
                        }
                    }
                    character.count = 1;
                    selfPool.push(character);
                }
            },
            statistics: function (result) {
                let characterData = [];
                let statisticData = [];
                this.packageData(characterData, statisticData, result);
                this.characterData = characterData;
                this.statisticData = statisticData;
            },
            packageData: function (characterData, statisticData, result) {
                // 组装干员数据
                let characters = result.characters;
                for (let lv = 6; lv >= 3; lv--) {
                    if ("level" + lv in characters) {
                        for (let i = 0; i < characters["level" + lv].length; i++) {
                            let indexAry = characters["level" + lv][i].index;
                            let indexStr = "";
                            if (indexAry.length > 10) {
                                indexAry = indexAry.slice(0, 10);
                                indexStr = "…";
                            }
                            characterData.push({
                                id: characters["level" + lv][i].id,
                                index: indexAry.join(", ") + indexStr,
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
                let appraise = this.getAppraise(result.lv6Count, totalCount);

                statisticData.push({
                    totalCount: totalCount,
                    lv6Count: lv6Rate,
                    lv5Count: lv5Rate,
                    appraise: appraise
                });
            },
            getAppraise: function (lv6Count, totalCount) {
                // 数学期望34.5抽可以获得一个六星干员
                let avgRate = 0.02899;
                let actualRate = (lv6Count / totalCount).toFixed(5);
                if (actualRate < 0.02) {
                    return "非洲大酋长";
                } else if (actualRate < (avgRate + 0.0025)) {
                    return "正常水平";
                } else if (actualRate < 0.06) {
                    return "有点欧了";
                } else if (actualRate < 0.1) {
                    return "欧皇附体";
                } else {
                    return "你开挂了";
                }
            }
        },
        created() {
            const _this = this;
            _this.axios.get(_this.$globalConfig.DEFAULT_API_URL + "/json/ark?type=characters")
                .then(function (response) {
                    _this.arkCharactersData = response.content;
                    _this.upContext = _this.generateUpContent(true);
                    _this.up2Context = _this.generateUpContent(false, true);
                });
        }
    };
</script>
