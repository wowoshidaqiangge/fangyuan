<template>
    <div class="maintenance">
        <div class="top">
            <el-form :model="form1" :rules="rules" ref="form1" class="topform">
                <el-form-item label="设备名称" :label-width="formLabelWidth1" class="formitem formitem1" prop="deviceId">
                    <el-select v-model="form1.deviceId" placeholder="请选择" class="elwith">
                        <el-option v-for="item in rolelist" :key="item.id" :label="item.name" :value="item.id">
                            {{ item.name }}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="维保状态" :label-width="formLabelWidth1" class="formitem formitem1" prop="state">
                    <el-select v-model="form1.state" placeholder="请选择" class="elwith">
                        <el-option v-for="item in rolelist" :key="item.id" :label="item.name" :value="item.id">
                            {{ item.name }}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="formitem formitem1">
                    <el-button type="add" icon="el-icon-search">搜索</el-button>
                    <!-- <el-button type="add" icon="el-icon-search">重置</el-button> -->
                </el-form-item>
                <el-form-item class="formitem formitem1">
                    <el-button type="add" icon="el-icon-circle-plus-outline" @click="add" class="addinfo">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="bot">
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column v-for="(item, index) in columnlist" :key="index" :prop="item.prop" :label="item.label" align="center">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="success" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">修改</el-button>

                        <el-button type="info" plain icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div class="page">
                <el-pagination
                    :background="true"
                    :current-page.sync="pagesize"
                    @current-change="handleCurrentChange"
                    layout="total, prev, pager, next"
                    :total="totals"
                >
                </el-pagination>
            </div>
        </div>
        <Mainmodal
            :dialogFormVisible="dialogFormVisible"
            :deptlist="deptlist"
            :rolelist="rolelist"
            :isedit="isedit"
            ref="mainmodal"
            @close="close"
            :tit="tit"
        />
    </div>
</template>

<script>
import { planPage, maintaindelete, maintainStateList, deviceList } from 'api/index';
import Mainmodal from './mainModal';
export default {
    name: 'maintenance',
    components: {
        Mainmodal
    },
    data() {
        return {
            dialogFormVisible: false,
            tit: '',
            page: {
                current: 1,
                size: 10
            },
            planList: [],
            value: '',
            isedit: false,
            tableData: [],
            deptlist: [],
            rolelist: [],
            pagesize: 1,
            formLabelWidth1: '80px',
            form1: {
                deviceId: '',
                state: ''
            },
            totals: 0,
            columnlist: [
                { prop: 'index', label: '序号' },
                { prop: 'deviceName', label: '设备名称' },
                { prop: 'maintenanceState', label: '维保状态' },
                { prop: 'planTime', label: '预计时间' },
                { prop: 'executeUser', label: '执行人' },
                { prop: 'createTime', label: '创建时间' }
            ],
            rules: {}
        };
    },
    created() {
        this.getplanPage();
        this.getdeviceList();
        this.getmaintainStateList();
    },
    methods: {
        getmaintainStateList() {
            maintainStateList().then(res => {
                if (res.code === '0') {
                    this.deptlist = res.data;
                }
            });
        },
        getdeviceList() {
            deviceList().then(res => {
                if (res.code === '0') {
                    this.rolelist = res.data;
                }
            });
        },
        handleEdit(h, m) {
            this.tit = '编辑用户';
            this.isedit = true;
            this.$refs.mainmodal.getmaintainget({ id: m.id });
            this.dialogFormVisible = true;
        },
        handleDelete(h, m) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    maintaindelete(m).then(res => {
                        if (res.code === '0') {
                            this.$message.success('删除成功');
                            this.init();
                            this.getplanPage();
                        }
                    });
                })
                .catch(() => {});
        },
        add() {
            this.tit = '新增';
            this.isedit = false;
            this.dialogFormVisible = true;
        },
        handleCurrentChange(e) {
            this.page.current = e;
            this.getplanPage();
        },
        close(h) {
            this.dialogFormVisible = false;
            if (h === '0') {
                this.getplanPage();
            }
        },
        init() {
            this.page = { current: 1, size: 10 };
        },
        getplanPage() {
            planPage(this.page).then(res => {
                if (res.code === '0') {
                    res.data.records.map((item, index) => {
                        item.index = index + 1;
                    });
                    this.tableData = res.data.records;
                    this.pagesize = parseInt(res.data.current);
                    this.totals = parseInt(res.data.total);
                }
            });
        }
    }
};
</script>

<style lang="less">
.maintenance {
    .top {
        height: 50px;
        margin-top: 12px;
        .mr10 {
            padding-left: 2%;
            width: 10%;
        }
        .addinfo {
            float: right;
            margin-right: 10px;
        }
        .topform {
            display: flex;
            .el-form-item {
                flex: 1;
            }
            .el-select {
                width: calc(100% - 80px);
            }
        }
    }
    .bot {
        height: calc(100% - 45px);
    }
    .elinput {
        width: 20%;
        margin: 0 2% 0 5px;
    }
    .page {
        margin: 10px 0;
        float: right;
    }
    .el-pager li.active {
        background-color: #409baf !important;
        color: #fff;
    }
}
</style>
