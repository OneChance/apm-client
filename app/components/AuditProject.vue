<template>
    <audit-component v-bind:step="'project'"></audit-component>
</template>

<script>

    import AuditComponent from "./AuditComponent";

    export default {
        name: "AuditProject",
        created: function () {

        },
        mounted() {
        },
        data: function () {
            return {}
        },
        methods: {},
        components: {AuditComponent}
    }
</script>

<style scoped>

</style>