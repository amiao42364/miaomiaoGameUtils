<template>
    <el-container style="height: 100%; background: #DCDFE6">
        <el-header style="height: auto;">
            <h1>请输入需要的材料及已拥有的数量，点击过滤去除不相关及数量足够的物品</h1>
        </el-header>
        <el-main style="margin-top: 10px">

        </el-main>
    </el-container>
</template>

<style>


</style>

<script>
    export default {
        data() {
            return {
                levelData: {}
            };
        },
        methods: {

        },
        created() {
            const _this = this;
            _this.axios.get(_this.$globalConfig.DEFAULT_API_URL + "/json/ark?type=level")
                .then(function (response) {
                    _this.levelData = response.content;
                    console.log(_this.levelData);
                });
        }
    };
</script>
