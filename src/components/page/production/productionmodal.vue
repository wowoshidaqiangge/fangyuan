<template>
  <div class="promoadl">
    
    <el-dialog :destroy-on-close="isclose" :title="tit" width="50%" :visible.sync="dialogFormVisible" :before-close='beforclose' center>
        <el-row>
           <el-form :model="form" ref='form' :rules="rules">
                <el-col :span="24">
                    <el-col :span="11">
                        <el-form-item label="生产任务单" :label-width="formLabelWidth" prop='taskNumber'>
                                <el-input v-model="form.taskNumber" :disabled="tit==='修改任务'"></el-input>
                        </el-form-item>
                    </el-col>
                  
                </el-col>
                
                <el-col :span="11">
                    <el-form-item label="产品名称" :label-width="formLabelWidth" prop='productId'>
                        <el-select v-model="form.productId" filterable  @change='changeselect' placeholder="请选择">
                            <el-option
                                v-for="item in prolist"
                                :key="item.id"
                                :label="item.productName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-col :span="11">
                        <el-form-item label="产品名称" :label-width="formLabelWidth" prop='productName'>
                                <el-input v-model="form.productName" disabled autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="产品型号" :label-width="formLabelWidth" prop='model'>
                                <el-input v-model="form.model" disabled autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="11">
                        <el-form-item label="计划产量" :label-width="formLabelWidth" prop='planYield'>
                                <el-input v-model="form.planYield" ></el-input>
                        </el-form-item>
                </el-col>
                <el-col :span="11">
                        <el-form-item label="计划时间" :label-width="formLabelWidth" prop='model'>
                                <el-date-picker
                                    v-model="value1"
                                    type="daterange"
                                    @change="changetime"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                        </el-form-item>
                </el-col>
            </el-form> 
        </el-row>
        
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="marksure('form')">确 定</el-button>
        </div>
    </el-dialog>

  </div>
</template>

<script>
import { produceTask,produceTaskid,produceTaskput } from 'api/index'
import moment from 'moment'
import {orderlist,productlist,getItemListByProductId} from 'api/main'
export default {
    name: 'promoadl',
    props:{
        dialogFormVisible:{
            type:Boolean
        },
        tit:{
            type:String
        }
    },
    data() {
        return {
            isclose:true,
            form: {
                productName: '',
                orderId: '',
                taskNumber: '',
                productId: '',
                planYield:'',
                model: '',
                taskItemList:[]
            },
           
            innerVisible:false,
            value1:[],
            formLabelWidth: '100px',
            options:[],
            tableData2:[],
            
            prolist:[],
            yieid:'',
            rules:{
                taskNumber: [
                    { required: true, message: '请输入', trigger: 'change' }
                ],
                productId: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                planYield: [
                    { required: true, message: '请输入', trigger: 'blur' },
                     {
                        validator(rule, value, callback) {
                        var reg = /^[1-9][0-9]*$/
                        if (reg.test(value)) {
                            callback()
                        } else {
                            callback(new Error('产量必须为整数'))
                        }
                        },
                        trigger: 'change'
                    }
                ],
               
               
            }
         
        }
    },
    created(){
        this.getproductlist()
    },
    methods: {
        BlurText(e) {
            let boolean = new RegExp("^[1-9][0-9]*$").test(e.target.value)
            if(!boolean) {
            this.$message.warn('请输入正整数')
            e.target.value = ' '
            }
        },
        // 查询详情
        getproduceTaskid(id){
           produceTaskid(id).then(res=>{
               if(res.code==='0'){
                   res.data.oldPlanYield = res.data.planYield
                   this.form = res.data
                   this.value1 = [res.data.planStartTime,res.data.planEndTime]
               }
           })
       },
        // 修改产品编码
        changeselect(val){
            let obj = {};
            obj = this.prolist.find((item)=>{  
                    return item.id === val;  
                });
            this.form.productName = obj.productName 
            this.form.model = obj.model 
        },
        // 产品编号列表
        getproductlist(){
            productlist().then(res=>{
                if(res.code==='0'){
                    this.prolist = res.data
                }
            })
        },
       // 获取订单编号列表
      
       changetime(h){
           this.form.planStartTime = moment(h[0]).format('YYYY-MM-DD')
           this.form.planEndTime = moment(h[1]).format('YYYY-MM-DD')
       },
       close(num){
          
           this.$emit('close',num)
            this.init()
       },
   
       marksure(form){
           if(this.value1.length<1){
               this.$message.error('请选择时间')
               return
           }
            this.$refs[form].validate((valid) => {
                if (valid) {
                    if(this.tit ==='新增任务'){
                        produceTask(this.form).then(res=>{
                            if(res.code==='0'){
                                this.$message.success(res.msg)
                                this.close('0')
                            }else{
                                this.$message.error(res.msg)
                            }
                        })
                    }else if(this.tit==='修改任务'){
                        produceTaskput(this.form).then(res=>{
                            if(res.code==='0'){
                                this.$message.success(res.msg)
                                this.close('0')
                            }else{
                                this.$message.error(res.msg)
                            }
                        })
                    }
                        
                }else{

                }
          })
       },
       beforclose(){
          this.init()
          this.$emit('close',false)
       },
       init(){
           this.form= {
                productName: '',
                orderId: '',
                taskNumber: '',
                productId: '',
                planYield:'',
                model: '',
                taskItemList:[]
            }
           this.value1 = []
       }
    }
}
</script>


<style lang='less' scpoed>
        .promoadl{
            .el-col{
                    margin-bottom: 10px;
                }
        }
        .el-dialog{
            border-radius: 5px;
            .el-select{
                width: 100%;
            }
            .el-date-editor{
                width: 100%;
            }
        }
        .el-dialog__header{
            background-color: #409BAF;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            text-align: center;
           .el-dialog__title{
               color: #fff;
           }
           .el-dialog__headerbtn .el-dialog__close{
               color: #fff;
           }
        }
        .dialog-footer{
            text-align: end;
        }
        
    

</style>
