<template>
  <div class="ordermodal">
    
    <el-dialog :title="tit"  :visible.sync="dialogFormVisible" :before-close='beforclose' center>
        <el-row>
           <el-form :model="form" :rules="rules" ref='form'>
               <el-col :span="11">
                    <el-form-item label="订单编号" :label-width="formLabelWidth" prop='orderCode'>
                            <el-input v-model="form.orderCode" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="产品名称" :label-width="formLabelWidth" prop='productName'>
                            <el-input v-model="form.productName" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
              
               <el-col :span="24">
                        <el-col :span="11">
                            <el-form-item label="产品编码" :label-width="formLabelWidth" prop='productCode'>
                                    <el-input v-model="form.productCode" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="客户名称" :label-width="formLabelWidth" prop='customer'>
                                    <el-input v-model="form.customer" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                <p>
                    <el-col :span="11">
                        <el-form-item label="规格型号" :label-width="formLabelWidth" prop='model'>
                                <el-input v-model="form.model" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="生产量" :label-width="formLabelWidth" prop='planYield'>
                            <el-input v-model="form.planYield" type="number" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    
                </p>
             
                  
                 <el-col :span="11">
                    <el-form-item label="交货时间" :label-width="formLabelWidth" prop='planFinishTime'>
                           <el-date-picker
                           style='width:100%'
                           @change='changetime'
                            v-model="form.planFinishTime"
                           > 
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
import {orderadd,orderid,orderput} from 'api/main'
import moment from 'moment'
export default {
    name: 'ordermodal',
  
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
            form: {
               orderCode:'',
               productName:'',
               productCode:'',
               model:'',
               planYield:'',
               planFinishTime:''
            },
            value2:[],
            formLabelWidth: '80px',
              rules: {
                orderCode: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                productCode:[
                     { required: true, message: '请输入', trigger: 'blur' },
                ],
                 model:[
                     { required: true, message: '请输入', trigger: 'blur' },
                ],
                 planYield:[
                     { required: true, message: '请输入', trigger: 'blur' },
                ],
                 planFinishTime:[
                     { required: true, message: '请输入', trigger: 'blur' },
                ],
            }
        }
    },
    created(){
       
    },
    methods: {
       changetime(h){
           this.form.planFinishTime = moment(h).format('YYYY-MM-DD')
       },
       close(num){
           this.init()
           this.$emit('close',num)
       },
       getorderid(id){
           orderid(id).then(res=>{
               if(res.code==='0'){
                //    this.value1 = [res.data.planStartTime,res.data.planEndTime]
                   this.form = res.data
               }
           })
       },
       marksure(form){
          this.$refs[form].validate((valid) => {
                if (valid) {
                    if(this.tit=='新增订单'){
                        orderadd(this.form).then(res=>{
                            if(res.code==='0'){
                                this.$message.success(res.msg)
                                this.close('0')
                            } else {
                                this.$message.error(res.msg)
                                this.close('0')
                            }
                        })
                    }else[
                        orderput(this.form).then(res=>{
                            if(res.code==='0'){
                                this.$message.success(res.msg)
                                this.close('0')
                            } else {
                                this.$message.error(res.msg)
                                this.close('0')
                            }
                        })
                    ]
                    
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
                productCode: '',
                specificationModel: '',
                planYield: '',
                delivery: false,
                planStartTime: '',
                planEndTime: '',
                
            }
            this.value2 = []
       }
    }
}
</script>


<style lang='less'>
    .ordermodal{
        .el-col{
            margin-bottom: 10px;
        }
        .el-dialog{
            border-radius: 5px;
        }
        .el-dialog__header{
            background-color: #409BAF;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
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
        
    }

</style>
