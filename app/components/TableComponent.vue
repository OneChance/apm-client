<template>
    <div>
        <el-table
                :data="tableConfig.data"
                border
                style="width: 100%"
                :max-height="maxHeight">
            <el-table-column v-for="col in tableConfig.cols" :prop="col.prop" :label="col.label" :key="col.prop"
                             :formatter="col.formatter"
                             :width="col.width"></el-table-column>
            <el-table-column
                    prop="roleOper"
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
                       layout="prev, pager, next"
                       @current-change="handleCurrentChange"
                       :total="100">
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
    import Size from "../script/server/size";

    export default {
        data: function () {
            return {
                small: false,
                maxHeight: 620,
                deleteConfirm: false,
                deleteOper: {event: {}, row: {}}
            }
        },
        props: ['tableConfig'],
        watch: {},
        methods: {
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
                this.small = width <= Size.pageNavSmallSize
            }
        },
        mounted: function () {
            let comp = this
            comp.elementSize(document.body.clientWidth)
            App.hub.$on('windowResize', (width) => {
                comp.elementSize(width)
            })
        },
    }
</script>

<style scoped>


</style>
