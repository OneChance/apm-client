<template>
    <div class="back"
         v-loading="loading"
         element-loading-text="文件加载中"
         element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="tools">
            <el-button class='tool-btn' type="primary" icon="el-icon-back" circle @click="prePage"></el-button>
            <el-button class='tool-btn' type="primary" icon="el-icon-right" circle @click="nextPage"></el-button>
            <p class="pages">{{ pageNum }}/{{ pageTotalNum }}</p>
            <el-button class='tool-btn' type="primary" icon="el-icon-refresh-right" circle @click="clock"></el-button>
            <el-button class='tool-btn' type="primary" icon="el-icon-refresh-left" circle
                       @click="counterClock"></el-button>
        </div>
        <pdf ref="pdf"
             :src="$route.query.url"
             :page="pageNum"
             :rotate="pageRotate"
             @progress="loadedRatio = $event"
             @page-loaded="pageLoaded($event)"
             @num-pages="pageTotalNum=$event"
             @error="pdfError($event)"
             @link-clicked="page = $event">
        </pdf>
    </div>
</template>

<script>

import pdf from 'vue-pdf'

export default {
    name: "Pdf",
    mounted() {
    },
    data: function () {
        return {
            pageNum: 1,
            pageTotalNum: 1,
            pageRotate: 0,
            // 加载进度
            loadedRatio: 0,
            curPageNum: 0,
            loading: true
        }
    },
    methods: {
        prePage() {
            let page = this.pageNum
            page = page > 1 ? page - 1 : this.pageTotalNum
            this.pageNum = page
        },
        nextPage() {
            let page = this.pageNum
            page = page < this.pageTotalNum ? page + 1 : 1
            this.pageNum = page
        },
        clock() {
            this.pageRotate += 90
        },
        counterClock() {
            this.pageRotate -= 90
        },
        pageLoaded(e) {
            this.curPageNum = e
            this.loading = false
        },
        pdfError(error) {
            console.error(error)
        },
    },
    components: {pdf}
}
</script>

<style scoped>
.back {
    height: 100vh;
}

.tools {
    display: flex;
    align-items: center;
    justify-content: center;
}

.tool-btn {
    margin: 10px;
}

.pages {
    font-weight: bold;
}
</style>
