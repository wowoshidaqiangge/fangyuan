<template>
  <div class="effmodal">
    
    <el-dialog :title="tit" width="40%" :visible.sync="dialogFormVisible" :before-close='beforclose' center>
        <el-row>
           <el-form :model="form" ref='form' :rules="rules">
                <el-col :span="11">
                    <el-form-item label="标准工时" :label-width="formLabelWidth" prop='standardsManhour'>
                         <el-input v-model="form.standardsManhour" ></el-input>
                    </el-form-item>
                </el-col>
               <el-col :span="11">
                    <el-form-item label="工人数" :label-width="formLabelWidth" prop='workersCount'>
                         <el-input v-model="form.workersCount" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="损失工时" :label-width="formLabelWidth" prop='lossManhour'>
                         <el-input v-model="form.lossManhour" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="日工作时" :label-width="formLabelWidth" prop='workHour'>
                         <el-input v-model="form.workHour" ></el-input>
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
import { getProduceEfficientput } from 'api/product'
import moment from 'moment'

export default {
    name: 'effmodal',
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
            },
            formLabelWidth: '80px',
            rules:{
                standardsManhour: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                workersCount: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                lossManhour: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                workHour: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
            }
        }
    },
    created(){
    
    },
    methods: {
       getinfo(info){
           let obj = JSON.parse(JSON.stringify(info))
           this.form = obj
       },
       close(num){
           this.init()
           this.$emit('close',num)
       },
       marksure(form){
            this.$refs[form].validate((valid) => {
                if (valid) {
                    delete this.form.createTime
                    getProduceEfficientput(this.form).then(res=>{
                        if(res.code === '0') {
                            this.$message.success(res.msg)
                            this.close('0')
                        }else {
                            this.$message.error(res.msg)
                        }
                    })
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
               
            }
         
       }
    }
}
</script>


<style lang='less' scpoed>
        .effmodal{
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
