<template>
    <div>
        <el-table
            ref='table'
            :data="tableConfig.data"
            border
            :height="tableConfig.height"
            stripe
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
                        <el-popover trigger="hover" placement="top"
                                    @show="col.popShow(scope.row,getDescription)">
                            <el-steps :active="getIndex(scope.row[col.prop])" finish-status="success"
                                      align-center class="steps">
                                <el-step v-for="step in showSteps" :key="step.title" :title="step.title"
                                         :description="step.description"></el-step>
                            </el-steps>
                            <div slot="reference" class="name-wrapper">
                                {{ getProp(scope.row, col.prop) }}
                            </div>
                        </el-popover>
                    </vif>
                    <vif v-else-if="col.tag"><!--tag标签-->
                        <el-tag :type="col.tagType(scope.row[col.prop])" :size="col.tagSize">
                            {{ colValue(col, getProp(scope.row, col.prop)) }}
                        </el-tag>
                    </vif>
                    <vif v-else>
                        {{ colValue(col, getProp(scope.row, col.prop)) }}
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
            showSteps: []
        }
    },
    props: ['tableConfig'],
    watch: {},
    methods: {
        getDescription(descriptions) {
            this.showSteps.forEach(step => {
                step.description = descriptions.get(step.title)
            })
        },
        getProp(row, prop) {
            if (prop.indexOf('.') !== -1) {
                let value = row
                prop.split('.').forEach(p => {
                    if (value) {
                        value = value[p]
                    }
                })
                return value
            } else {
                return row[prop]
            }
        },
        colValue(col, value) {
            if (col.formatter) {
                return col.formatter(value)
            }
            return value
        },
        getIndex(value) {
            let step = this.tableConfig.steps.filter(s => s.label === value)[0]
            return step ? step.index : this.tableConfig.steps[this.tableConfig.steps.length - 1].index + 1
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

        if (this.tableConfig.steps) {
            this.tableConfig.steps.forEach(s => {
                if (!this.showSteps.find(step => step.title === s.step)) {
                    this.showSteps.push({
                        title: s.step,
                        description: ''
                    })
                }
            })
        }
    },
}
</script>

<style scoped>


</style>
