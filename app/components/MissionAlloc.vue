<template>
    <div>
        <audit-component v-bind:step="'missionAlloc'" id="listComp"
                         v-bind:opers="opers"
                         v-bind:customTableConfig="customTableConfig">
        </audit-component>
        <alloc-form v-bind:visible="missionAllocVisible"
                    v-bind:checks="checks"
                    v-bind:listComp="listComp">
        </alloc-form>
    </div>
</template>
<script>

import AuditComponent from "./AuditComponent";
import AllocForm from "./AllocForm"

export default {
    name: "MissionAlloc",
    created: function () {

    },
    mounted() {
        this.listComp = $("#listComp")[0].__vue__
    },
    data: function () {
        return {
            missionAllocVisible: false,
            opers: [
                {name: '分配', color: 'success', event: this.batchAlloc}
            ],
            customTableConfig: {
                checkable: true,
                oper: [
                    {
                        class: 'fa fa-pencil-square-o fa-lg click-fa primary-fa',
                        tip: {content: '查看', placement: 'top'},
                        event: 'edit',
                    },
                ]
            },
            checks: [],
            listComp: {}
        }
    },
    methods: {
        batchAlloc(checks) {
            this.missionAllocVisible = false
            this.missionAllocVisible = true
            this.checks = checks
        },
    },
    components: {AuditComponent, AllocForm}
}
</script>

<style scoped>

</style>