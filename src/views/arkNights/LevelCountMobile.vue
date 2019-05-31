<template>
    <el-container style="height: 100%;">
        <el-main>
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
                <el-row style="margin-bottom: 0.5rem;">
                    <el-col>
                        <el-card class="box-card" shadow="always">
                            <el-row class="row-class">
                                <span class="float-left row-span-label">当前等级：</span>
                                <el-input size="mini" @input="inputCurLevel" clearable placeholder="等级" v-model="curLevel"
                                          class="input-with-select">
                                    <el-select v-model="curPower" slot="prepend" placeholder="未精英化" value="0">
                                        <el-option label="未精英化" value="0"></el-option>
                                        <el-option :disabled="disabledPower1" label="精英化1" value="1"></el-option>
                                        <el-option :disabled="disabledPower2" label="精英化2" value="2"></el-option>
                                    </el-select>
                                </el-input>
                            </el-row>
                            <el-row class="row-class">
                                <span class="float-left row-span-label">目标等级：</span>
                                <el-input size="mini" @input="inputTargetLevel" clearable placeholder="等级" v-model="targetLevel"
                                          class="input-with-select">
                                    <el-select v-model="targetPower" slot="prepend" placeholder="未精英化" value="2">
                                        <el-option label="未精英化" value="0"></el-option>
                                        <el-option :disabled="disabledPower1" label="精英化1" value="1"></el-option>
                                        <el-option :disabled="disabledPower2" label="精英化2" value="2"></el-option>
                                    </el-select>
                                </el-input>
                            </el-row>
                            <el-row class="row-class">
                                <span class="row-span-label">当前经验：</span>
                                <el-input size="mini" @input="inputCurExp" clearable v-model="curExp" placeholder="经验"></el-input>
                            </el-row>
                            <el-row class="row-class">
                                <span class="row-span-label">当前金钱：</span>
                                <el-input size="mini" @input="inputCurMoney" v-model="curMoney" clearable placeholder="龙门币"></el-input>
                            </el-row>
                            <el-row class="row-class">
                                <div class="img-book-div">
                                    <el-image class="img-book" :src="bookLevel5" fit="fit"></el-image>
                                    <el-image class="img-board" :src="board5" fit="fit"></el-image>
                                </div>
                                <el-input class="img-book-input" size="mini" @input="inputBook" clearable v-model="curBookLv4"
                                          placeholder="数量"></el-input>
                                <div class="img-book-div">
                                    <el-image class="img-book" :src="bookLevel4" fit="fit"></el-image>
                                    <el-image class="img-board" :src="board4" fit="fit"></el-image>
                                </div>
                                <el-input class="img-book-input" size="mini" @input="inputBook" clearable v-model="curBookLv3"
                                          placeholder="数量"></el-input>
                            </el-row>
                            <el-row class="row-class">
                                <div class="img-book-div">
                                    <el-image class="img-book" :src="bookLevel3" fit="fit"></el-image>
                                    <el-image class="img-board" :src="board3" fit="fit"></el-image>
                                </div>
                                <el-input class="img-book-input" size="mini" @input="inputBook" clearable v-model="curBookLv2"
                                          placeholder="数量"></el-input>
                                <div class="img-book-div">
                                    <el-image class="img-book" :src="bookLevel2" fit="fit"></el-image>
                                    <el-image class="img-board" :src="board2" fit="fit"></el-image>
                                </div>
                                <el-input class="img-book-input" size="mini" @input="inputBook" clearable v-model="curBookLv1"
                                          placeholder="数量"></el-input>
                            </el-row>
                        </el-card>
                    </el-col>
                    <el-col style="margin-top: 0.5rem">
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
    .el-main {
        padding: 0.5rem;
    }
    .img-book-div{
        position:relative;
        width: 1.7rem;
        height: 1.7rem;
    }
    .img-book{
        position:absolute;
        z-index: 10;
        left:0; right:0; top:0; bottom:0;
        margin:auto;
    }
    .img-board{
        position:absolute;
        z-index: 5;
        left:0; right:0; top:0; bottom:0;
        margin:auto;
    }
    .img-book-input {
        width: 6rem;
        margin-left: 0.3rem;
        margin-right: 0.3rem;
    }

    .el-header {
        padding: 0 0.5rem;
    }

    .row-class {
        display: flex;
        align-items: center;
        margin-bottom: 0.3rem;
    }

    .input-with-select .el-input-group__prepend {
        background-color: #fff;
        width: 3.4rem;
    }

    .row-span-label {
        width: 6.5rem;
    }

</style>

<script>
    import level from "./levelCount.js"

    export default {
        data() {
            return {
                levelData: {},
                resultHtml: "",
                bookLevel5: "https://arknights.oss-cn-shanghai.aliyuncs.com/items/高级经验书.png?x-oss-process=image/resize,w_50,h_50",
                bookLevel4: "https://arknights.oss-cn-shanghai.aliyuncs.com/items/中级经验书.png?x-oss-process=image/resize,w_50,h_50",
                bookLevel3: "https://arknights.oss-cn-shanghai.aliyuncs.com/items/初级经验书.png?x-oss-process=image/resize,w_50,h_50",
                bookLevel2: "https://arknights.oss-cn-shanghai.aliyuncs.com/items/基础经验书.png?x-oss-process=image/resize,w_50,h_50",
                board5: "https://arknights.oss-cn-shanghai.aliyuncs.com/items/level5.png?x-oss-process=image/resize,w_50,h_50",
                board4: "https://arknights.oss-cn-shanghai.aliyuncs.com/items/level4.png?x-oss-process=image/resize,w_50,h_50",
                board3: "https://arknights.oss-cn-shanghai.aliyuncs.com/items/level3.png?x-oss-process=image/resize,w_50,h_50",
                board2: "https://arknights.oss-cn-shanghai.aliyuncs.com/items/level2.png?x-oss-process=image/resize,w_50,h_50",
                disabledPower1: false,
                disabledPower2: false,
                curStar: "六星干员",
                curPower: "0",
                curLevel: 0,
                targetPower: "2",
                targetLevel: 0,
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
                level.changeStar(this, value);
            },
            inputCurLevel: function () {
                let curLevel = this.curLevel + "";
                // 限制只能输入数字
                curLevel = curLevel.replace(/[^0-9]/ig, "");
                let maxLevel = level.getMaxLevel(this, this.curPower);
                curLevel = Number.parseInt(curLevel) ? Number.parseInt(curLevel) : 0;
                if (curLevel > maxLevel) {
                    curLevel = maxLevel;
                }
                this.curLevel = curLevel;
            },
            inputTargetLevel: function () {
                let targetLevel = this.targetLevel;
                // 限制只能输入数字
                targetLevel = targetLevel.replace(/[^0-9]/ig, "");
                let maxLevel = level.getMaxLevel(this, this.targetPower);
                targetLevel = Number.parseInt(targetLevel) ? Number.parseInt(targetLevel) : 0;
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
                if(this.curLevel === 0){
                    this.curLevel = 1;
                }
                if(this.targetLevel === 0){
                    this.targetLevel = 1;
                }
                level.calculation(this);
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
