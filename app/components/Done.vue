<template>
    <workitems v-bind:type="'done'" v-bind:cols="cols" v-bind:formName="formName"
               v-bind:showPara="showPara"></workitems>
</template>

<script>

import Workitems from './Workitems'

export default {
    name: "WillDo",
    props: ['cols', 'formName', 'showPara'],
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
