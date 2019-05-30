<template>
    <el-container style="height: 100%;background: #DCDFE6;">
        <el-main style="margin-top: 10px">
            <el-row>
                <el-card class="box-card">
                    <div>
                        <el-row class="row-style">
                            <div class="button-head">
                                <el-button type="primary" size="small">资质</el-button>
                            </div>
                            <div class="button-group">
                                <button class="button-diy" @click="hr_click">新手</button>
                                <button class="button-diy" @click="hr_click">资深干员</button>
                                <button class="button-diy" @click="hr_click">高级资深干员</button>
                            </div>
                        </el-row>
                        <el-row class="row-style">
                            <div class="button-head">
                                <el-button type="primary" size="small">位置</el-button>
                            </div>
                            <div class="button-group">
                                <button class="button-diy" @click="hr_click">近战位</button>
                                <button class="button-diy" @click="hr_click">远程位</button>
                            </div>
                        </el-row>
                        <el-row class="row-style">
                            <div class="button-head">
                                <el-button type="primary" size="small">性别</el-button>
                            </div>
                            <div class="button-group">
                                <button class="button-diy" @click="hr_click">男性干员</button>
                                <button class="button-diy" @click="hr_click">女性干员</button>
                            </div>
                        </el-row>
                        <el-row class="row-style">
                            <div class="button-head">
                                <el-button type="primary" size="small">种类</el-button>
                            </div>
                            <div class="button-group">
                                <button class="button-diy" @click="hr_click">先锋干员</button>
                                <button class="button-diy" @click="hr_click">狙击干员</button>
                                <button class="button-diy" @click="hr_click">医疗干员</button>
                                <button class="button-diy" @click="hr_click">术士干员</button>
                                <button class="button-diy" @click="hr_click">近卫干员</button>
                                <button class="button-diy" @click="hr_click">重装干员</button>
                                <button class="button-diy" @click="hr_click">辅助干员</button>
                                <button class="button-diy" @click="hr_click">特种干员</button>
                            </div>
                        </el-row>
                        <el-row class="row-style">
                            <div class="button-head">
                                <el-button type="primary" size="small">词缀</el-button>
                            </div>
                            <div class="button-group">
                                <button class="button-diy" @click="hr_click">治疗</button>
                                <button class="button-diy" @click="hr_click">支援</button>
                                <button class="button-diy" @click="hr_click">输出</button>
                                <button class="button-diy" @click="hr_click">群攻</button>
                                <button class="button-diy" @click="hr_click">减速</button>
                                <button class="button-diy" @click="hr_click">生存</button>
                                <button class="button-diy" @click="hr_click">防护</button>
                                <button class="button-diy" @click="hr_click">削弱</button>
                                <button class="button-diy" @click="hr_click">位移</button>
                                <button class="button-diy" @click="hr_click">控场</button>
                                <button class="button-diy" @click="hr_click">爆发</button>
                                <button class="button-diy" @click="hr_click">召唤</button>
                                <button class="button-diy" @click="hr_click">快速复活</button>
                                <button class="button-diy" @click="hr_click">费用回复</button>
                            </div>
                        </el-row>
                    </div>
                </el-card>
            </el-row>
            <el-row style="margin-top: 15px;">
                <el-table :data="tableData" stripe border style="width: 100%;background: #DCDFE6;">
                    <el-table-column prop="tags" label="标签" min-width="30%">
                        <template slot-scope="scope">
                            <div slot="reference">
                                <el-tag class="tag-style" v-for="tag in scope.row.tags" size="mini">{{tag}}</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="characters" label="可能出现" min-width="70%">
                        <template slot-scope="scope">
                            <div slot="reference">
                                <el-tooltip v-for="item in scope.row.characters" :content="item.record" width="250" effect="light"
                                            placement="top">
                                    <el-tag size="large" class="level6Color tag-style" v-if="6 === item.level">
                                        <el-image class="characterIcon" :src="item.url"></el-image>
                                        {{item.name}}
                                    </el-tag>
                                    <el-tag size="large" class="level5Color tag-style" v-if="5 === item.level">
                                        <el-image class="characterIcon" :src="item.url"></el-image>
                                        {{item.name}}
                                    </el-tag>
                                    <el-tag size="large" class="level4Color tag-style" v-if="4 === item.level">
                                        <el-image class="characterIcon" :src="item.url"></el-image>
                                        {{item.name}}
                                    </el-tag>
                                    <el-tag size="large" class="level3Color tag-style" v-if="3 === item.level">
                                        <el-image class="characterIcon" :src="item.url"></el-image>
                                        {{item.name}}
                                    </el-tag>
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
    .row-style {
        margin-bottom: 15px;
        display: flex;
    }

    .button-head {
        float: left;
    }

    .button-group {
        float: left;
        margin-left: 10px;
    }

    .button-group button {
        margin-bottom: 10px;
        margin-left: 0 !important;
        margin-right: 10px;
    }

    .button-diy {
        color: #67C23A;
        background: #f0f9eb;
        padding: 9px 15px;
        font-size: 12px;
        border-radius: 3px;
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        border: 1px solid #c2e7b0;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: 0;
        margin: 0;
        transition: .1s;
        font-weight: 500;
        -ms-user-select: none;
    }

    .button-diy:hover {
        color: #f0f9eb;
        background: #67C23A;
    }

    .tag-style {
        margin-right: 5px;
        margin-bottom: 2px;
    }
</style>

<script>
    export default {
        data() {
            return {
                hrData: [],
                selectedButton: [],
                tableData: []
            };
        },
        methods: {
            hr_click: function (button) {
                const _this = this;
                let value = button.srcElement.innerText;
                // 先判断是否选中状态
                if (_this.selectedButton.indexOf(value) > -1) {
                    for (let i = 0; i < _this.selectedButton.length; i++) {
                        if (value === _this.selectedButton[i]) {
                            _this.selectedButton.splice(i, 1);
                            i--;
                        }
                    }
                    _this.selectedButton.filter(item => item !== value);
                    button.path[0].style.color = "#67C23A";
                    button.path[0].style.background = "#f0f9eb";
                    button.path[0].onmouseover = function () {
                        this.style.color = "#f0f9eb";
                        this.style.background = "#67C23A";
                    };
                    button.path[0].onmouseleave = function () {
                        this.style.color = "#67C23A";
                        this.style.background = "#f0f9eb";
                    };
                    _this.hr_init();
                    return;
                }
                if (_this.selectedButton.length >= 5) {
                    _this.$message.error("只能选择五条哦");
                    return;
                }
                // 渲染样式
                button.path[0].style.color = "#f0f9eb";
                button.path[0].style.background = "#67C23A";
                button.path[0].onmouseover = function () {
                };
                button.path[0].onmouseleave = function () {
                };
                _this.selectedButton.push(value);
                _this.hr_init();
            },
            hr_init: function () {
                const _this = this;
                let originData = _this.selectedButton;
                if (originData.length === 0) {
                    _this.tableData = [];
                    return;
                }
                // 生成标签排列组合
                let tagResult = [];
                _this.getCombo(tagResult, originData, 0, "");
                // 获取符合组合的人物
                let result = [];
                tagResult.forEach(function (value) {
                    let tempAry = value.split(",");
                    let characters = [];
                    _this.hrData.forEach(function (character) {
                        let tags = character["tags"];
                        let flag = true;
                        tempAry.forEach(function (tag) {
                            if (tags.indexOf(tag) < 0) {
                                flag = false;
                            }
                        });
                        if (flag) {
                            character.url = _this.$globalConfig.DEFAULT_OSS_URL_CHARACTER + character.id + _this.$globalConfig.DEFAULT_OSS_SUFFIX + "?x-oss-process=image/resize,w_25";
                            // 六星干员必须有“高级资深干员”标签
                            if(character.level === 6){
                                if(tempAry.indexOf("高级资深干员") > -1){
                                    characters.push(character);
                                }
                            }else{
                                characters.push(character);
                            }
                        }
                    });
                    if (characters.length > 0) {
                        // 生成该组合的评分
                        let grade = 0;
                        characters.forEach(function (value) {
                            if (6 === value.level) {
                                grade += 1000;
                            } else if (5 === value.level) {
                                grade += 100;
                            } else if (4 === value.level) {
                                grade += 10;
                            } else {
                                grade -= 1000;
                            }
                        });
                        // 按等级排序
                        characters.sort((a, b) => b.level - a.level);
                        result.push({
                            "tags": tempAry,
                            "characters": characters,
                            "grade": grade
                        });
                    }
                });
                // 按组合评分排序
                result.sort((a, b) => b.grade - a.grade);
                console.log(result);
                _this.tableData = result;
            },
            getCombo: function (result, data, count, initial) {
                const _this = this;
                for (let i = count; i < data.length; i++) {
                    const value = initial + ("," + data[i]);
                    result.push(value.substr(1));
                    if (i < data.length - 1) {
                        _this.getCombo(result, data, i + 1, value);
                    }
                }
            }
        },
        created() {
            const _this = this;
            _this.axios.get(_this.$globalConfig.DEFAULT_API_URL + "/json/ark?type=hr")
                .then(function (response) {
                    let hrData = [];
                    if (response.content != null) {
                        for (let key in response.content) {
                            if (response.content.hasOwnProperty(key)) {
                                let obj = response.content[key];
                                obj.forEach(function (value) {
                                    hrData.push(value);
                                });
                            }
                        }
                    }
                    _this.hrData = hrData;
                });
        }
    };
</script>
