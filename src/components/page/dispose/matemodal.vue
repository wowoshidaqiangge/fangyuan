<template>
    <div class="matemodal">
        <el-dialog
            :title="tit"
            :destroy-on-close="isclose"
            :visible.sync="dialogFormVisible"
            width="50%"
            :before-close="beforclose"
            center
        >
            <el-row>
                <el-form :model="form" :rules="rules" ref="form">
                    <el-col :span="11">
                        <el-form-item
                            label="物料名称"
                            :label-width="formLabelWidth"
                            class="formitem formitem1"
                            prop="itemName"
                        >
                            <el-input v-model="form.itemName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item
                            label="物料编码"
                            :label-width="formLabelWidth"
                            class="formitem formitem1"
                            prop="itemCode"
                        >
                            <el-input v-model="form.itemCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item
                            label="规格型号"
                            :label-width="formLabelWidth"
                            class="formitem formitem1"
                            prop="model"
                        >
                            <el-input v-model="form.model"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item
                            label="系列"
                            :label-width="formLabelWidth"
                            class="formitem formitem1"
                            prop="series"
                        >
                            <el-input v-model="form.series"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item
                            label="材质"
                            :label-width="formLabelWidth"
                            class="formitem formitem1"
                            prop="material"
                        >
                            <el-input v-model="form.material"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item
                            label="关联部门"
                            :label-width="formLabelWidth"
                            class="formitem formitem1"
                            prop="deptId"
                        >
                            <el-select v-model="form.deptId" placeholder="请选择">
                                <el-option
                                    v-for="item in rolelist"
                                    :key="item.deptId"
                                    :label="item.deptName"
                                    :value="item.deptId"
                                >{{item.deptName}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item
                            label="基本单位"
                            :label-width="formLabelWidth"
                            class="formitem formitem1"
                            prop="unit"
                        >
                            <el-select v-model="form.unit" placeholder="请选择">
                                <el-option
                                    v-for="item in deptlist"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >{{item.name}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="marksure('form')" :loading="sureload">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { producetaskadd, producetaskid, producetaskput, getProduceDeptList } from 'api/main';

export default {
    name: 'matemodal',

    props: {
        dialogFormVisible: {
            type: Boolean
        },
        tit: {
            type: String
        }
    },
    data() {
        return {
            isclose: true,
            sureload: false,
            deptlist: [
                { name: '个', id: '个' },
                { name: '只', id: '只' },
                { name: '件', id: '件' }
            ],
            rolelist: [],
            form: {
                itemName: '',
                itemCode: '',
                model: '',
                series: '',
                material: '',
                unit: '',
                deptId: ''
            },
            formLabelWidth: '90px',
            rules: {
                itemName: [{ required: true, message: '请输入物料名称', trigger: 'blur' }],
                itemCode: [{ required: true, message: '请输入物料编码', trigger: 'blur' }],
                model: [{ required: true, message: '请输入规格型号', trigger: 'blur' }],
                series: [{ required: true, message: '请输入系列', trigger: 'blur' }],
                material: [{ required: true, message: '请输入材质', trigger: 'blur' }],
                deptId: [{ required: true, message: '请选择关联部门', trigger: 'blur' }],
                unit: [{ required: true, message: '请选择基本单位', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.getProduceDeptList();
    },
    mounted() {},
    watch: {},
    methods: {
        //详情
        getproducetaskid(id) {
            producetaskid(id).then(res => {
                if (res.code === '0') {
                    //   res.data.deviceType = res.data.deviceType.toString()
                    this.form = res.data;
                }
            });
        },
        //车间
        getProduceDeptList() {
            getProduceDeptList().then(res => {
                if (res.code === '0') {
                    this.rolelist = res.data;
                }
            });
        },

        close(num) {
            this.init();
            this.$emit('close', num);
        },
        //初始化
        init() {
            this.form = {
                itemName: '',
                itemCode: '',
                model: '',
                series: '',
                material: '',
                unit: '',
                deptId: ''
            };
        },
        marksure(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    if (this.tit == '新增') {
                        producetaskadd(this.form).then(res => {
                            this.$message.success(res.msg);
                            this.close('0');
                        });
                    } else {
                        producetaskput(this.form).then(res => {
                            this.$message.success(res.msg);
                            this.close('0');
                        });
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        beforclose() {
            this.init();
            this.$emit('close', false);
        }
    }
};
</script>


<style lang='less'>
.matemodal {
    .el-dialog {
        border-radius: 5px;
    }
    .el-dialog__header {
        background-color: #409baf;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        .el-dialog__title {
            color: #fff;
            letter-spacing: 2px;
        }
        .el-dialog__headerbtn .el-dialog__close {
            color: #fff;
        }
    }
    .dialog-footer {
        text-align: end;
    }
    .el-form {
        display: flex;
        flex-wrap: wrap;
    }
    .el-select {
        width: 100%;
    }
    .el-col {
        margin-bottom: 20px;
    }
    // .formitem{
    //     width: 45%;

    //     margin-bottom: 40px;
    // }
    // .formitem1{
    //     margin-right: 5%;
    // }
}
</style>
