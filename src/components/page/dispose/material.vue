<template>
  <div class="material">
       
        <div class="top">
            
            <el-row>
                <el-form :model="seachinfo"  ref="seachinfo"  class="demo-ruleForm">
                <el-col :span="15">
                    <el-form-item label="" >
                        <el-button type="add" icon='el-icon-circle-plus-outline' @click="add">新增</el-button>
                        <el-button type="add"  @click="addexcel">EXCEL导入</el-button>
                    </el-form-item>
                </el-col>
              
                <el-col :span="2" style="margin:0 20px">
                  <el-form-item label=""  prop="state" >
                      <el-select v-model="seachinfo.state"  placeholder="状态" >
                             <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="3" style="margin-right:10px">
                    <el-form-item label=""  prop="itemNameOrCode" >
                      <el-input  placeholder="物料名称或编码" v-model="seachinfo.itemNameOrCode" class="elinput"> </el-input>
                  </el-form-item>
                    
                </el-col>
                <el-col :span="3">
                    <el-form-item label="" >
                          <el-button type="add" icon="el-icon-search" @click="seachinfo1">搜索</el-button>
                          <el-button type="success" icon="el-icon-refresh-right" @click="resetting">重置</el-button>
                    </el-form-item>
                </el-col>
              </el-form>
            </el-row>
      </div>
        <div class="bot">
            <el-table
                :data="tableData"
                stripe
                :height="screenWidth"
                style="width: 100%">
                  <el-table-column
                    v-for="(item,index) in columnlist"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    align="center"
                    >
                  </el-table-column>
                   <el-table-column label="状态" align="center">
                            <template slot-scope="scope">
                               <span v-if='scope.row.state==0' style="color:red">禁用</span>
                                <span v-if='scope.row.state==1'>正常</span>
                            </template>
                    </el-table-column>
                   <el-table-column label="操作" width="210" >
                            <template slot-scope="scope">
                                <el-button
                                    type="success"
                                    plain
                                    v-if='scope.row.state==1'
                                    class="red"
                                    @click="handlesplit(0, scope.row)"
                                >禁用</el-button>
                                <el-button
                                    type="add"
                                    plain
                                   v-if='scope.row.state==0'
                                    class="red"
                                    @click="handlesplit(1, scope.row)"
                                >启用</el-button>
                                 <el-button
                                    type="info"
                                    v-if='scope.row.state==1'
                                    plain
                                    @click="handleEdit(scope.$index, scope.row)"
                                >修改</el-button>
                                <el-button
                                    type="danger"
                                    plain
                                    v-if='scope.row.state==1'
                                    class="red"
                                    @click="handledistribute(scope.$index, scope.row)"
                                >删除</el-button>
                            </template>
                    </el-table-column>
            </el-table>
            <div class="page">
                <el-pagination
                    :background='true'
                    :current-page.sync="pagesize"
                    @current-change="handleCurrentChange"
                    layout="total, prev, pager, next"
                    :total="totals">
                </el-pagination>
        </div>
        </div>
        <mateModal :dialogFormVisible='dialogFormVisible' @close='close' :tit='tit' ref='matemodal'/>
        <mateExcel :dialogFormVisible1='dialogFormVisible1' @close='close' :tit='tit'/>
  </div>
</template>

<script>
import {producetaskpage,producetaskdelete,producetaskupdateState} from 'api/main'

import mateModal from './matemodal'
import mateExcel from './meateralexcel'
export default {
    name: 'material',
    components:{
      mateModal,mateExcel
    },
    data() {
        return {
            seachinfo:{
              itemNameOrCode:'',
              state:''
            },
            value1:'',
            page:{
              current:1,
              size:10
            },
            producetlist:[],
            screenWidth:(document.body.clientHeight-215) + 'px',
            columnlist:[
                {prop:'index',label:'序号'},
                {prop:'itemCode',label:'物料编码'},
                {prop:'itemName',label:'物料名称'},
                {prop:'model',label:'规格型号'},
                {prop:'series',label:'系列'},
                {prop:'material',label:'材质'},
                {prop:'unit',label:'基本单位'},
                {prop:'deptName',label:'关联部门'},
                {prop:'createTime',label:'新增时间'}
            ],
            tableData:[],
            pagesize:1,
            totals:0,
            dialogFormVisible:false,
            dialogFormVisible1:false,
            tit:'',
            options:[
              {value:'0',label:'禁用'},
              {value:'1',label:'正常'},
            ],
            persons:[]
        }
    },
     computed: {
       
    },
    mounted(){
      
    },
    created(){
        this.getproducetaskpage()
    },
    methods: {
      addexcel(){
        this.tit = "导入EXCEL"
        this.dialogFormVisible1 = true
      },
     
      // 获取列表
        getproducetaskpage(){
          let obj = {...this.seachinfo,...this.page}
          producetaskpage(obj).then(res=>{
           if(res.code==='0'){
              res.data.records.map((item,index)=>{
               item.index =index+1
               if(item.createTime){
                  item.createTime = item.createTime.split(' ')[0]
               }
            })
            this.pagesize = parseInt(res.data.current)
            this.totals = parseInt(res.data.total)
            this.tableData = res.data.records
           }else{
             this.$message.error(res.msg)
           }
          })
        },
        add(){
            this.tit= '新增'
            this.dialogFormVisible = true
        },
        seachinfo1(){
           this.page.current = 1
           this.getproducetaskpage()
        },
        resetting(){
            this.seachinfo={
              itemNameOrCode:'',
              state:''
            }
            this.page.current = 1
            this.getproducetaskpage()
        },
        handleCurrentChange(val){
            this.page.current = val
            this.getproducetaskpage()
        },
        // 关闭弹窗
        close(num){
          this.dialogFormVisible = false
          this.dialogFormVisible1 = false
          if(num==='0'){
              this.getproducetaskpage()
              
          }
        },
        
        // 修改
        handleEdit(h,m){
          this.tit= '修改'
          this.$refs.matemodal.getproducetaskid(m)
          this.dialogFormVisible = true
        },
        // 删除
        handledistribute(h,m){
           this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                   producetaskdelete(m).then(res=>{
                      if(res.code==='0'){
                          this.$message.success(res.msg)
                          this.getproducetaskpage()
                      }
                    })
            })
        },
        handlesplit(h,m){
          var obj = {id:m.id,state:h}
           producetaskupdateState(obj).then(res=>{
              if(res.code==='0'){
                  this.$message.success(res.msg)
                  this.getproducetaskpage()
              }
           })
        }
    }
}
</script>


<style lang='less'>
   .material{
       width: 100%;
       height: 100%;
      .top{
              height: 50px;
              margin-top: 10px;
           
        }
       
        .page{
                margin-top: 10px;
                float: right;
         }
        .el-pager li.active{
              background-color: #409baF !important;
              color: #fff;
        }
   }
</style>
