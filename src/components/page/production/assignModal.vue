<template>
    <div class="assignmodal">
        <el-dialog :title="tit" :visible.sync="dialogFormVisible" :before-close="beforclose" center>
            <p class="modaltit1">工单信息：</p>
            <el-row>
                <el-form :model="form" ref="form">
                    <div class="modalcont">
                        <el-col :span="11">
                            <el-form-item label="工单号" :label-width="formLabelWidth" prop="taskNumber">
                                <el-input v-model="form.taskNumber" disabled autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="11">
                            <el-form-item label="产品名称" :label-width="formLabelWidth" prop="productName">
                                <el-input v-model="form.productName" disabled autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                     
                        <el-col :span="11">
                            <el-form-item label="规格型号" :label-width="formLabelWidth" prop="specificationModel">
                                <el-input v-model="form.specificationModel" disabled autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="计划产量" :label-width="formLabelWidth" prop="planYield">
                                <el-input v-model="form.planYield" disabled autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </div>
                    <!-- <el-col :span="24" class="upload-demo" v-if="tit !== '工单分解'">
                        <span style="line-height:32px;font-size: 18px;color: #324170;">工艺文件上传:</span>
                        <el-upload
                            :action="host"
                            :data="ossParams"
                            ref="updata"
                            :on-success="handleSuccess"
                            :before-upload="beforeUpload"
                            :limit="limit"
                            class="upload-demo1"
                            :on-remove="handleRemove"
                            :on-exceed="exceed"
                            :file-list="fileList"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                            
                        </el-upload>
                    </el-col> -->
                    <div v-if="tit !== '工单分解'">
                        <p style="line-height:32px;font-size: 18px;color: #324170;padding:10px 0">请选择派单的人员:</p>
                        <el-col :span="12">
                            <el-form-item label="部门" :label-width="formLabelWidth" prop="userId">
                                <el-cascader v-model="form.userId" :options="getuserList" :props="casprops" @change="handleChange">
                                </el-cascader>
                            </el-form-item>
                        </el-col>

                    </div>
                </el-form>

                <el-col :span="24" v-if="tit === '工单分解'">
                    <span>分解工单数:</span>
                    <el-input-number
                        v-model="num"
                        @change="handleChange"
                        :min="0"
                        :max="5"
                        style="margin:10px 0 20px 23px"
                    ></el-input-number>
                </el-col>

                <el-col :span="24" v-if="tit === '工单分解'">
                    <span style="line-height:32px">分工单计划产量:</span>
                    <div v-for="(item, index) in numlist" :key="index" style="width:10%;display:inline-block;margin-left:17px">
                        <el-input
                            v-model="item.value"
                            @change="
                                e => {
                                    changevalue(e, index);
                                }
                            "
                        ></el-input>
                    </div>
                </el-col>
            </el-row>

            <div slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="marksure('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { produceTaskPlanid, saveProduceTaskPlan, deviceList, userListByDept, produceTaskAssign } from 'api/index';
import { onenet } from 'api/onenet';
import moment from 'moment';
export default {
    name: 'assignmodal',

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
            limit: 1,
            host: 'http://thingcom-dianliuji.oss-cn-hangzhou.aliyuncs.com',
            ossParams: {
                OSSAccessKeyId: '',
                policy: '',
                signature: '',
                expire: '',
                key: '', // key后面有用，先默认设空字符串
                success_action_status: '200' // 默认200
            },
            fileList: [],
            form: {
                productName: '',
                productCode: '',
                specificationModel: '',
                planYield: '',
                taskNumber: '',
                planStartTime: '',
                planEndTime: '',
                yieldList: [],
                userId: '',
                technologyName: '',
                technology: ''
            },
            formLabelWidth: '80px',
            num: 0,
            numlist: [],
            value0: '',
            value1: '',
            value2: '',
            value3: '',
            value4: '',
            value5: '',
            devicelist: [],
            getuserList: [],
            casprops: {
                label: 'title',

                value: 'id',
                children: 'userList'
            }
        };
    },
    created() {
        // this.getdeviceList();
        this.getuserListByDept();
    },
    watch: {},

    methods: {
        handleSuccess(res, file) {
            var a = this.host + '/' + this.ossParams.key;
            this.form.technologyName = file.name;
            this.form.technology = a;
        },
        // 上传之前的回调
        beforeUpload: async function(file) {
            await this.backOssInfo(file);
        },
        handleRemove(file, fileList) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.fileList = [];
                    this.form.technologyName = '';
                    this.form.technology = '';
                })
                .catch(() => {});
        },
        exceed(files, fileList) {
            this.$message.error('最多只能上传一个文件！');
        },
        // 获取oss签名数据
        backOssInfo: function(file) {
            let fileName = file.name.substring(file.name.lastIndexOf('.') + 1);
            return new Promise(
                function(resolve, reject) {
                    onenet.ossInfo().then(
                        function(response) {
                            if (response === undefined) {
                                this.$message.error(response.error);
                                reject();
                            } else {
                                this.ossParams.OSSAccessKeyId = response.accessid;
                                this.ossParams.policy = response.policy;
                                this.ossParams.signature = response.signature;
                                this.ossParams.key = sessionStorage.getItem('userId') + this.randomWord(true, 9, 12) + '.' + fileName;
                                resolve();
                            }
                        }.bind(this)
                    );
                }.bind(this)
            );
        },
        randomWord(randomFlag, min, max) {
            let str = '';
            let range = min;
            let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            // 随机产生
            if (randomFlag) {
                range = Math.round(Math.random() * (max - min)) + min;
            }
            for (let i = 0; i < range; i++) {
                let pos = Math.round(Math.random() * (arr.length - 1));
                str += arr[pos];
            }
            return str;
        },
        // 设备列表
        getdeviceList() {
            deviceList().then(res => {
                this.devicelist = res.data;
            });
        },
        //获取部门下用户
        getuserListByDept() {
            userListByDept({type:'produceTask'}).then(res => {
                if (res.code === '0') {
                    this.getuserList = res.data;
                }
            });
        },
        changevalue(value, index) {
            this[`value${index}`] = value.toString();
        },
        // 获取详情
        getproduceTaskPlanid(id, m) {
            var obj = { id: id.produceTaskPlanId };
            produceTaskPlanid(obj).then(res => {
                res.data.userId = res.data.executeUserId;
                if (res.data.technologyName) {
                    this.fileList.push({ name: res.data.technologyName, url: res.data.technology });
                }
                this.form = res.data;
                console.log(this.form);
            });
        },
        handleChange(val) {
            this.getmath(this.form.planYield, val);
            this.num = val;
            let arr = [];
            for (let a = 0; a < val; a++) {
                arr.push({ value: this[`value${a}`] });
            }
            this.numlist = arr;
        },
        //平分工单
        getmath(value, num) {
            for (let a = 0; a < num; a++) {
                if (a == num - 1) {
                    this[`value${a}`] = (value - (value % num)) / num + (value % num);
                } else {
                    this[`value${a}`] = (value - (value % num)) / num;
                }
            }
        },
        close(num) {
            this.init();
            this.$emit('close', num);
        },

        marksure(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    // 处理分单
                    if (this.tit === '工单分解') {
                        let arr = [];
                        this.numlist.map((item, index) => {
                            arr.push(this[`value${index}`]);
                        });
                        this.form.yieldList = arr;
                        saveProduceTaskPlan(this.form).then(res => {
                            if (res.code === '0') {
                                this.$message.success(res.msg);
                                this.close('0');
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                    } else if (this.tit === '派单' || this.tit === '修改') {
                        if (Array.isArray(this.form.userId)) {
                            this.form.deptId = this.form.userId[0];
                            this.form.userId = this.form.userId[1];
                        }
                        produceTaskAssign(this.form).then(res => {
                            this.$message.success(res.msg);
                            this.close('0');
                        });
                    }
                }
            });
        },
        beforclose() {
            this.init();
            this.$emit('close', false);
        },
        init() {
            this.form = {
                productName: '',
                productCode: '',
                specificationModel: '',
                planYield: '',
                taskNumber: '',
                planStartTime: '',
                planEndTime: '',
                yieldList: []
            };
            this.value0 = '';
            this.value1 = '';
            this.value2 = '';
            this.value3 = '';
            this.value4 = '';
            this.value5 = '';
            this.num = 0;
            this.numlist = [];
            this.fileList = [];
            if (this.$refs.updata) {
                this.$refs.updata.clearFiles();
            }
        }
    }
};
</script>

<style lang="less">
.assignmodal {
    .el-dialog {
        border-radius: 5px;
    }
    .el-dialog__header {
        background-color: #409baf;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        .el-dialog__title {
            color: #fff;
        }
        .el-dialog__headerbtn .el-dialog__close {
            color: #fff;
        }
    }
    .dialog-footer {
        text-align: end;
    }
    .modalcont {
        padding: 25px 0;
        border: 1px dashed #aaa;
        margin-bottom: 25px;
        height: 90px;
    }
    .modaltit1 {
        padding: 10px 0;
        font-size: 18px;
        color: #324170;
    }
    .upload-demo {
        margin-bottom: 20px;
        .upload-demo1 {
            padding: 10px;
        }
        .el-upload {
            width: 80px;
            height: 32px;
            border: none;
        }
    }
}
</style>
