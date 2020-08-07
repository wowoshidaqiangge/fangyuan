<template>
  <div class="mainmodal">
    <el-dialog 
    :title="tit" 
    :destroy-on-close='isclose'
    :visible.sync="dialogFormVisible"
    width='40%' 
    :before-close='beforclose' 
    center>
         <el-form :model="form" :rules="rules" ref="form">
            <el-form-item label="维保设备" :label-width="formLabelWidth" class="formitem formitem1" prop="deviceId">
                <el-select v-model="form.deviceId" placeholder="请选择" class="elwith">
                    <el-option
                        v-for="item in rolelist"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        {{item.name}}
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="维保类型" :label-width="formLabelWidth" class="formitem formitem1" prop="maintenanceType">
                <el-select v-model="form.maintenanceType" placeholder="请选择" class="elwith">
                    <el-option
                        v-for="item in deptlist"
                        :key="item.enumKey"
                        :label="item.enumValue"
                        :value="item.enumKey">
                        {{item.enumValue}} 
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="执行人" :label-width="formLabelWidth" class="formitem formitem1" prop="executeUserId">
                <el-select v-model="form.executeUserId" placeholder="请选择" class="elwith">
                    <el-option
                        v-for="item in userlist"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        {{item.name}} 
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="计划时间" :label-width="formLabelWidth" class="formitem formitem1" prop="time">
                      <el-date-picker
                        v-model="form.time"
                        class="elwith"
                        type="date"
                        @change="datechange"
                        placeholder="选择日期">
                    </el-date-picker>
            </el-form-item>
          
            <el-form-item label="备注" :label-width="formLabelWidth" class="formitem formitem1" prop="remark">
                    <el-input v-model="form.remark" ></el-input>
            </el-form-item>
            
          
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="marksure('form')" :loading="sureload">确 定</el-button>
        </div>
    </el-dialog>

  </div>
</template>

<script>
import { deviceList,maintainStateList,userPage,maintain,maintainput,maintainget } from 'api/index'
import moment from 'moment'
export default {
    name: 'mainfmodal',
    props:{
        dialogFormVisible:{
            type:Boolean
        },
         tit:{
            type:String
        },
       isedit:{
           type:Boolean
       },
       deptlist:{
           type:Array
       },
       rolelist:{
           type:Array
       }
    },
    data() {
        return {
            isclose:true,
            sureload:false,
          
            userlist:[],
            form: {
                time:'',
                deviceId:'',
                maintenanceType:'',
                executeUserId:'',
                remark:''
            },
            formLabelWidth: '80px',
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
              
            }
        }
    },
    created(){
     
      this.getuserPage()
    },
    mounted(){
        
    },
    watch:{
     
    },
    methods: {
        getmaintainget(id){
            maintainget(id).then(res=>{
                if(res.code==='0'){
                      res.data.time =  res.data.planTime
                      res.data.maintenanceType = res.data.state.toString()  
                      this.form = res.data
                }
            })
        },
        datechange(e){
            this.form.time = moment(this.form.time).format('YYYY-MM-DD')
        },
    //     getmaintainStateList(){
    //         maintainStateList().then(res=>{
    //             if(res.code==='0'){
    //                this.deptlist = res.data
    //            }
    //         })
    //     },
    //    getdeviceList(){
    //        deviceList().then(res=>{
    //            if(res.code==='0'){
    //                this.rolelist = res.data
    //            }
    //        })
    //    },
       getuserPage(){
           userPage().then(res=>{
               if(res.code === '0'){
                   this.userlist = res.data.records
               }
           })
       },
       close(){
           this.init()
           this.$emit('close',false)
       },
       //初始化
       init(){
           this.form= {
                name:'',
                time:'',
                deviceId:'',
                maintenanceType:'',
                executeUserId:'',
                remark:''
            }
       },
       marksure(form){
           this.sureload = true
            this.$refs[form].validate((valid) => {
                if (valid) {
                  if(!this.isedit){
                       maintain(this.form).then(res=>{
                            if(res.code ==='0'){
                                this.$message.success(res.msg)
                                    this.init()
                                    this.sureload = false
                                    this.$emit('close','0')
                            }
                        })
                  }else{
                      maintainput(this.form).then(res=>{
                          if(res.code ==='0'){
                                this.$message.success(res.msg)
                                this.init()
                                this.sureload = false
                                this.$emit('close','0')
                            }
                      })
                  }
                  
                    
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
       },
       beforclose(){
          this.init()
          this.$emit('close',false)
       }
    }
}
</script>


<style lang='less'>
    .mainmodal{
        .el-dialog{
            border-radius: 5px;
        }
        .el-dialog__header{
            background-color: #409BAF;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
           .el-dialog__title{
               color: #fff;
                 letter-spacing: 2px;
           }
           .el-dialog__headerbtn .el-dialog__close{
               color: #fff;
             
           }
         
        }
          .elwith{
               width: 100% !important;
           }
        .dialog-footer{
            text-align: end;
        }
        .el-form{
           
        }
        .formitem{
          
            margin-bottom: 40px;
        }
        .formitem1{
            margin-right: 5%;
        }
    }

</style>
