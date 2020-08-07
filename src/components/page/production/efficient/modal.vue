<template>
  <div class="effmodal">
    <el-dialog :title="tit" width="40%" :visible.sync="dialogFormVisible" :before-close='beforclose' center>
        <FormCreate :rule="rule" v-model="fApi" :option="options"/>
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
            fApi:{},
            options:{submitBtn:false,},
            rule:[
                 {
                    type:'input',
                    field:'standardsManhour',
                    title:'标准工时',
                    col: {
                        span:11
                    },
                    validate:[{ required: true, message: '请输入', trigger: 'blur' }],
                },
                {
                    type:'input',
                    field:'workersCount',
                    title:'工人数',
                    col: {
                        span:11
                    },
                    validate:[{ required: true, message: '请输入', trigger: 'blur' }],
                },
                {
                    type:'input',
                    field:'lossManhour',
                    title:'损失工时',
                    col: {
                        span:11
                    },
                    validate:[{ required: true, message: '请输入', trigger: 'blur' }],
                },
                {
                    type:'input',
                    field:'workHour',
                    title:'日工作时',
                    col: {
                        span:11
                    },
                    validate:[{ required: true, message: '请输入', trigger: 'blur' }],
                }
            ],
            editvalue: {}
        }
    },
    created(){
    
    },
    methods: {
       getinfo(info){
           let obj = JSON.parse(JSON.stringify(info))
           this.editvalue =obj
           this.fApi.changeField(obj)
       },
       close(num){
           this.init()
           this.$emit('close',num)
       },
       marksure(form){
            this.fApi.validate((valid) => {
                if (valid) {
                    let obj = {...this.editvalue,...this.fApi.formData()}
                    delete obj.createTime
                    getProduceEfficientput(obj).then(res=>{
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
           this.editvalue= {
               
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
