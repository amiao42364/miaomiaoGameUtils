<template>
    <el-container style="height: 100%;background: #DCDFE6;">
        <el-main>
            <el-row>
                <el-card class="box-card">
                    <el-button @click="removeSelected" size="mini" type="danger">清除选择</el-button>
                    <div style="margin-top: 0.3rem;" ref="buttonDivRefs">
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
            <el-row style="margin-top: 0.5rem;">
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
                                <el-tooltip v-for="item in scope.row.characters" :content="item.record" effect="light" placement="top">
                                    <el-tag size="large" class="level6Color tag-style" v-if="6 === item.level">{{item.name}}</el-tag>
                                    <el-tag size="large" class="level5Color tag-style" v-if="5 === item.level">{{item.name}}</el-tag>
                                    <el-tag size="large" class="level4Color tag-style" v-if="4 === item.level">{{item.name}}</el-tag>
                                    <el-tag size="large" class="level3Color tag-style" v-if="3 === item.level">{{item.name}}</el-tag>
                                    <el-tag size="large" class="level2Color tag-style" v-if="2 === item.level">{{item.name}}</el-tag>
                                    <el-tag size="large" class="level1Color tag-style" v-if="1 === item.level">{{item.name}}</el-tag>
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

    .row-style {
        margin-bottom: 0.2rem;
        display: flex;
    }

    .button-head {
        float: left;
    }

    .button-group {
        float: left;
        margin-left: 0.3rem;
    }

    .button-group button {
        margin-bottom: 0.2rem;
        margin-left: 0 !important;
        margin-right: 0.2rem;
    }

    .button-diy {
        color: #67C23A;
        background: #f0f9eb;
        padding: 0.2rem 0.3rem;
        border-radius: 0.2rem;
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        border: 0.08rem solid #c2e7b0;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: 0;
        margin: 0;
        transition: .1s;
        font-weight: 500;
        -ms-user-select: none;
    }

    .tag-style {
        margin-right: 0.4rem;
        margin-bottom: 0.16rem;
    }
    .box-card .el-card__body{
        padding: 0.4rem;
    }
    .button-head button{
        padding: 0.2rem 0.3rem;
    }
    .el-tooltip{
        height: 1.5rem;
        line-height: 1.5rem;
        padding: 0 0.3rem;
    }
</style>

<script>
    import hr from  "./hr.js"
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
                hr.hr_click(button, this);
            },
            removeSelected: function () {
                hr.removeSelected(this, "buttonDivRefs");
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
