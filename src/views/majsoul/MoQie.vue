<template>
    <el-container style="background: #DCDFE6; height: 100%">
        <el-main class="moqie-box-parent">
            <!--开始区域-->
            <el-card v-show="showStart" class="box-card start">
                <div>
                    <el-button @click="startChong" size="large" type="danger">开始放铳</el-button>
                    <el-button @click="startUpload" size="large" type="success">上传牌谱</el-button>
                </div>
            </el-card>
            <!--答题区域-->
            <el-card v-show="showMain" class="box-card main">
                <el-row>
                    <div class="card-main">
                        <div class="majsoul-card" @click="selectAnswer(card)" v-for="card in question['card']">{{card}}</div>
                    </div>
                </el-row>
                <el-row>
                    <div v-show="showAnswer" class="card-answer">
                        <!--<div class="majsoul-answer" v-for="answer in baseData.answer">{{answer.desc}}</div>-->
                    </div>
                </el-row>
            </el-card>
            <!--上传区域-->
            <el-card v-show="showUpload" class="box-card upload">
                <el-form :model="majsoulUploadForm" label-width="80px">
                    <el-row>
                        <div class="majsoul-all-card">
                            <div class="majsoul-card" @click="selectUpload(card)" v-for="card in Array.from(new Set(upload_allCard))">
                                {{card}}
                            </div>
                        </div>
                    </el-row>
                    <el-row>
                        <div class="majsoul-selected-card">
                            <div class="majsoul-card" @click="removeUpload(card)" v-for="card in upload_selectedCard">{{card}}</div>
                        </div>
                    </el-row>
                </el-form>
            </el-card>
        </el-main>
    </el-container>
</template>

<style>
    .moqie-box-parent {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .start {
        width: 300px;
        height: 185px;
    }

    .main {
        width: 600px;
        height: 385px;
    }

    .upload {
        width: 600px;
        height: 385px;
    }

    .majsoul-card {
        cursor: pointer;
        float: left;
        margin-left: 5px;
        border: 1px solid #000000;
    }

    .majsoul-card:hover {
        border: 1px solid red;
    }

    .majsoul-all-card {
        border: 1px solid black;
    }

    .majsoul-selected-card {
        border: 1px solid black;
        margin-top: 10px;
    }
</style>

<script>
    export default {
        data() {
            return {
                baseData: [], //从服务端获取的题目
                question: {}, //当前题目
                showStart: true, //展示开始界面
                showMain: false, //展示题目主界面
                showUpload: false, //展示上传界面
                showAnswer: false, //展示答案界面
                majsoulUploadForm: {},  //上传题目表单
                upload_allCard: ["1m", "1m", "1m", "1m", "2m", "2m", "2m", "2m", "3m", "3m", "3m", "3m", "4m",
                    "4m", "4m", "4m", "5m", "5m", "5m", "0m", "6m", "6m", "6m", "6m", "7m", "7m", "7m", "7m",
                    "8m", "8m", "8m", "8m", "9m", "9m", "9m", "9m", "1p", "1p", "1p", "1p", "2p", "2p", "2p",
                    "2p", "3p", "3p", "3p", "3p", "4p", "4p", "4p", "4p", "5p", "5p", "5p", "0p", "6p", "6p",
                    "6p", "6p", "7p", "7p", "7p", "7p", "8p", "8p", "8p", "8p", "9p", "9p", "9p", "9p", "1s",
                    "1s", "1s", "1s", "2s", "2s", "2s", "2s", "3s", "3s", "3s", "3s", "4s", "4s", "4s", "4s",
                    "5s", "5s", "5s", "0s", "6s", "6s", "6s", "6s", "7s", "7s", "7s", "7s", "8s", "8s", "8s",
                    "8s", "9s", "9s", "9s", "9s", "1z", "1z", "1z", "1z", "2z", "2z", "2z", "2z", "3z", "3z",
                    "3z", "3z", "4z", "4z", "4z", "4z", "5z", "5z", "5z", "5z", "6z", "6z", "6z", "6z", "7z",
                    "7z", "7z", "7z"], //所有的麻将牌
                upload_selectedCard: []  //上传题目当前已选择的牌
            };
        },
        methods: {
            // TODO 牌型判断，数量，是否胡牌
            // 开始答题
            startChong: function () {
                const _this = this;
                _this.axios.get(_this.$globalConfig.DEFAULT_API_URL + "/majsoul/get?limit=10")
                    .then(function (response) {
                        _this.baseData = response.content;
                        if (_this.baseData == null || _this.baseData.length === 0) {
                            _this.$notify.error({
                                title: '错误',
                                message: '当前题库没有题目'
                            });
                            return;
                        }
                        _this.showStart = false;
                        _this.showUpload = false;
                        _this.showMain = true;
                    });
            },
            startUpload: function () {
                const _this = this;


                _this.showStart = false;
                _this.showMain = false;
                _this.showUpload = true;
            },
            // 答题-选择答案
            selectAnswer: function (value) {
                const _this = this;
                _this.showAnswer = true;
            },
            // 上传-选择牌
            selectUpload: function (value) {
                const _this = this;
                // 移动麻将
                const index = _this.upload_allCard.indexOf(value);
                _this.upload_allCard.splice(index, 1);
                _this.upload_selectedCard.push(value);
                // 移动完排序
                _this.upload_allCard.sort(_this.majsoulSort);
                _this.upload_selectedCard.sort(_this.majsoulSort);
            },
            // 上传-取消选择牌
            removeUpload: function (value) {
                const _this = this;
                // 移动麻将
                const index = _this.upload_selectedCard.indexOf(value);
                _this.upload_selectedCard.splice(index, 1);
                _this.upload_allCard.push(value);
                // 移动完排序
                _this.upload_allCard.sort(_this.majsoulSort);
                _this.upload_selectedCard.sort(_this.majsoulSort);
            },
            // 自定义的麻将排序方法
            majsoulSort: function (val1, val2) {
                let char1 = val1.substring(1) + val1.substring(0, 1);
                let char2 = val2.substring(1) + val2.substring(0, 1);
                if (val1.substring(0, 1) === "0") {
                    char1 = char1.substring(0, 1) + "5";
                }
                if (val2.substring(0, 1) === "0") {
                    char2 = char2.substring(0, 1) + "5";
                }
                if (char1 > char2) {
                    return 1;
                } else if (char1 === char2) {
                    return 0;
                } else {
                    return -1;
                }
            }
        },
        created: function () {
            const _this = this;

        }
    };
</script>