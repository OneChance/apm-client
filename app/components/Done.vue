<template>
    <workitems v-bind:type="'done'"></workitems>
</template>

<script>

import Workitems from './Workitems'

export default {
    name: "WillDo",
    created: function () {

    },
    mounted() {

    },
    data: function () {
        return {}
    },
    methods: {},
    components: {
        Workitems
    }
}
</script>

<style scoped>

</style>
