<template>
  <div class="production">
      <div v-loading.fullscreen.lock="fullscreenLoading" class="top">
          <el-row type='flex' justify='end'>
              <el-form :model="seachinfo"  ref="seachinfo"  class="demo-ruleForm">
              <div style="flex:1">
                    <!-- <el-button type="add" icon='el-icon-circle-plus-outline' @click="add">新增</el-button>
                    <el-button type="add" icon="el-icon-search" @click="getPrintList">批量打印</el-button>
                    <el-button type="add" icon="el-icon-search" @click="getPrintRecord">打印记录</el-button> -->
                   <el-form-item v-if="!ifPrint" label="" >
                       <el-button type="add" icon='el-icon-circle-plus-outline' @click="add">新增</el-button>
                       <el-button type="add" icon="el-icon-document-copy" @click="ifPrint = true">批量打印</el-button>
                   </el-form-item>
                   <el-form-item v-else label="" >
                       <el-button type="add" icon='el-icon-close' @click="ifPrint = false">取消操作</el-button>
                       <el-button type="add" icon="el-icon-printer" @click="getPrintList">打印选中</el-button>
                       <el-button type="add" icon="el-icon-search" @click="panit">查看打印记录</el-button>
                   </el-form-item>
              </div>
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
              <el-col :span="2" style="margin:0 20px">
                 <el-form-item label=""  prop="state" >
                     <el-select v-model="seachinfo.state"  placeholder="状态" >
                        <el-option
                            v-for="item in orderlist"
                            :key="item.enumKey"
                            :label="item.enumValue"
                            :value="item.enumKey">
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
     <div>
             <el-table
                :data="tableData"
                stripe
                ref="multipleTable"
                :height='screenWidth'
                @selection-change="handleSelectionChange"
                border
                style="width: 100%">
                <el-table-column
                    v-if="ifPrint"
                    type="selection"
                     align="center"
                    width="55">
                    </el-table-column>
                <el-table-column
                    v-for="(item,index) in columnlist"
                    :key="index"
                    :width="item.width"
                    :prop="item.prop"
                    :label="item.label"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    label="状态"
                    width="70">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <span v-if="scope.row.state=='1' " style="color:rgb(40,176,40);font-weight:600">{{ scope.row.produceTaskState }}</span>
                            <span v-if="scope.row.state=='2' " style="color:rgb(255,153,19);font-weight:600">{{ scope.row.produceTaskState }}</span>
                            <span v-if="scope.row.state=='3' " style="color:rgb(69,79,201);font-weight:600">{{ scope.row.produceTaskState }}</span>
                            <span v-if="scope.row.state=='4' " style="color:rgb(231,52,58);font-weight:600">{{ scope.row.produceTaskState }}</span>
                            <span v-if="scope.row.state=='5' " style="color:rgb(143,143,143);font-weight:600">{{ scope.row.produceTaskState }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="进度"
                    width="55">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <span style="color:rgb(40,176,40)">{{ scope.row.produceProgress }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="用时"
                    width="50">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <span v-if='scope.row.produceDuration'>{{ scope.row.produceDuration }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300" >
                            <template slot-scope="scope">
                                <el-button
                                    type="success"
                                    v-if="scope.row.state=='3' || scope.row.state=='2' ||scope.row.state=='1' "
                                    plain
                                    @click="handleUntie(5, scope.row.id)"
                                >锁定</el-button>
                                <el-button
                                    type="warning"
                                     v-if="scope.row.state=='5' "
                                    plain
                                    @click="handleUntie(6, scope.row.id)"
                                >解锁</el-button>
                                <el-button
                                    type="info"
                                     v-if="scope.row.state=='1' || scope.row.state=='2'"
                                    plain
                                    @click="handleEdit(scope.$index, scope.row)"
                                >修改</el-button>
                                <el-button
                                    type="danger"
                                    plain
                                     v-if="scope.row.state=='1' || scope.row.state=='2'"
                                    class="red"
                                    @click="handleDelete(scope.$index, scope.row)"
                                >删除</el-button>
                                <el-button
                                    type="success"
                                    plain
                                    @click="handlePrint(scope.row)"
                                >打印</el-button>
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
        <!-- <div class="qqrcode" id="QCode" ref="qrCodeUrl"></div> -->
        <el-dialog
            title="打印记录"
            :visible.sync="dialogVisible"
            width="40%">
            <div v-for="(item,index) in parinlist" :key="index" class="recordItem">
                <div class="recordFirst">
                    <div class="pdfName">下载链接将于{{getweektime(item.createTime)}}失效，请尽快下载</div>
                    <i class="el-icon-delete" @click="paritdelete(item)">删除</i>
                </div>
                <div class="recordSecond">
                    <img src="~assets/img/pdf.jpg" width="20px" style="margin-right:10px"/>
                    <div class="pdfName">任务_{{item.taskNumber}}.pdf</div>
                    <i class="el-icon-download" @click="downLoadPdf(item)" ></i>
                </div>
            </div>
            <div >
                <el-pagination
                    style="text-align:end"
                    :background='true'
                    :current-page.sync="pagesize1"
                    :page-size.sync ='pagesize2'
                    @current-change="handleCurrentChange1"
                    layout="total, prev, pager, next"
                    :total="totals1">
                </el-pagination>
            </div>
        </el-dialog>
          <Modal :dialogFormVisible='dialogFormVisible' @close='close' :tit='tit' ref='promodal'/>
          <download  :dialogFormVisible1='dialogFormVisible1'  ref='pdfdownload'/>
          
  </div>
</template>

<script>
import { produceTaskpage,produceTaskdelete,updateProduceTaskLockById,
produceTaskStateList,produceTaskPrint,produceTaskPrintpage,produceTaskPrintid } from 'api/index'
import Modal from './productionmodal'
import download from './download'
import QRCode from 'qrcodejs2'
import moment from 'moment'
import { mapState } from 'vuex'
export default {
    name: 'production',
    components:{
        Modal,
        download
    },
    computed:{
        ...mapState(['screenHeight']),
    },
    watch: {
        // 监听高度
        screenHeight (newVal, oldVal) {
            if(newVal){
                this.screenWidth = (newVal-210) + 'px'
            }
        }
    },
    data() {
        return {
            dialogFormVisible:false,
            dialogFormVisible1: false,
            dialogVisible: false,
            ifPrint:false,
            value:'',
            value1:'',
            tit:'',
            row: {},
            page:{
                current:1,
                size:10
            },
            page1:{
                current:1,
                size:5
            },
            fullscreenLoading: false,
            tableData:[],
            columnlist:[
                {prop:'index',label:'序号',width:'50'},
                // {prop:'deviceTypeName',label:'部门'},
                {prop:'taskNumber',label:'任务单'},
                {prop:'productName',label:'产品名称'},
                {prop:'model',label:'规格型号'},
                {prop:'planYield',label:'计划生产量',width:'95'},
                {prop:'planStartTime',label:'计划开始时间',},
                {prop:'planEndTime',label:'计划结束时间',},
                {prop:'createTime',label:'新增时间',},
                {prop:'createUser',label:'下单人'},
            ],
            pagesize:1,
            pagesize1:1,
            pagesize2:5,
            totals1:0,
            totals:0,
            screenWidth:(document.body.clientHeight-215) + 'px',
            seachinfo:{
                beginDate:'',
                endDate:'',
                state:'',
                productNameOrCode:''
            },
            orderlist:[],
            checktable:[],
            parinlist:[]
        }
    },
    created(){
        this.getproduceTaskpage()
        this.getproduceTaskStateList()
    },
    methods: {
        // 获取一周后时间
        getweektime(info){
           let time1 = new Date(info).valueOf()
           let time2 =moment(new Date(time1 + 604800000)).format('YYYY-MM-DD HH:mm:ss') 
           return time2
        },
        panit(){
            produceTaskPrintpage(this.page1).then(res=>{
                if(res.code==='0'){
                    this.parinlist = res.data.records
                    this.pagesize1 = parseInt(res.data.current)
                    this.totals1 = parseInt(res.data.total)
                }
                this.dialogVisible  = true;
            })
        },
        downLoadPdf (item) {
            this.$refs.pdfdownload.downPdf(item)
        },
        getPrintRecord () {
            this.dialogVisible = true
        },
        handleSelectionChange(info){
            this.checktable = info
        },
        // 获取打印机列表
        getPrintList() {
            if(this.checktable.length<1){
               this.$message.error('请先选择任务')
           } else{
            //    this.dialogFormVisible1 = true
            //     this.$refs.pdfdownload.gourpPrint(this.checktable)
                // this.$store.commit('changedown',this.checktable)
                let arr = JSON.parse(JSON.stringify(this.checktable))
                arr.map(item=>{
                     item.produceTaskId =item.id
                     delete item.createTime
                     delete item.id
                })
                this.getproduceTaskPrint(arr)
                let routedata =  this.$router.resolve({path: '/download', query: { downlist:JSON.stringify(this.checktable)} })
                window.open(routedata.href, '_blank');
                this.$refs.multipleTable.clearSelection();
           }
        },
        // 查询状态
        getproduceTaskStateList(){
            produceTaskStateList().then(res=>{
                if(res.code==='0'){
                    this.orderlist = res.data
                }
            })
        },
        //重置
        resetting(){
            this.seachinfo = {
                beginDate:'',
                endDate:'',
                state:'',
                productNameOrCode:''
            }
            this.page={
                current:1,
                size:10
            }
            this.value1 = ''
            this.getproduceTaskpage()
        },
        changedate(val){
            this.seachinfo.beginDate = moment(val[0]).format('YYYY-MM-DD')
            this.seachinfo.endDate = moment(val[1]).format('YYYY-MM-DD')
        },
        //搜索
        seachinfo1(){
           this.page.current =1
           this.getproduceTaskpage(this.seachinfo)
        },
        // 获取列表
        getproduceTaskpage(){
            let  obj = {...this.seachinfo,...this.page}
            produceTaskpage(obj).then(res=>{
                if(res.code==='0'){
                    res.data.records.map((item,index)=>{
                        item.index = index + 1
                        item.planStartTime = item.planStartTime.split(' ')[0]
                        item.planEndTime = item.planEndTime.split(' ')[0]
                        item.createTime = item.createTime.split(' ')[0]
                    })
                    this.tableData = res.data.records
                    this.pagesize = parseInt(res.data.current)
                    this.totals = parseInt(res.data.total)
                }
            })
        },
        handleCurrentChange(val){
            this.page.current=val
            this.getproduceTaskpage()
        },
        handleCurrentChange1(val){
            this.page1.current=val 
            this.panit()
        },
        add(){
            this.tit = '新增任务'
            this.dialogFormVisible = true
        },
        close(num){
            this.dialogFormVisible = false
           
            if(num==='0'){
                this.getproduceTaskpage()
            }
        },
        handleEdit(h,m){
             this.tit = '修改任务'
             this.$refs.promodal.getproduceTaskid(m)
            //  this.$refs.promodal.getProduceProgress(m)
             this.dialogFormVisible = true
        },
        //储存打印记录
        getproduceTaskPrint(info){
            produceTaskPrint(info).then(res=>{
                if(res.code==='0'){
                   
                }
            })
        },
        handlePrint (row) {
            let obj = JSON.parse(JSON.stringify(row))
            obj.produceTaskId =obj.id
            delete obj.createTime
            delete obj.id
            let arr =[]
            let arr1 = []
            arr.push(row)
            arr1.push(obj)
            this.getproduceTaskPrint(arr1)
            let routedata =  this.$router.resolve({path: '/download', query: { downlist:JSON.stringify(arr)} })
            window.open(routedata.href, '_blank');
        },
        handleDelete(h,m){
             this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                    produceTaskdelete(m).then(res=>{
                        if(res.code==='0'){
                            this.$message.success(res.msg)
                            this.getproduceTaskpage()
                        }
                    })
            })
            .catch(() => {});
           
        },
        // 锁定解锁
        handleUntie(h,m){
            var obj = {id:m,state:h}
            updateProduceTaskLockById(obj).then(res=>{
                if(res.code==='0'){
                    this.$message.success(res.msg)
                    this.getproduceTaskpage()
                }else{
                    this.$message.error(res.msg)
                }
            })
        },
        paritdelete(info){
             this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                  produceTaskPrintid({id:info.id}).then(res=>{
                      if(res.code==='0'){
                          this.$message.success(res.msg)
                          this.panit()
                      }else{
                            this.$message.error(res.msg)
                      }
                  })
            })
            .catch(() => {});
        }
    }
}
</script>

<style lang='less'>
    .production{
         .top{
                --height:50px;
                
                height: var(--height);
            
                margin-top: 10px;
                .datetime{
                    width: 100%;
                }
                .demo-ruleForm{
                    width: 100%;
                    display: flex;
                    justify-content: flex-end;
                }
            }
            .downPdf {
                justify-content: flex-end;
                display: flex;
                flex: 1;
            }

            // .elinput{
            //     width: 20%;
            //     margin: 0 2% 0 5px;
            // }
            .page{
                margin-top: 10px;
                float: right;
            }
            .el-pager li.active{
                background-color: #409baF !important;
                color: #fff;
            }
            .recordItem{
                display: flex;
                margin-bottom: 20px;
                flex-direction: column;
                border:1px solid #ccc;
                border-radius: 5px;
                .recordFirst {
                display: flex;
                color: #999;
                font-size: 13px;
                height: 25px;
                align-items: center;
                background: rgb(243,246,252);
                border-top-right-radius: 5px;
                border-top-left-radius: 5px;
                padding: 5px 10px;
                }
                .recordSecond {
                    display: flex;
                    align-items: center;
                    height: 30px;
                    padding: 5px 10px;
                     font-size: 14px;
                      
                }
                .el-icon-delete{
                    font-size: 15px;
                    cursor: pointer;
                }
                .el-icon-download{
                    font-size:20px;
                    color:rgb(67,191,187);
                    cursor: pointer;
                }
                .pdfName {
                           
                    flex: 1
                }
            }
           
            
    }
</style>
