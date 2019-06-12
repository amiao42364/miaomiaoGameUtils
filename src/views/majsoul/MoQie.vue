<template>
    <el-container style="height: 100%">
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
                <el-row class="card-main">
                    <div class="majsoul-card" v-bind:style="cardBackground(card)" @click="selectAnswer(card)" v-for="card in answer_card"></div>
                </el-row>
                <el-row v-show="showAnswer" class="card-answer">
                    <div class="majsoul-answer" v-for="answer in baseData.answers">
                        <div v-bind:style="cardBackground(answer.keyCard)" class="majsoul-card"></div>
                        {{answer.keyDesc}}
                    </div>
                </el-row>
            </el-card>
            <!--上传区域-->
            <el-card v-show="showUpload" class="box-card upload">
                <el-row>
                    <h1 ref="uploadTitle">请组成模切问答题目</h1>
                </el-row>
                <!--选牌区-->
                <el-row v-show="showUploadSelected" class="majsoul-all-card">
                    <div class="majsoul-card" v-bind:style="cardBackground(card)" @click="selectUpload(card)" v-for="card in Array.from(new Set(upload_allCard))"></div>
                </el-row>
                <el-row v-show="showUploadSelected" class="majsoul-selected-card">
                    <div class="majsoul-card" v-bind:style="cardBackground(card)" @click="removeUpload(card)" v-for="card in upload_selectedCard"></div>
                </el-row>
                <!--切牌作答区-->
                <el-row v-show="showUploadAnswer">
                    <el-row>
                        <div class="majsoul-card" v-bind:style="cardBackground(card)" @click="qieUpload(card)" v-for="card in upload_selectedCard"></div>
                    </el-row>
                    <div style="height: 150px;display: inline-table;">
                        <div class="majsoul-card-key" v-model="uploadSelectKey" v-bind:style="cardBackground(uploadSelectKey)"></div>
                    </div>
                    <div>
                        <el-input type="textarea" rows="8" placeholder="为什么这样切" v-model="uploadAnswer" maxlength="300" show-word-limit></el-input>
                    </div>
                </el-row>
                <el-row v-show="showUploadSelected" class="upload-button">
                    <el-button type="primary" @click="upload_next">下一步</el-button>
                </el-row>
                <el-row v-show="showUploadAnswer" class="upload-button">
                    <el-button type="primary" @click="upload_first">上一步</el-button>
                    <el-button type="primary" @click="upload_start">完成</el-button>
                </el-row>
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
        width: 685px;
        height: 600px;
    }

    .upload {
        text-align: center;
        width: 685px;
        height: 600px;
        background: darkgray;
    }

    .upload-button{
        margin-top: 10px;
    }

    .majsoul-card-key {
        cursor: pointer;
        width: 41px;
        height: 65px;
    }

    .majsoul-card {
        cursor: pointer;
        float: left;
        margin-bottom: 10px;
        margin-right: 5px;
        width: 41px;
        height: 65px;
    }

    .majsoul-card:hover {
        margin-top: -8px;
    }

    .majsoul-all-card {

    }

    .majsoul-selected-card {

        margin-top: 50px;
    }
</style>

<script>
    export default {
        data() {
            return {
                baseData: {}, //从服务端获取的题目
                showStart: true, //展示开始界面
                showMain: false, //展示题目主界面
                showUpload: false, //展示上传界面
                showAnswer: false, //展示答案界面
                showUploadSelected: true, // 展示上传-选牌区
                showUploadAnswer: false, // 展示上传-切牌作答区
                answer_card: [], // 答题时的麻将牌
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
                upload_selectedCard: [],  //上传题目当前已选择的牌
                uploadSelectKey: "back", // 上传题目-切牌key
                uploadAnswer: "" //上传题目-切牌答案
            };
        },
        methods: {
            // TODO 牌型判断，数量，是否胡牌
            // 开始答题
            startChong: function () {
                const _this = this;
                _this.axios.get(_this.$globalConfig.DEFAULT_API_URL + "/majsoul/get")
                    .then(function (response) {
                        _this.baseData = response.content;
                        if (_this.baseData == null || _this.baseData === "") {
                            _this.$notify.error({
                                title: '错误',
                                message: '当前题库没有题目'
                            });
                            return;
                        }
                        const tempCards = _this.baseData.card.split("");
                        for (let i = 0; i < tempCards.length; i = i + 2) {
                            _this.answer_card.push(tempCards[i] + tempCards[i + 1]);
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
                // 判断是否已经14张牌了
                if (_this.upload_selectedCard.length >= 14) {
                    return;
                }
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
            },
            // 麻将背景
            cardBackground: function (card) {
                const imgUrl = this.$globalConfig.DEFAULT_OSS_URL_MAJSOUL + card + this.$globalConfig.DEFAULT_OSS_SUFFIX + "?x-oss-process=image/resize,w_41,h_65";
                return {
                    "background": "url(" + imgUrl + ")"
                }
            },
            // 上传-回到第一步
            upload_first: function(){
                const _this = this;
                _this.showUploadSelected = true;
                _this.showUploadAnswer = false;
                _this.uploadSelectKey = "back";
            },
            // 上传-下一步选择模切的牌及答案
            upload_next: function () {
                const _this = this;
                // 先判断是否14张牌
                if(_this.upload_selectedCard.length < 14){
                    _this.$message.error("麻将牌不够哦");
                    return;
                }

                _this.$refs.uploadTitle.innerHTML = "请选择切出的牌及为什么这样切";
                _this.showUploadSelected = false;
                _this.showUploadAnswer = true;
            },
            // 上传-选择所切的牌
            qieUpload: function (card) {
                this.uploadSelectKey = card;
            },
            // 上传-开始上传
            upload_start: function () {
                const _this = this;
                if(_this.uploadAnswer === ""){
                    _this.$message.error("请说明为什么这样切牌哦");
                    return;
                }
                // TODO 其他参数校验
                const param = {
                    card: _this.upload_selectedCard.join(""),
                    type: 1, // TODO 暂时只有简易牌谱
                    answers: [{
                        keyCard: _this.uploadSelectKey,
                        keyDesc: _this.uploadAnswer
                    }]
                };
                _this.axios.post(_this.$globalConfig.DEFAULT_API_URL + "/majsoul/upload", param)
                    .then(function (response) {
                        if(response.code === 200){
                            _this.showStart = true;
                            _this.showUpload = false;
                            _this.showMain = false;
                            // 上传区回到默认
                            _this.upload_allCard = _this.upload_allCard.concat(_this.upload_selectedCard);
                            _this.upload_allCard.sort(_this.majsoulSort);
                            _this.upload_selectedCard = [];
                            _this.showUploadSelected = true;
                            _this.showUploadAnswer = false;
                            _this.uploadSelectKey = "back";
                            _this.uploadAnswer = "";
                        }else {
                            _this.$message.error(response.message);
                        }
                    });
            }
        },
        created: function () {
            const _this = this;

        }
    };
</script>