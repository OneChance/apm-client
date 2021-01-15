<template>
    <el-image
        class="img-preview"
        :src="$route.query.url"
        fit="contain"
        :preview-src-list="srcList"
    ></el-image>
</template>

<script>

export default {
    name: "Image",
    mounted() {
    },
    data: function () {
        return {
            srcList: [this.$route.query.url]
        }
    },
    methods: {},
    components: {}
}
</script>

<style scoped>

.img-preview {
    height: 99.9vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
