<template>
  <div class="moadl1">
    <el-dialog 
    :title="tit" 
    :destroy-on-close='isclose'
    :visible.sync="dialogFormVisible"
    width='40%' 
    :before-close='beforclose' 
    center>
         <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
         

            <el-form-item label="用户角色" :label-width="formLabelWidth"  class="formitem formitem1" prop="name">
                <el-input  v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="用户描述" prop="remark" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="ruleForm.remark"></el-input>
            </el-form-item>
           <el-form-item label="角色授权" :label-width="formLabelWidth" prop="menuIds">
                <!-- <el-checkbox-group v-model="ruleForm.menuIds">
                    <el-checkbox v-for="check in checklist" :label="check.id" :checked="check.c ? true : false" :key="check.id">{{check.name}}</el-checkbox>
                </el-checkbox-group> -->
                <el-tree 
                    :data="data"
                    node-key="id"
                    show-checkbox
                    ref='tree'
                    :default-checked-keys="checklist"
                    @check='checktree'
                 >
                </el-tree>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="marksure('ruleForm')" :loading="sureload">确 定</el-button>
        </div>
    </el-dialog>

  </div>
</template>

<script>
import {rolePage,authrole,authroleid,authputrole,userListMenu } from 'api/index'
export default {
    name: 'jurimodal',
  
    props:{
      dialogFormVisible:{
          type:Boolean
      },
      tit:{
          type:String
      },
      isedit:{
          type:Boolean
      }
    },
    data() {
        return {
            data:[],
            isclose:true,
            sureload:false,
            rolelist:[],
            ruleForm: {
              menuIds:[],
              name:'',
              remark:''
            },
            checklist:[],
            formLabelWidth: '80px',
            rules: {
               
                name:[
                    { required: true, message: '请输入角色', trigger: 'blur' },
                ],
                remark:[
                    { required: true, message: '请输入描述', trigger: 'blur' },
                ]
            }
        }
    },
    created(){
    //   this.getrolePage()
      this.getuserListMenu()
    },
    mounted(){
     
    },
    watch:{
    //    checklist:{

    //    }
     
    },
    methods: {
        // 获取角色详情
        getauthroleid:async function(id){
           await authroleid(id).then(res=>{
                 if(res.code === '0'){
                    // res.data.menuIds = res.data.menus
                    var arr = []
                    var checked = []
                     res.data.menus.map(item=>{
                         item.children.map(v=>{
                            arr.push(v.id)
                            checked.push(v.id)
                         })
                         checked.push(item.id)
                    })
                     this.ruleForm = res.data
                     this.checklist = arr
                     this.ruleForm.menuIds = checked
                     // 重新渲染tree
                     this.getuserListMenu()
                 }
            })
        },

       getrolePage(){
           rolePage().then(res=>{
               if(res.code==='0'){
                   this.rolelist = res.data.records
               }
           })
       },
       close(){
           console.log(this.$refs.tree.getCheckedKeys())
           this.init()
           this.$emit('close',false)
       },
       //初始化
       init(){
          this.ruleForm = { menuIds:[],pmenuIds:[],name:'',remark:''}
          this.checklist = []
       },
       checktree(data,node){
           let arr = []
           arr.push(...node.halfCheckedKeys, ...node.checkedKeys)
           this.ruleForm.menuIds = arr
         
       },
       marksure(ruleForm){
         
            
            this.$refs[ruleForm].validate((valid) => {
                if (valid) {
                  this.sureload = true
                  if(!this.isedit){
                        authrole(this.ruleForm).then(res=>{
                            this.$message.success(res.msg);   
                            this.init()
                            this.sureload = false
                            this.$emit('close','0')
                        })
                  }else{
                      authputrole(this.ruleForm).then(res=>{
                          this.sureload = false
                          if(res.code==='0'){
                              this.$message.success(res.msg);   
                                this.init()
                                
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
       },
       getuserListMenu(){
            userListMenu({id:sessionStorage.getItem('userId')}).then(res=>{
                if(res.code==='0'){
                    this.data = res.data
                }
            })
        }
    }
}
</script>


<style lang='less'>
    .moadl1{
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
        .dialog-footer{
            text-align: end;
        }
        // .el-form{
        //     display: flex;
        //     flex-wrap: wrap;
        // }
        // .formitem{
        //     width: 45%;
         
        //     margin-bottom: 40px;
        // }
        // .formitem1{
        //     margin-right: 5%;
        // }
    }

</style>
