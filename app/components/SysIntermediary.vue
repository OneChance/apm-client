<template>
    <user-component v-bind:type="'intermediary'"></user-component>
</template>

<script>

import UserComponent from "./UserComponent";

export default {
    name: "SysIntermediary",
    data: function () {
        return {}
    },
    mounted: function () {

    },
    methods: {},
    components: {UserComponent}
}
</script>

<style scoped>

</style>