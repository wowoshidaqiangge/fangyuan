
<template>
  <div class="efficient">
       <div class="top">
          <el-row type="flex" justify='end'>
            <el-form :model="seachinfo"  ref="seachinfo"  class="demo-ruleForm">
              <el-col :span="5">
                  <el-form-item label="" prop="value1">
                        <el-date-picker
                            v-model="value1"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            @change="changedate"
                            class="datetime"
                            end-placeholder="结束日期">
                        </el-date-picker>
                  </el-form-item>
              </el-col>
              <el-col :span="3" style="margin-left:15px">
                  <el-form-item label=""  prop="taskNumber" >
                     <el-input  placeholder="任务单或生产工单" v-model="seachinfo.taskNumber"> </el-input>
                 </el-form-item>
              </el-col>
              <div style="margin: 0 15px">
                    <el-button type="add" icon="el-icon-search" @click="seachinfo1">搜索</el-button>
                    <el-button type="success" icon="el-icon-refresh-right" @click="resetting">重置</el-button>
              </div>
            </el-form>
          </el-row>
     </div>
     <div class="bot">
           <el-table
                :data="Efficientlist"
                stripe
                border>
                 <el-table-column
                    v-for="(item,index) in columnlist"
                    :key="index"
                    :width="item.width"
                    :prop="item.prop"
                    :label="item.label"
                    align="center">
                 </el-table-column>
                 <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button
                                    type="success"
                                    plain
                                    @click="handleagin(scope.$index, scope.row)"
                                >编辑</el-button>
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
      <effModal  :dialogFormVisible='dialogFormVisible' :tit='tit' @close='close' ref="effmodal"/>
  </div>
</template>

<script>
import {getProduceEfficient } from 'api/product'
import moment from 'moment'
import effModal from './modal'
export default {
    name: 'efficient',
    components:{
       effModal
    },
    computed:{
       
    },
    watch: {
       
    },
    mounted(){
           
    },
    data() {
        return {
            tit:'',
            dialogFormVisible:false,
             seachinfo:{

            },
            value1:[],
            page:{
                current:1,
                size:10
            },
            Efficientlist:[],
            pagesize:1,
            totals:0,
            columnlist:[
                {prop:'index',label:'序号'},
                {prop:'deptName',label:'部门'},
                {prop:'deptChildName',label:'车间班组'},
                {prop:'reportNumber',label:'报工流水号'},
                {prop:'productName',label:'产品名称'},
                {prop:'model',label:'规格型号'},
                {prop:'produceCount',label:'生产量'},
                {prop:'dayProduceRate',label:'日生产率'},
                {prop:'dayProduceEfficient',label:'日生产效率'},
                {prop:'createTime',label:'创建时间'},
                {prop:'standardsManhour',label:'标准工时',width:'80px'},
                {prop:'workersCount',label:'工人数',width:'80px'},
                {prop:'lossManhour',label:'损失工时',width:'80px'},
                {prop:'workHour',label:'日工作小时',width:'90px'},
            ]
        }
    },
    created(){
       this.getProduceEfficient()
    },
    methods: {
     changedate(val){
            this.seachinfo.beginDate = moment(val[0]).format('YYYY-MM-DD')
            this.seachinfo.endDate = moment(val[1]).format('YYYY-MM-DD')
        },
        resetting(){
            this.page ={
                current:1,
                size:10
            }
            this.value1 = []
            this.seachinfo={}
            this.getProduceEfficient()

        },
        seachinfo1(){
            this.page.current =1
            this.getProduceEfficient()
        },
        // 数据列表
        getProduceEfficient(){
            let obj = {...this.page,...this.seachinfo}
            getProduceEfficient(obj).then(res=>{
                if(res.code==='0'){
                    res.data.records.map((item,index)=>{
                        item.index = index + 1
                        item.createTime = item.createTime.split(' ')[0]
                    })
                    this.pagesize = parseInt(res.data.current)
                    this.totals = parseInt(res.data.total)
                    this.Efficientlist = res.data.records
                }
            })
        },
        //
        handleCurrentChange(val){
            this.page.current =val
            this.getProduceEfficient()
        },
        handleagin(id,info){
            this.tit = '编辑'
            this.dialogFormVisible = true
            setTimeout(()=>{
                this.$refs.effmodal.getinfo(info)
            },0)
            
        },
        close(num){
            this.dialogFormVisible = false
            if(num ==='0'){
                this.getProduceEfficient()
            }
        }
    }
}
</script>


<style lang='less'>
    .efficient{
         .top{
                height: 50px;
                margin-top: 10px;
                .datetime{
                    width:100%
                }
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
