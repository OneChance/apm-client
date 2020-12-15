<template>
    <table class="form-table">
        <tr>
            <th style="width:40%">资料清单</th>
            <th>数量</th>
            <th style="width:45%">资料要求</th>
        </tr>
        <tr v-for="type of types">
            <th>{{ type.name }}</th>
            <td style="text-align: center;">{{ type.fileNum }}</td>
            <td>{{ type.description }}</td>
        </tr>
    </table>
</template>

<script>

import MaterialFile from "../script/server/materialFile"

export default {
    name: "FilesInfo",
    props: ['files'],
    created: function () {

    },
    watch: {
        files: function (files) {
            if (files.length > 0) {
                if (this.types.length === 0) {
                    MaterialFile.getMaterialTypes().then(res => {
                        this.types = res.list
                        this.fillNum(this.types, files)
                    })
                } else {
                    this.fillNum(this.types, files)
                }
            }
        }
    },
    mounted() {

    },
    data: function () {
        return {
            types: []
        }
    },
    methods: {
        fillNum(types, files) {
            files.forEach(file => {
                let type = types.filter(t => t.id === file.mId)[0]
                if (type) {
                    type.fileNum = file.mFiles.length === 0 ? '' : file.mFiles.length
                }
            })
        }
    },
    components: {}
}
</script>

<style scoped>

</style>
