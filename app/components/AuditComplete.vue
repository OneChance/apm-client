<template>
    <div class="card-content">
        <el-card class="box-card">
            <audit-note-form v-bind:visible="true"></audit-note-form>
        </el-card>
    </div>
</template>

<script>

import AuditNoteForm from './AuditNoteForm'

export default {
    name: "AuditComplete",
    created: function () {

    },
    data: function () {
        return {}
    },
    methods: {},
    components: {
        AuditNoteForm
    }
}
</script>

<style scoped>

</style>