<template>
  <div class="promoadl">
    
    <el-dialog :title="tit" width="60%" :visible.sync="dialogFormVisibledit" :before-close='beforclose' center>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="任务详情" name="first">
                 <el-row>
                <el-form :model="form" ref='form'>
                    <el-col :span="11">
                            <el-form-item label="订单编号" :label-width="formLabelWidth" prop='orderCode'>
                                    <el-select v-model="form.orderCode" disabled @change='changesel' placeholder="请选择">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.id"
                                        :label="item.orderCode"
                                        :value="item.id">
                                        </el-option>
                                    </el-select>
                            </el-form-item>
                        </el-col>
                    <el-col :span="11">
                            <el-form-item label="任务单号" :label-width="formLabelWidth" prop='taskNumber'>
                                    <el-input v-model="form.taskNumber"  disabled autocomplete="off"></el-input>
                            </el-form-item>
                    </el-col>
                    
                    <el-col :span="24">
                            <el-form-item label="产品编码" :label-width="formLabelWidth" prop='productId'>
                                <el-select v-model="form.productId" disabled @change='changeselect' placeholder="请选择">
                                    <el-option
                                        v-for="item in prolist"
                                        :key="item.id"
                                        :label="item.productCode"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                    </el-col>
                    <p>
                            <el-col :span="11">
                                <el-form-item label="产品名称" :label-width="formLabelWidth" prop='productName'>
                                        <el-input v-model="form.productName" disabled autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="规格型号" :label-width="formLabelWidth" prop='model'>
                                        <el-input v-model="form.model" disabled autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                    </p>
                    <el-col :span="24" >
                            <el-table
                                :data="tableData2"
                                style="width: 100%">
                                <el-table-column
                                        v-for="(item,index) in columnList"
                                        :key='index'
                                        :prop="item.prop"
                                        :label="item.label"
                                        align="center"
                                >
                                </el-table-column>
                              
                        </el-table> 
                    </el-col> 
                    </el-form> 
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="生产进度" name="second">
                  <el-row>
                <el-form :model="formpro" ref='form'>
                    <el-col :span="11">
                            <el-form-item label="订单编号" :label-width="formLabelWidth" prop='orderCode'>
                                    <el-select v-model="formpro.orderCode" disabled @change='changesel' placeholder="请选择">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.id"
                                        :label="item.orderCode"
                                        :value="item.id">
                                        </el-option>
                                    </el-select>
                            </el-form-item>
                        </el-col>
                    <el-col :span="11">
                            <el-form-item label="任务单号" :label-width="formLabelWidth" prop='taskNumber'>
                                    <el-input v-model="formpro.taskNumber"  disabled autocomplete="off"></el-input>
                            </el-form-item>
                    </el-col>
                    
                    <el-col :span="24">
                            <el-form-item label="产品编码" :label-width="formLabelWidth" prop='productId'>
                                <el-select v-model="formpro.productId" disabled @change='changeselect' placeholder="请选择">
                                    <el-option
                                        v-for="item in prolist"
                                        :key="item.id"
                                        :label="item.productCode"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                    </el-col>
                    <p>
                            <el-col :span="11">
                                <el-form-item label="产品名称" :label-width="formLabelWidth" prop='productName'>
                                        <el-input v-model="formpro.productName" disabled autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="规格型号" :label-width="formLabelWidth" prop='model'>
                                        <el-input v-model="formpro.model" disabled autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                    </p>
                    <el-col :span="24" >
                            <el-table
                                :data="tableData3"
                                style="width: 100%">
                                <el-table-column
                                        v-for="(item,index) in columnList1"
                                        :key='index'
                                        :prop="item.prop"
                                        :label="item.label"
                                        align="center"
                                >
                                </el-table-column>
                        </el-table> 
                    </el-col> 
                    </el-form> 
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="修改任务" name="third" v-if='!isnow'>
                <el-row>
                <el-form :model="form" ref='form'>
                    <el-col :span="11">
                            <el-form-item label="订单编号" :label-width="formLabelWidth" prop='orderCode'>
                                    <el-select v-model="form.orderCode" disabled @change='changesel' placeholder="请选择">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.id"
                                        :label="item.orderCode"
                                        :value="item.id">
                                        </el-option>
                                    </el-select>
                            </el-form-item>
                        </el-col>
                    <el-col :span="11">
                            <el-form-item label="任务单号" :label-width="formLabelWidth" prop='taskNumber'>
                                    <el-input v-model="form.taskNumber" disabled autocomplete="off"></el-input>
                            </el-form-item>
                    </el-col>
                    
                    
                    <el-col :span="24">
                            <el-form-item label="产品编码" :label-width="formLabelWidth" prop='productId'>
                                <el-select v-model="form.productId" disabled @change='changeselect' placeholder="请选择">
                                    <el-option
                                        v-for="item in prolist"
                                        :key="item.id"
                                        :label="item.productCode"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                    </el-col>
                    <p>
                            <el-col :span="11">
                                <el-form-item label="产品名称" :label-width="formLabelWidth" prop='productName'>
                                        <el-input v-model="form.productName" disabled autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="规格型号" :label-width="formLabelWidth" prop='model'>
                                        <el-input v-model="form.model" disabled autocomplete="off"></el-input>
                                </el-form-item>
                            </el-col>
                    </p>
                    <el-col :span="24" >
                            <el-table
                                :data="tableData2"
                                style="width: 100%">
                                <el-table-column
                                        v-for="(item,index) in columnList"
                                        :key='index'
                                        :prop="item.prop"
                                        :label="item.label"
                                        align="center"
                                >
                                </el-table-column>
                                <el-table-column label="操作"  align="center">
                                <template slot-scope="scope">
                                    <el-button
                                            type="info"
                                            plain
                                            icon="el-icon-edit"
                                            @click="handleEdit(scope.$index, scope.row)"
                                     ></el-button>
                                    
                                </template>
                            </el-table-column>
                        </el-table> 
                    </el-col> 
                    </el-form> 
                </el-row>
            </el-tab-pane>
           
        </el-tabs>
       
         <el-dialog
            width="50%"
            title="物料修改"
            :visible.sync="innerVisible"
            append-to-body>
                <el-row>
                        <el-form :model="form1"  ref="form1">
                            <el-col :span="11">
                                <el-form-item label="物料名称" :label-width="formLabelWidth" class="formitem formitem1" prop="itemName">
                                        <el-input v-model="form1.itemName" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="物料编码" :label-width="formLabelWidth" class="formitem formitem1" prop="itemCode">
                                        <el-input v-model="form1.itemCode" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="规格型号" :label-width="formLabelWidth" class="formitem formitem1" prop="model">
                                        <el-input v-model="form1.model" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="材质" :label-width="formLabelWidth" class="formitem formitem1" prop="material">
                                        <el-input v-model="form1.material" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                    <el-col :span="11">
                                        <el-form-item label="订单量" :label-width="formLabelWidth" class="formitem formitem1" prop="yieid">
                                                <el-input v-model="form1.yieid" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="计划生产量" :label-width="formLabelWidth" class="formitem formitem1" prop="planYield">
                                        <el-input v-model="form1.planYield" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="计划采购量" :label-width="formLabelWidth" class="formitem formitem1" prop="planBuyYield">
                                        <el-input v-model="form1.planBuyYield" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="计划时间" :label-width="formLabelWidth" >
                                    <el-date-picker
                                        style='width:100%'
                                        @change='changetime'
                                        v-model="value2"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"> 
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            
                        </el-form>
                    </el-row>
                <div slot="footer" class="dialog-footer">
                        <el-button @click="close1">取 消</el-button>
                        <el-button type="primary" @click="marksure1">确 定</el-button>
                </div>
        </el-dialog>
        <div slot="footer" class="dialog-footer" v-if='!isnow'>
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="marksure('form')">确 定</el-button>
        </div>
    </el-dialog>

  </div>
</template>

<script>
import { produceTaskid,produceTaskput,getProduceProgress } from 'api/index'
import moment from 'moment'
import {orderlist,productlist,getItemListByProductId} from 'api/main'
export default {
    name: 'proeditmodal',
  
    props:{
        dialogFormVisibledit:{
            type:Boolean
        },
        tit:{
            type:String
        }
    },
    data() {
        return {
            activeName:'first',
            form: {
                productName: '',
                orderId: '',
                taskNumber: '',
                productId: '',
                planYield:'',
                model: '',
                taskItemList:[]
            },
            form1:{
                itemCode:'',
                itemName:'',
                model:'',
                material:'',
                yieid:'',
                planYield:'',
                planBuyYield:'',
                planStartTime:'',
                planEndTime:''
            },
            formpro:{

            },
            tableData3:[],
            innerVisible:false,
            value2:[],
            formLabelWidth: '100px',
            options:[],
            tableData2:[],
            columnList:[
                {prop:'itemCode',label:'物料编码'},
                {prop:'itemName',label:'物料名称'},
                {prop:'model',label:'规格型号'},
                {prop:'material',label:'材质'},
                {prop:'yieid',label:'订单量'},
                {prop:'planYield',label:'计划生产量'},
                {prop:'planBuyYield',label:'计划采购量'},
                {prop:'planStartTime',label:'开始时间'},
                {prop:'planEndTime',label:'结束时间'},
            ],
            columnList1:[
                {prop:'itemCode',label:'物料编码'},
                {prop:'itemName',label:'物料名称'},
                {prop:'model',label:'规格型号'},
                {prop:'material',label:'材质'},
                {prop:'yieid',label:'订单量'},
                {prop:'planYield',label:'计划生产量'},
                {prop:'produceCount',label:'实际生产量'},
                {prop:"produceProgress",label:'进度'},
                {prop:'createTime',label:'报工时间'},
            ],
            prolist:[],
            yieid:'',
            produceTaskId:'',
            isnow:false
        }
    },
    created(){
       this.getorderlist()
       this.getproductlist()
    },
    methods: {
        // 生产进度进度
        getProduceProgress(id){
          
            getProduceProgress(id).then(res=>{
                debugger
                res.data.planList.map((item)=>{
                       item.yieid = id.orderYield
                       item.createTime = item.createTime.split(' ')[0]
                   })
                   this.tableData3 = res.data.planList
                   this.formpro = res.data
            })
        },
        handleClick(){

        },
        //修改物料
        handleEdit(h,m){
           
            this.value2 = [m.planStartTime,m.planEndTime]
            this.form1 = JSON.parse(JSON.stringify(m))
            this.innerVisible = true
        },
        close1(){
            this.innerVisible = false
        },
        marksure1(){
            this.tableData2.map((item,index)=>{
               if(item.id ===this.form1.id){
                  this.tableData2[index].planYield = this.form1.planYield
                  this.tableData2[index].planBuyYield = this.form1.planBuyYield
                  this.tableData2[index].planEndTime = this.form1.planEndTime
                  this.tableData2[index].planStartTime = this.form1.planStartTime
               }
           })
           
            this.$forceUpdate()
            this.innerVisible = false
        },
       
        //查询物料列表
        getItemListByProductId(id){
            getItemListByProductId(id).then(res=>{
                if(res.code==='0'){
                    res.data.map((item,index)=>{
                        if(!item.planYield){
                            item.planYield = this.yieid
                        }
                        if(!item.planBuyYield){
                            item.planBuyYield = 0
                        }
                        if(!item.planStartTime){
                            item.planStartTime = ''
                            item.planEndTime = ''
                        }
                        item.yieid = this.yieid
                    })
                    this.tableData2 = res.data
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
            
            this.getItemListByProductId({productId:val,produceTaskId:this.produceTaskId})
        },
        // 产品编号列表
        getproductlist(){
            productlist().then(res=>{
                if(res.code==='0'){
                    this.prolist = res.data
                }
            })
        },
        // 自动生成任务单号
        changesel(val){
            let obj = {};
            obj = this.options.find((item)=>{  
                    return item.id === val;  
                });
            this.form.taskNumber = 'RW_' + obj.orderCode 
            this.yieid = obj.planYield
            this.form.planYield = obj.planYield
             // 切换订单重置产品编码
            this.form.productId = ''
            this.tableData2 = []
        },
       // 获取订单编号列表
       getorderlist(){
           orderlist().then(res=>{
               if(res.code==='0'){
                   this.options = res.data
               }
           })
       },
       changetime(h){
           this.form1.planStartTime = moment(h[0]).format('YYYY-MM-DD')
           this.form1.planEndTime = moment(h[1]).format('YYYY-MM-DD')
       },
       close(num){
           this.init()
           this.$emit('close',num)
       },
       getproduceTaskid(id){
           //判断是不是生产zhong
           if(id.state=='3'){
               this.isnow = true
           }else{
               this.isnow = false
           }
           produceTaskid(id).then(res=>{
               if(res.code==='0'){
                   res.data.planList.map((item)=>{
                       item.yieid = id.orderYield
                       item.createTime = item.createTime.split(' ')[0]
                   })
                   this.yieid = id.orderYield
                   this.produceTaskId = id.id
                   this.tableData2 = res.data.planList
                   this.form = res.data
               }
           })
       },
       marksure(form){
           let arr =[]
            this.tableData2.map(item=>{
                arr.push({itemId:item.id,
                planYield:item.planYield,
                itemCode:item.itemCode,
                planBuyYield:item.planBuyYield,
                planStartTime:item.planStartTime,
                planEndTime:item.planEndTime})
            })
            this.form.taskItemList = arr
            this.$refs[form].validate((valid) => {
                if (valid) {
                        produceTaskput(this.form).then(res=>{
                            if(res.code==='0'){
                                this.$message.success(res.msg)
                                this.close('0')
                            }
                        })
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
            this.produceTaskId = ''
            this.value2 = []
            this.activeName = 'first'
       }
    }
}
</script>


<style lang='less' scpoed>
    .promoadl{
       
    }
 .el-dialog{
            border-radius: 5px;
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
