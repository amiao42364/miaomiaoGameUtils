<template>
    <el-container style="height: 100%">
        <el-main class="moqie-box-parent">
            <!--开始区域-->
            <div v-show="showStart" class="majsoul-start">
                <el-row style="margin-top: 20px;">
                    <el-button @click="startChong" size="large" type="danger">开始放铳</el-button>
                </el-row>
                <el-row style="margin-top: 20px;">
                    <el-button @click="startUpload" size="large" type="success">上传牌谱</el-button>
                </el-row>
                <el-row style="text-align: left;margin-left: 15px;">
                    <div>内测版：</div>
                    <div>1、会有很多bug</div>
                    <div>2、点赞、个人信息等功能暂未实现，因为天气太热了</div>
                    <div>3、目前只考虑纯牌效，场况等功能暂未实现，因为天气太热了</div>
                    <div>4、目前上传暂时需要注册下</div>
                </el-row>
            </div>
            <!--答题区域-->
            <div v-show="showMain" class="majsoul-main">
                <el-row class="majsoul-card-main">
                    <div class="majsoul-card" v-bind:style="cardBackground(card)" @click="selectAnswer(card)" v-for="card in answer_card"></div>
                </el-row>
                <el-row v-show="showAnswer" class="majsoul-card-answer">
                    <div style="text-align: center;">
                        {{answer_judge}}
                    </div>
                    <div class="majsoul-answer" v-for="answer in baseData.answers">
                        <div style="margin-left: 5px;">
                            <div v-bind:style="cardBackground(answer.keyCard)" class="majsoul-card-key"></div>
                        </div>
                        <div>
                            {{answer.keyDesc}}
                        </div>
                        <div style="right: 20px;position: absolute;">
                            <el-tooltip class="item" effect="dark" content="赞同" placement="right">
                                <div @click="agree(answer.id)" style="cursor: pointer; height: 35px;">
                                    <img style="width: 35px;" src="icon-agree.png" alt="赞同">
                                    <div style="float: right; line-height: 35px;">{{answer.up}}</div>
                                </div>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="反对" placement="right">
                                <div @click="oppose(answer.id)" style="cursor: pointer; height: 35px;">
                                    <img style="width: 35px;" src="icon-oppose.png" alt="反对">
                                    <div style="float: right; line-height: 35px;">{{answer.down}}</div>
                                </div>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="upload-single" @click="uploadSingle">
                        <div style="font-size: 40px;"><i class="el-icon-plus"></i></div>
                        <div>答案不对？点击上传自己的答案</div>
                    </div>
                </el-row>
                <el-row class="button-bottom">
                    <el-button @click="returnMain" size="large" type="success">返回</el-button>
                    <el-button @click="startChong" size="large" type="danger">下一题</el-button>
                </el-row>
            </div>
            <!--上传区域-->
            <div v-show="showUpload" class="majsoul-upload">
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
                    <el-row style="display: flex; flex-wrap: wrap; margin-left: 15px;">
                        <div class="majsoul-card" v-bind:style="cardBackground(card)" @click="qieUpload(card)" v-for="card in upload_selectedCard"></div>
                    </el-row>
                    <div style="height: 75px;display: inline-table;">
                        <div class="majsoul-card-key" v-model="uploadSelectKey" v-bind:style="cardBackground(uploadSelectKey)"></div>
                    </div>
                    <div style="margin-left: 15px; margin-right: 15px;">
                        <el-input type="textarea" rows="14" placeholder="为什么这样切" v-model="uploadAnswer" maxlength="300" show-word-limit></el-input>
                    </div>
                </el-row>
                <!--单个答案切牌作答区-->
                <el-row v-show="showUploadSingle">
                    <el-row style="display: flex; flex-wrap: wrap; margin-left: 15px;">
                        <div class="majsoul-card" v-bind:style="cardBackground(card)" @click="qieUpload(card)" v-for="card in upload_selectedCard"></div>
                    </el-row>
                    <div style="height: 75px;display: inline-table;">
                        <div class="majsoul-card-key" v-model="uploadSelectKey" v-bind:style="cardBackground(uploadSelectKey)"></div>
                    </div>
                    <div style="margin-left: 15px; margin-right: 15px;">
                        <el-input type="textarea" rows="14" placeholder="为什么这样切" v-model="uploadAnswer" maxlength="300" show-word-limit></el-input>
                    </div>
                </el-row>
                <el-row class="button-bottom" v-show="showUploadSelected">
                    <el-button @click="returnMain" size="large" type="success">返回</el-button>
                    <el-button @click="upload_next" size="large" type="primary" >下一步</el-button>
                </el-row>
                <el-row class="button-bottom" v-show="showUploadAnswer">
                    <el-button size="large" @click="upload_first" type="primary">上一步</el-button>
                    <el-button size="large" @click="upload_start" type="primary">完成</el-button>
                </el-row>
                <el-row class="button-bottom" v-show="showUploadSingle">
                    <el-button size="large" @click="returnAnswer" type="primary">返回</el-button>
                    <el-button size="large" @click="upload_start" type="primary">完成</el-button>
                </el-row>
            </div>
        </el-main>
    </el-container>
</template>

<style>
    body {
        background: url("https://majsoul.oss-cn-shanghai.aliyuncs.com/background_majsoul.jpg");
    }

    .moqie-box-parent {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .moqie-box-parent .majsoul-start {
        width: 390px;
        height: 255px;
        background-color: rgba(144,147,153, 0.7);
        text-align: center;
    }

    .moqie-box-parent .majsoul-main {
        width: 685px;
        height: 600px;
        background-color: rgba(144,147,153, 0.7);
        text-align: center;
        position: relative;
    }

    .moqie-box-parent .majsoul-upload {
        text-align: center;
        width: 685px;
        height: 600px;
        background-color: rgba(144,147,153, 0.7);
        position: relative;
    }

    .moqie-box-parent .majsoul-card-main {
        margin-top: 15px;
        margin-left: 15px;
        display: flex;
        flex-wrap: wrap;
    }

    .moqie-box-parent .majsoul-card-answer {
        height: 445px;
        position: relative;
        overflow-y: auto;
    }

    .majsoul-answer {
        height: 75px;
        display: flex;
        margin-top: 10px;
        margin-left: 15px;
        margin-right: 15px;
        border:1px solid #000;
    }

    .button-bottom {
        position: absolute;
        bottom: 15px;
        left: 0;
        right: 0;
    }

    .upload-single {
        margin-top: 15px;
        height: 85px;
        border:2px dashed #000;
        cursor: pointer;
        margin-left: 15px;
        margin-right: 15px;
    }

    .upload-single:hover{
        background-color: rgba(144,147,153, 0.7);;
    }

    .majsoul-card-key {
        cursor: pointer;
        width: 41px;
        height: 65px;
        margin: 5px;
    }

    .majsoul-card {
        cursor: pointer;
        margin-bottom: 10px;
        margin-right: 5px;
        width: 41px;
        height: 65px;
    }

    .majsoul-card:hover {
        margin-top: -8px;
    }

    .majsoul-all-card {
        margin-left: 15px;
        display: flex;
        flex-wrap: wrap;
    }

    .majsoul-selected-card {
        margin-left: 15px;
        margin-top: 50px;
        display: flex;
        flex-wrap: wrap;
    }

    .el-textarea__inner{
        background-color: rgba(0,0,0,.1);
        color: #f56c6c;
    }
    .el-textarea .el-input__count{
        background-color: rgba(0,0,0,0.1);
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
                showUploadSingle: false, // 展示上传单个答案-切牌作答区
                answer_card: [], // 答题时的麻将牌
                answer_judge: "", // 答题-是否正确
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
                        // 初始化
                        _this.answer_card = [];
                        _this.showAnswer = false;

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
            returnMain: function() {
                const _this = this;
                _this.showStart = true;
                _this.showMain = false;
                _this.showUpload = false;
            },
            // 答题-选择答案
            selectAnswer: function (value) {
                const _this = this;
                let answers = _this.baseData.answers;
                let judge = false;
                answers.forEach(function (answer) {
                   if(value === answer.keyCard){
                       judge = true;
                       return true;
                   }
                });
                if(judge){
                    _this.answer_judge = "正确";
                }else {
                    _this.answer_judge = "错误";
                }
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
                if(_this.uploadSelectKey === "back"){
                    _this.$message.error("请选择切哪张牌哦");
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
                            _this.$refs.uploadTitle.innerHTML = "请组成模切问答题目";
                            _this.uploadSelectKey = "back";
                            _this.uploadAnswer = "";
                        }else {
                            _this.$message.error(response.message);
                        }
                    });
            },
            // 单个答案上传
            uploadSingle: function () {
                const _this = this;
                _this.showStart = false;
                _this.showUpload = true;
                _this.showMain = false;

                _this.upload_selectedCard = _this.answer_card;
                console.log( _this.upload_selectedCard );
                _this.$refs.uploadTitle.innerHTML = "请选择切出的牌及为什么这样切";
                _this.showUploadSelected = false;
                _this.showUploadAnswer = false;
                _this.showUploadSingle = true;
            },
            // 返回答题区
            returnAnswer: function () {
                const _this = this;
                _this.showStart = false;
                _this.showUpload = false;
                _this.showMain = true;
                // 初始化上传区
                _this.upload_allCard = _this.upload_allCard.concat(_this.upload_selectedCard);
                _this.upload_allCard.sort(_this.majsoulSort);
                _this.upload_selectedCard = [];
                _this.showUploadSelected = true;
                _this.showUploadAnswer = false;
                _this.showUploadSingle = false;
                _this.uploadSelectKey = "back";
                _this.uploadAnswer = "";
                _this.$refs.uploadTitle.innerHTML = "请组成模切问答题目";
            },
            // 赞同
            agree: function (id) {
            },
            // 反对
            oppose: function (id) {
            },
            sendAgreeOppose: function (id, type, value) {

            }
        },
        created: function () {
            const _this = this;

        }
    };
</script>