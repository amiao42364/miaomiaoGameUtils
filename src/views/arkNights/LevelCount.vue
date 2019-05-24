<template>
    <el-container style="height: 100%;">
        <el-main style="margin-top: 10px">
            <el-card class="box-card" shadow="always" style="background: #DCDFE6;">
                <div slot="header">
                    <span>
                        请输入当前等级以及目标等级，当前为
                        <el-dropdown @command="changeStar">
                            <span style="color: crimson" class="el-dropdown-link">{{curStar}}<i
                                    class="el-icon-arrow-down el-icon--right"></i></span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="六星干员">六星干员</el-dropdown-item>
                                    <el-dropdown-item command="五星干员">五星干员</el-dropdown-item>
                                    <el-dropdown-item command="四星干员">四星干员</el-dropdown-item>
                                    <el-dropdown-item command="三星干员">三星干员</el-dropdown-item>
                                    <el-dropdown-item command="二星干员">二星干员</el-dropdown-item>
                                    <el-dropdown-item command="一星干员">一星干员</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                    </span>
                </div>
                <el-row style="margin-bottom: 15px;">
                    <el-col :span="rowColl">
                        <el-card class="box-card" shadow="always">
                            <el-row class="row-class">
                                <span class="float-left" style="width: 100px;">当前等级：</span>
                                <el-input @input="inputCurLevel" clearable placeholder="等级" v-model="curLevel" class="input-with-select">
                                    <el-select v-model="curPower" slot="prepend" placeholder="未精英化" value="0">
                                        <el-option label="未精英化" value="0"></el-option>
                                        <el-option :disabled="disabledPower1" label="精英化1" value="1"></el-option>
                                        <el-option :disabled="disabledPower2" label="精英化2" value="2"></el-option>
                                    </el-select>
                                </el-input>
                            </el-row>
                            <el-row class="row-class">
                                <span class="float-left" style="width: 100px;">目标等级：</span>
                                <el-input @input="inputTargetLevel" clearable placeholder="等级" v-model="targetLevel"
                                          class="input-with-select">
                                    <el-select v-model="targetPower" slot="prepend" placeholder="未精英化" value="2">
                                        <el-option label="未精英化" value="0"></el-option>
                                        <el-option :disabled="disabledPower1" label="精英化1" value="1"></el-option>
                                        <el-option :disabled="disabledPower2" label="精英化2" value="2"></el-option>
                                    </el-select>
                                </el-input>
                            </el-row>
                            <el-row class="row-class">
                                <span style="width: 100px;">当前经验：</span>
                                <el-input @input="inputCurExp" clearable v-model="curExp" placeholder="经验"></el-input>
                            </el-row>
                            <el-row class="row-class">
                                <span style="width: 100px;">当前金钱：</span>
                                <el-input @input="inputCurMoney" v-model="curMoney" clearable placeholder="龙门币"></el-input>
                            </el-row>
                            <el-row class="row-class">
                                <el-image style="width: 40px; height: 40px" :src="bookLevel4" fit="fit"></el-image>
                                <el-input @input="inputBook" clearable style="width: 85px;" v-model="curBookLv4"
                                          placeholder="数量"></el-input>
                                <el-image style="width: 40px; height: 40px;margin-left: 15px;" :src="bookLevel3" fit="fit"></el-image>
                                <el-input @input="inputBook" clearable style="width: 85px;" v-model="curBookLv3"
                                          placeholder="数量"></el-input>
                            </el-row>
                            <el-row class="row-class">
                                <el-image style="width: 40px; height: 40px" :src="bookLevel2" fit="fit"></el-image>
                                <el-input @input="inputBook" clearable style="width: 85px;" v-model="curBookLv2"
                                          placeholder="数量"></el-input>
                                <el-image style="width: 40px; height: 40px;margin-left: 15px;" :src="bookLevel1" fit="fit"></el-image>
                                <el-input @input="inputBook" clearable style="width: 85px;" v-model="curBookLv1"
                                          placeholder="数量"></el-input>
                            </el-row>
                        </el-card>
                    </el-col>
                    <el-col :span="rowColl" v-bind:style="rowCollStyle">
                        <el-card class="box-card" shadow="always">
                            <div slot="header">
                                结果
                            </div>
                            <div v-html="resultHtml"></div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row class="row-class">
                    <el-button @click="calculation" style="width: 100%;" type="primary">计算</el-button>
                </el-row>
            </el-card>
        </el-main>
    </el-container>
</template>

<style>
    .row-class {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
    }

    .input-with-select {
        width: 240px;
    }

    .input-with-select .el-input-group__prepend {
        background-color: #fff;
        width: 65px;
    }

    .el-card__body {
        padding: 15px
    }

</style>

<script>
    export default {
        data() {
            return {
                levelData: {},
                rowColl: this.$commonUtil.isPC() ? 11 : 24,
                rowCollStyle: {
                    "margin-left": this.$commonUtil.isPC() ? "20px" : "0",
                    "margin-top": this.$commonUtil.isPC() ? "0" : "20px"
                },
                resultHtml: "",
                bookLevel4: "https://arknights.oss-cn-shanghai.aliyuncs.com/items/高级经验书.png?x-oss-process=image/resize,w_40",
                bookLevel3: "https://arknights.oss-cn-shanghai.aliyuncs.com/items/中级经验书.png?x-oss-process=image/resize,w_40",
                bookLevel2: "https://arknights.oss-cn-shanghai.aliyuncs.com/items/初级经验书.png?x-oss-process=image/resize,w_40",
                bookLevel1: "https://arknights.oss-cn-shanghai.aliyuncs.com/items/基础经验书.png?x-oss-process=image/resize,w_40",
                disabledPower1: false,
                disabledPower2: false,
                curStar: "六星干员",
                curPower: "0",
                curLevel: 1,
                targetPower: "2",
                targetLevel: 1,
                curExp: 0,
                curMoney: 0,
                curBookLv4: 0,
                curBookLv3: 0,
                curBookLv2: 0,
                curBookLv1: 0,
                start: 0,
                end: 0
            };
        },
        methods: {
            changeStar: function (value) {
                if (this.curStar === value) {
                    return;
                }
                // 初始化数据
                this.curStar = value;
                if ("一星干员" === value || "二星干员" === value) {
                    this.disabledPower1 = true;
                    this.disabledPower2 = true;
                    this.targetPower = "0";
                } else if ("三星干员" === value) {
                    this.disabledPower2 = true;
                    this.targetPower = "1";
                } else {
                    this.disabledPower1 = false;
                    this.disabledPower2 = false;
                    this.targetPower = "2";
                }
                this.curPower = "0";
                this.curLevel = 1;
                this.targetLevel = 1;
                this.curExp = 0;
            },
            getMaxLevel: function (power) {
                if (power > 2) {
                    power = 2;
                }
                let levelAry = [];
                switch (this.curStar) {
                    case "六星干员":
                        levelAry = this.levelData["maxLevel"][5];
                        return levelAry[power];
                    case "五星干员":
                        levelAry = this.levelData["maxLevel"][4];
                        return levelAry[power];
                    case "四星干员":
                        levelAry = this.levelData["maxLevel"][3];
                        return levelAry[power];
                    case "三星干员":
                        levelAry = this.levelData["maxLevel"][2];
                        if (power > 1) {
                            power = 1;
                        }
                        return levelAry[power];
                    case "二星干员":
                        levelAry = this.levelData["maxLevel"][1];
                        if (power > 0) {
                            power = 0;
                        }
                        return levelAry[power];
                    case "一星干员":
                        levelAry = this.levelData["maxLevel"][0];
                        if (power > 0) {
                            power = 0;
                        }
                        return levelAry[power];
                }
            },
            inputCurLevel: function () {
                let curLevel = this.curLevel + "";
                // 限制只能输入数字
                curLevel = curLevel.replace(/[^0-9]/ig, "");
                let maxLevel = this.getMaxLevel(this.curPower);
                curLevel = Number.parseInt(curLevel) ? Number.parseInt(curLevel) : 1;
                if (curLevel > maxLevel) {
                    curLevel = maxLevel;
                }
                this.curLevel = curLevel;
            },
            inputTargetLevel: function () {
                let targetLevel = this.targetLevel;
                // 限制只能输入数字
                targetLevel = targetLevel.replace(/[^0-9]/ig, "");
                let maxLevel = this.getMaxLevel(this.targetPower);
                targetLevel = Number.parseInt(targetLevel) ? Number.parseInt(targetLevel) : 1;
                if (targetLevel > maxLevel) {
                    targetLevel = maxLevel;
                }
                this.targetLevel = targetLevel;
            },
            getMaxExp: function () {
                return this.levelData["characterExpMap"][this.curPower][this.curLevel - 1];
            },
            inputCurExp: function () {
                let curExp = this.curExp;
                // 限制只能输入数字
                curExp = curExp.replace(/[^0-9]/ig, "");
                let maxExp = this.getMaxExp();
                curExp = Number.parseInt(curExp) ? Number.parseInt(curExp) : 0;
                if (curExp >= maxExp) {
                    curExp = maxExp - 1;
                }
                if (curExp < 0) {
                    curExp = 0;
                }
                this.curExp = curExp;
            },
            inputCurMoney: function () {
                let curMoney = this.curMoney;
                // 限制只能输入数字
                curMoney = curMoney.replace(/[^0-9]/ig, "");
                curMoney = Number.parseInt(curMoney) ? Number.parseInt(curMoney) : 0;
                if (curMoney > 99999999) {
                    curMoney = 99999999;
                }
                this.curMoney = curMoney;
            },
            inputBook: function () {
                let _this = this;
                for (let i = 1; i <= 4; i++) {
                    let temp = _this["curBookLv" + i] + "";
                    // 限制只能输入数字
                    temp = temp.replace(/[^0-9]/ig, "");
                    temp = Number.parseInt(temp) ? Number.parseInt(temp) : 0;
                    if (temp > 99999) {
                        temp = 99999;
                    }
                    _this["curBookLv" + i] = temp;
                }
            },
            calculation: function () {
                let _this = this;
                // 先判断输入值
                let curPower = Number.parseInt(_this.curPower) ? Number.parseInt(_this.curPower) : 0;
                let targetPower = Number.parseInt(_this.targetPower) ? Number.parseInt(_this.targetPower) : 0;
                if (curPower > targetPower) {
                    _this.$message.error("目标等级不可以大于当前等级");
                    return;
                }
                if (curPower === targetPower) {
                    if (_this.targetLevel <= _this.curLevel) {
                        _this.$message.error("目标等级不可以大于当前等级");
                        return;
                    }
                }
                let totalExp = 0;
                let totalMoney = 0;
                for (let i = curPower; i <= targetPower; i++) {
                    // 精英化费用
                    if (i !== curPower) {
                        const breakCountAry = _this.levelData["evolveGoldCost"];
                        if (_this.curStar === "六星干员") {
                            totalMoney += breakCountAry[5][i - 1];
                        } else if (_this.curStar === "五星干员") {
                            totalMoney += breakCountAry[4][i - 1];
                        } else if (_this.curStar === "四星干员") {
                            totalMoney += breakCountAry[3][i - 1];
                        } else if (_this.curStar === "三星干员") {
                            if (i === 2) {
                                return true;
                            }
                            totalMoney += breakCountAry[2][i - 1];
                        } else {
                            return true;
                        }

                    } else {
                        _this.start = _this.curLevel;
                        if (curPower === targetPower) {
                            _this.end = _this.targetLevel;
                        } else {
                            _this.end = _this.getMaxLevel(i);
                        }
                    }
                    let expAry = _this.levelData["characterExpMap"][i];
                    let moneyAry = _this.levelData["characterUpgradeCostMap"][i];

                    for (let j = _this.start; j < _this.end; j++) {
                        totalExp += expAry[j - 1];
                        totalMoney += moneyAry[j - 1];
                    }
                    _this.start = 1;
                    if ((i + 1) === targetPower) {
                        _this.end = _this.targetLevel;
                    } else {
                        _this.end = _this.getMaxLevel(i + 1);
                    }
                }
                totalExp = totalExp - _this.curExp - 2000 * _this.curBookLv4 - 1000 * _this.curBookLv3 - 400 * _this.curBookLv2 - 200 * _this.curBookLv1;
                if (totalExp < 0) {
                    totalExp = 0;
                }
                totalMoney = totalMoney - _this.curMoney;
                if (totalMoney < 0) {
                    totalMoney = 0;
                }
                let expNum = Math.ceil(totalExp / 7500);
                let moneyNum = Math.ceil(totalMoney / 7500);

                _this.resultHtml = "";
                if (totalExp > 0) {
                    _this.resultHtml += "<p>还需要<span style='color: firebrick;'>" + totalExp + "</span>经验值，需打LS-5<span style='color: firebrick;'>" + expNum + "</span>次</p>";
                }
                if (totalMoney > 0) {
                    _this.resultHtml += "<p>还需要<span style='color: firebrick;'>" + totalMoney + "</span>龙门币，需打CE-5<span style='color: firebrick;'>" + moneyNum + "</span>次</p>";
                }
                _this.resultHtml += "<p>一共需要<span style='color: firebrick;'>" + 30 * (expNum + moneyNum) + "</span>体力</p>";
            }
        },
        created() {
            const _this = this;
            _this.axios.get(_this.$globalConfig.DEFAULT_API_URL + "/json/ark?type=level")
                .then(function (response) {
                    _this.levelData = response.content;
                });
        }
    };
</script>
