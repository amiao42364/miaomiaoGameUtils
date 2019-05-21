<template>
    <el-container style="height: 100%">
        <el-main class="login-box-parent">
            <el-card class="box-card login-box" v-show="showLogin">
                <el-form ref="loginForm" :model="loginForm" :rules="loginRules" size="mini">
                    <el-form-item prop="username">
                        <el-input v-model.trim="loginForm.username" placeholder="账号/手机/邮箱"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" v-model.trim="loginForm.password" placeholder="密码"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom: 0;">
                        <el-checkbox-group v-model="loginForm.rememberMe">
                            <el-checkbox label="在这台电脑上记住我" name="rememberMe"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item style="text-align: center;">
                        <el-button type="primary" @click="login()" :disabled="isDisabled">登录</el-button>
                        <el-button type="danger" @click="registerOpen()">注册</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card v-show=showRegister class="box-card register-box">
                <el-form ref="registerForm" :model="registerForm" :rules="registerRules" size="mini">
                    <el-form-item prop="username">
                        <el-input v-model.trim="registerForm.username" placeholder="账号"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" v-model.trim="registerForm.password" placeholder="密码"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item prop="passwordCheck">
                        <el-input type="password" v-model.trim="registerForm.passwordCheck" placeholder="请确认密码"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-tooltip placement="right">
                        <div slot="content">
                            1、请记住密码，因为没钱买短信和邮箱服务，所有不提供密码找回功能<br/>
                            2、最终解释权不存在的
                        </div>
                        <el-form-item style="margin-bottom: 0;" prop="statement">
                            <el-checkbox-group v-model="registerForm.statement">
                                <el-checkbox label="我已同意《喵喵用户协议》" name="statement"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tooltip>
                    <el-form-item style="text-align: center;">
                        <el-button type="primary" @click="register" :disabled="isDisabled">注册并登录</el-button>
                        <el-button type="primary" @click="returnLogin">返回登录</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-main>
    </el-container>
</template>

<style>
    .login-box-parent {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .login-box {
        width: 300px;
        height: 185px;
    }

    .register-box {
        width: 300px;
        height: 225px;
    }

</style>

<script>
    export default {
        data() {
            const validatePassCheck = (rule, value, callback) => {
                if (value !== this.registerForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                loginForm: {
                    username: "",
                    password: "",
                    rememberMe: false
                },
                registerForm: {
                    username: "",
                    password: "",
                    passwordCheck: "",
                    statement: []
                },
                showLogin: true,
                showRegister: false,
                isDisabled: false,
                loginRules: {
                    username: [
                        {required: true, message: '用户名不可为空', trigger: 'blur'},
                        {min: 2, max: 24, message: '长度在 2 到 24 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: "密码不可为空", trigger: "blur"},
                        {min: 6, max: 24, message: '长度在 6 到 24 个字符', trigger: 'blur'}
                    ]
                },
                registerRules: {
                    username: [
                        {required: true, message: '用户名不可为空', trigger: 'blur'},
                        {min: 2, max: 24, message: '长度在 2 到 24 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: "密码不可为空", trigger: "blur"},
                        {min: 6, max: 24, message: '长度在 6 到 24 个字符', trigger: 'blur'}
                    ],
                    passwordCheck: [
                        {required: true, message: "密码不可为空", trigger: "blur"},
                        {min: 6, max: 24, message: '长度在 6 到 24 个字符', trigger: 'blur'},
                        {validator: validatePassCheck, trigger: 'blur'}
                    ],
                    statement: [
                        {type: 'array', required: true, message: "必须同意", trigger: "change"}
                    ]
                }
            };
        },
        methods: {
            login() {
                const _this = this;
                // 防止按钮多次点击
                _this.isDisabled = true;
                setTimeout(function () {
                    _this.isDisabled = false;
                }, 500);

                _this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        _this.axios.post(this.$globalConfig.DEFAULT_API_URL + "/user/login", this.loginForm)
                            .then(function (response) {
                                _this.doResponse(response);
                            });
                    }
                });
            },
            registerOpen() {
                this.showLogin = false;
                this.showRegister = true;
            },
            register() {
                const _this = this;
                // 防止按钮多次点击
                _this.isDisabled = true;
                setTimeout(function () {
                    _this.isDisabled = false;
                }, 500);

                _this.$refs.registerForm.validate((valid) => {
                    if (valid) {
                        _this.axios.post(this.$globalConfig.DEFAULT_API_URL + "/user/register", this.registerForm)
                            .then(function (response) {
                                _this.doResponse(response);
                            });
                    }
                });
            },
            returnLogin: function(){
                this.showLogin = true;
                this.showRegister = false;
            },
            doResponse(response) {
                const _this = this;
                const token = response["content"];
                if (token == null || "" === token) {
                    _this.$notify.error({
                        title: '错误',
                        message: '登录失败'
                    });
                    return;
                }
                _this.$notify.success({
                    title: '成功',
                    message: '登录成功'
                });
                _this.$commonUtil.set(_this.$globalConfig.MIAOMIAO_TOKEN_PREFIX, token, _this.loginForm.rememberMe);
                _this.$router.push({
                    path: _this.$route.query.nextPath
                });
            }
        }
    };
</script>
