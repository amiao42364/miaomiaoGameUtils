<template>
    <el-container style="background: #DCDFE6;">
        <el-main>
            <h1>
                功能开发中……
            </h1>
            <h1>
                当前登录用户为{{username}}
            </h1>
        </el-main>
    </el-container>
</template>
<script>
    export default {
        data() {
            return {
                username: ""
            };
        },
        methods: {

        },
        created: function() {
            const _this = this;
            _this.axios.get(_this.$globalConfig.DEFAULT_API_URL + "/user")
                .then(function (response) {
                    _this.username = response.content["nickName"];
                });
        }
    };
</script>