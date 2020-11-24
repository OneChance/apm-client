<template>
    <div>
        <el-table
            :data="tableConfig.data"
            border
            stripe
            style="width: 100%"
            :max-height="maxHeight"
            @selection-change="tableConfig.checkBoxChange">
            <el-table-column v-if="tableConfig.checkable"
                             type="selection"
                             width="55">
            </el-table-column>
            <el-table-column
                label="#"
                type="index"
                fixed
                width="50"></el-table-column>
            <el-table-column v-for="col in tableConfig.cols" :prop="col.prop" :label="col.label" :key="col.prop"
                             :fixed="col.fixed"
                             :formatter="col.formatter" :sortable="col.sortable"
                             :width="col.width">
                <template slot-scope="scope">
                    <vif v-if="col.popProgress"><!--鼠标放上去显示进度条-->
                        <el-popover trigger="hover" placement="top" width="1000">
                            <el-steps :active="getIndex(scope.row[col.prop])" finish-status="success">
                                <el-step v-for="step in showSteps" :key="step" :title="step"></el-step>
                            </el-steps>
                            <div slot="reference" class="name-wrapper">
                                {{ scope.row[col.prop] }}
                            </div>
                        </el-popover>
                    </vif>
                    <vif v-else-if="col.tag"><!--tag标签-->
                        <el-tag :type="col.tagType(scope.row[col.prop])" :size="col.tagSize">
                            {{ colValue(col, scope.row[col.prop]) }}
                        </el-tag>
                    </vif>
                    <vif v-else>
                        {{ colValue(col, scope.row[col.prop]) }}
                    </vif>
                </template>
            </el-table-column>
            <el-table-column
                prop="roleOper"
                fixed="right"
                :width="tableConfig.operWidth"
                label="操作">
                <template slot-scope="scope">
                    <el-tooltip v-for="o in tableConfig.oper" class="item" effect="dark" :content="o.tip.content"
                                :key="o.tip.content"
                                :placement="o.tip.placement">
                        <i :class="o.class"
                           @click="click(scope.row,o.event,o.check)"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-if="tableConfig.page"
                       class="page-nav"
                       background
                       :small="small"
                       :current-page.sync="tableConfig.currentPage"
                       layout="prev, pager, next"
                       @current-change="handleCurrentChange"
                       :total="tableConfig.total">
        </el-pagination>

        <el-dialog
            title="提示"
            :visible.sync="deleteConfirm"
            width="30%"
            :close-on-click-modal="false">
            <span>确认删除？</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="deleteConfirm = false">取 消</el-button>
            <el-button type="primary" @click="deleteConfirm = false;toDelete()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import App from '../script/app.js'
import Config from "../script/config";

export default {
    data: function () {
        return {
            small: false,
            deleteConfirm: false,
            deleteOper: {event: {}, row: {}},
            steps: [
                {label: '送审保存', step: '送审', index: 0},
                {label: '送审打回', step: '送审', index: 0},
                {label: '处理争议', step: '送审', index: 0},
                {label: '审计立项', step: '审计立项', index: 1},
                {label: '审计分配', step: '审计分配', index: 2},
                {label: '分配审核', step: '分配审核', index: 3},
                {label: '勘察准备', step: '勘察准备', index: 4},
                {label: '现场勘察', step: '现场勘察', index: 5},
                {label: '争议处理', step: '争议处理', index: 6},
                {label: '初审', step: '初审', index: 7},
                {label: '复审', step: '复审', index: 8},
                {label: '完成', step: '完成', index: 9},
                {label: '归档', step: '归档', index: 10},
            ],
            showSteps: []
        }
    },
    props: ['tableConfig'],
    watch: {},
    methods: {
        colValue(col, value) {
            if (col.formatter) {
                return col.formatter(value)
            }
            return value
        },
        getIndex(value) {
            let step = this.steps.filter(s => s.label === value)[0]
            return step ? step.index : 11
        },
        click(row, event, check) {
            if (check) {
                this.deleteConfirm = true
                this.deleteOper.event = event
                this.deleteOper.row = row
            } else {
                event(row)
            }
        },
        toDelete() {
            this.deleteOper.event(this.deleteOper.row);
        },
        handleCurrentChange: function (val) {
            this.tableConfig.pageMethod(val)
        },
        elementSize: function (width) {
            this.small = width <= Config.size.pageNavSmallSize
        },
    },
    mounted: function () {
        let comp = this
        comp.elementSize(this.$el.clientWidth)
        App.vueG.$on('windowResize', (width) => {
            comp.elementSize(width)
        })

        this.showSteps = new Set()
        this.steps.forEach(s => {
            this.showSteps.add(s.step)
        })
    },
}
</script>

<style scoped>


</style>
