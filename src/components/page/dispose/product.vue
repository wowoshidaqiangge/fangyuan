<template>
  <div class="product">
       <div class="top">
            <el-row type="flex">
                <el-form :model="seachinfo"  ref="seachinfo"  class="demo-ruleForm">
                <div style="flex:1">
                    <el-button type="add" icon='el-icon-circle-plus-outline' @click="add">新增</el-button>
                    <el-button type="add"  @click="addexcel">EXCEL导入</el-button>
                </div>
                        
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
                <el-col :span="3" >
                    <el-form-item label=""  prop="productNameOrCode" >
                      <el-input  placeholder="产品名称" v-model="seachinfo.productNameOrCode" class="elinput"> </el-input>
                  </el-form-item>
                    
                </el-col>
                <div style="margin:0 15px">
                    <el-button type="add" icon="el-icon-search" @click="seachinfo1">搜索</el-button>
                    <el-button type="success" icon="el-icon-refresh-right" @click="resetting">重置</el-button>
                </div>
                          
                   
              </el-form>
            </el-row>
      </div>
        <div class="bot">
              <el-table
                :data="tableData"
                stripe
                v-loading='isload'
                element-loading-text="加载中..."
                element-loading-spinner="el-icon-loading"
                :height="screenWidth"
                style="width: 100%">
                  <el-table-column
                    v-for="(item,index) in columnlist"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :width='item.width'
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
                                    @click="handlesplit('0', scope.row)"
                                >禁用</el-button>
                                <el-button
                                    type="add"
                                    plain
                                   v-if='scope.row.state==0'
                                    class="red"
                                    @click="handlesplit('1', scope.row)"
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
        <productModal :dialogFormVisible='dialogFormVisible' @close='close' :tit='tit' ref='promodal'/>
        <productexcel :dialogFormVisible1='dialogFormVisible1' @close='close' :tit='tit' />
  </div>
</template>

<script>
import {productpage,productdelete,productupdateState} from 'api/main'
import productModal from './productmodal'
import productexcel from './productexcel'
export default {
    name: 'product',
    components:{
      productModal,
      productexcel
    },
    data() {
        return {
            seachinfo:{
                productNameOrCode:'',
                state:''
            },
            value1:'',
            page:{
              current:1,
              size:10
            },
            tableData:[],
            columnlist:[
                {prop:'index',label:'序号',width:'80px'},
                {prop:'productName',label:'产品名称'},
               
                
                {prop:'model',label:'规格型号'},
                 
                {prop:'unit',label:'基本单位'},
               
                {prop:'createTime',label:'创建时间'}
            ],
            screenWidth:(document.body.clientHeight-215) + 'px',
            pagesize:1,
            totals:0,
            dialogFormVisible:false,
            dialogFormVisible1:false,
            tit:'',
            options:[
              {value:'0',label:'禁用'},
              {value:'1',label:'正常'},
            ],
            isload:false
        }
    },
     computed: {
       
    },
    created(){
        this.getproductpage()
    },
    methods: {
        addexcel(){
            this.tit = "导入EXCEL"
            this.dialogFormVisible1 = true
        },
        resetting(){
            this.seachinfo={ productNameOrCode:'',state:''}
            this.page.current = 1
            this.getproductpage()
        },
        seachinfo1(){
            this.page.current = 1
            this.getproductpage()
        },
        add(){
            this.tit='新增产品'
            this.dialogFormVisible = true
        },
        getproductpage(){
            let obj = {...this.seachinfo,...this.page}
            this.isload = true
            productpage(obj).then(res=>{
               this.isload = false
               if(res.code === '0'){
                  res.data.records.map((item,index)=>{
                      item.index = index + 1
                      item.createTime = item.createTime.split(' ')[0]
                  })
                  this.pagesize = parseInt(res.data.current)
                  this.totals = parseInt(res.data.total)
                  this.tableData = res.data.records
               }
            })
        },
        // 分页
        handleCurrentChange(val){
           this.page.current = val
           this.getproductpage()
        },
        close(num){
            this.dialogFormVisible = false
            this.dialogFormVisible1 = false
            if(num=='0'){
                this.getproductpage()
            }
        },
        // 修改
        handleEdit(h,m){
            this.tit = '修改产品'
            this.$refs.promodal.getproductid(m)
            this.dialogFormVisible = true
        },
        // 删除
        handledistribute(h,m){
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                    productdelete(m).then(res=>{
                        if(res.code=='0'){
                            this.$message.success(res.msg)
                            this.getproductpage()
                        }
                    })
            })
            
        },
        // 禁用和启用
        handlesplit(h,m){
            let obj = {id:m.id,state:h}
            productupdateState(obj).then(res=>{
                if(res.code=='0'){
                        this.$message.success(res.msg)
                        this.getproductpage()
                }
            })
        }
    }
}
</script>


<style lang='less'>
   .product{
     
      .top{
              height: 50px;
              margin-top: 10px;
           .demo-ruleForm{
               width: 100%;
               display: flex;
               justify-content: flex-end;
           }
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
