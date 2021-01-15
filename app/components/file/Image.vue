<template>
    <el-image
        class="img-preview"
        :src="$route.query.url"
        fit="contain"
        :preview-src-list="srcList">
        <div slot="placeholder" class="image-slot">
            图片加载中<span class="dot">...</span>
        </div>
    </el-image>
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
