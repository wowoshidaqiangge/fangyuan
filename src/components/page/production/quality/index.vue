<template>
  <div class="quality">
       <div class="top">
          <FormCreate :rule="rule" v-model="fApi" :option="options" @value1-change='changedate' @xaboy-click="seachinfo1" @reset-click="resetting"/>
     </div>
     <div class="bot">
           <el-table
                :data="produceTaskQualitylist"
                stripe
                border>
                 <el-table-column
                    v-for="(item,index) in columnlist"
                    :key="index"
                    :width="item.width"
                    :prop="item.prop"
                    :label="item.label"
                    align="center"
                >
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
  </div>
</template>

<script>
import {produceTaskQuality } from 'api/product'

export default {
    name: 'quality',
    components:{
       
    },
    computed:{
       
    },
    watch: {
       
    },
    mounted(){
           
    },
    data() {
        return {
            fApi:{},
            options:{
                submitBtn:false,
                
            },
            rule:[
                 {
                    type: 'el-row',
                    native: true,
                    props: { type: 'flex',justify:'end'},
                    children: [
                        {
                            type: 'el-col',
                            props: { span: 5, "style":'margin-right:15px'},
                            children: [
                                {
                                    type:'datePicker',
                                    field:'value1',
                                    props: {
                                        "type": "daterange",
                                        "startPlaceholder":"开始日期",
                                        "endPlaceholder":"结束日期",
                                        "style":'width:100%'
                                    },
                                    emit: ['change'],
                                },
                            ]
                        },
                        {
                            type: 'el-col',
                            props: {span: 3,},
                            children: [
                                {
                                    type:'input',
                                    field:'productNameOrTaskNumber',
                                    props: {'placeholder':'产品名称或任务单', },
                                },
                            ]
                        },
                        {
                            type: 'div',
                            props: {"style":'margin:0 15px'},
                            children: [
                                {
                                    type:'el-button',
                                    props:{type:'add',icon:"el-icon-search"},
                                    col:{ span:12},
                                    children: ['搜索'],
                                    emit: ['click'],
                                    emitPrefix: 'xaboy',
                                },
                                {
                                    type:'el-button',
                                    props:{ type:'success', icon:"el-icon-refresh-right" },
                                    col:{ span:12 },
                                    children: ['重置'],
                                    emit: ['click'],
                                    emitPrefix: 'reset',
                                },
                            ]
                        },
                    ]
                }
            ],
            seachinfo:{
            },
            value1:[],
            page:{
                current:1,
                size:10
            },
            produceTaskQualitylist:[],
            pagesize:1,
            totals:0,
            columnlist:[
                {prop:'index',label:'序号'},
                {prop:'qualityNumber',label:'质检流水号'},
                {prop:'taskNumber',label:'任务单'},
                {prop:'productName',label:'产品名称'},
                {prop:'model',label:'规格型号'},
                {prop:'planYield',label:'计划生产量'},
                {prop:'produceCount',label:'已生产量'},
                {prop:'qualityCount',label:'已核验量'},
                {prop:'unqualifiedCount',label:'不良数'},
                {prop:'qualifiedRate',label:'合格率'},
                {prop:'assignName',label:'操作员'},
                {prop:'qualityUser',label:'质检员'},
                {prop:'createTime',label:'创建时间'},
                {prop:'remark',label:'质检概要'},
            ]
        }
    },
    created(){
       this.getproduceTaskQuality()
       
    },
    methods: {
        changedate(val){
           
        },
        resetting(){
             this.fApi.resetFields()
             this.getproduceTaskQuality()
        },
        seachinfo1(info){
            this.page.current =1
            this.getproduceTaskQuality(this.fApi.formData())
            console.log(this.fApi.formData(),info)
        },
        // 数据列表
        getproduceTaskQuality(info){
            let obj
            if(info){
                 obj = {...this.page,productNameOrTaskNumber:this.fApi.formData().productNameOrTaskNumber,beginDate:Array.isArray(this.fApi.formData().value1)?this.fApi.formData().value1[0]:'',
            endDate:Array.isArray(this.fApi.formData().value1)?this.fApi.formData().value1[1]:''}
            }else{
                 obj = {...this.page}
            }
            
            produceTaskQuality(obj).then(res=>{
                if(res.code==='0'){
                    res.data.records.map((item,index)=>{
                        item.index = index + 1
                        item.createTime = item.createTime.split(' ')[0]
                    })
                    this.pagesize = parseInt(res.data.current)
                    this.totals = parseInt(res.data.total)
                    this.produceTaskQualitylist = res.data.records
                }
            })
        },
        // 
        handleCurrentChange(val){
            this.page.current = val
            this.getproduceTaskQuality()
        }
    }
}
</script>
<style lang='less'>
        .quality{
             .top{
                height: 50px;
                margin-top: 10px;
                .datetime{
                    width:100%
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
