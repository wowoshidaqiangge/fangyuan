<template>
  <div class="mainstatistics">
       <div class="top">
           <el-col>
            <el-form :inline="true" :model="terms" ref="termsForm">
                <el-col :span="4">
                    <el-form-item label="选择年份" prop="yearParam">
                        <el-date-picker
                               v-model="terms.yearParam"
                                @change="changeyear"
                                type="year" format="yyyy"
                                placeholder="选择年">
                        </el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :span="4">
                    <el-form-item label="选择月份" prop="monthParam">
                        <el-date-picker
                        v-model="terms.monthParam"
                                  @change="changemon"
                                type="month" format="MM"
                                placeholder="选择月">
                        </el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :span="5">
                    <el-form-item label="选择设备" prop='deviceId' >
                        <el-select v-model="terms.deviceId" clearable  placeholder="选择设备">
                            <el-option v-for="item in deviceList" :label="item.name" :key='item.id' :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="5">
                    <el-form-item label="维保类型" prop='state'>
                        <el-select v-model="terms.state" clearable  placeholder="选择维保类型">
                            <el-option v-for='item in stateArr' :label="item.label" :value="item.value"
                                       :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="4" class="btns">
                    <el-form-item>
                        <el-button type="danger" @click="onSubmit">查询</el-button>
                        <el-button type="primary" @click="onReset">重置</el-button>
                        <!-- <el-button type="success" @click="handleExport">导出报告</el-button> -->
                    </el-form-item>
                </el-col>
            </el-form>
        </el-col>
       </div>
       <p class="titimg">
            <span><img src="~@/assets/img/suc.png"/> 已保养</span>
            <span><img src="~@/assets/img/error.png"/> 未保养</span>
            <span><img src="~@/assets/img/repair.png"/> 未检修</span>
            <span><img src="~@/assets/img/circle.png"/> 已检修</span>
       </p>
      <div class="bot">
           <el-table
            :data="tableData"
            height="510"
            border
            v-loading='isload'
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            style="width: 100%">
            <el-table-column
                prop="deviceName"
                label="名称"
                width="180">
            </el-table-column>
             <el-table-column
                v-for="(item,index) in columnlist"
                :key="index"
                :index='index'
                :prop="item.prop"
                :label="item.label"
                align="center"
                >
                <template slot-scope="scope">
                    <img  v-if="scope.row.deviceMaintainList[scope.column.index]&&(scope.row.deviceMaintainList[scope.column.index].state.split(',').findIndex(v=> v==1)!==-1)" src="~@/assets/img/suc.png"/>
                    <img  v-if="scope.row.deviceMaintainList[scope.column.index]&&(scope.row.deviceMaintainList[scope.column.index].state.split(',').findIndex(v=> v==2)!==-1)" src="~@/assets/img/error.png"/>
                    <img  v-if="scope.row.deviceMaintainList[scope.column.index]&&(scope.row.deviceMaintainList[scope.column.index].state.split(',').findIndex(v=> v==3)!==-1)" src="~@/assets/img/repair.png"/> 
                    <img  v-if="scope.row.deviceMaintainList[scope.column.index]&&(scope.row.deviceMaintainList[scope.column.index].state.split(',').findIndex(v=> v=='4')!==-1)" src="~@/assets/img/circle.png"/>
                </template>
            </el-table-column>
        </el-table>
      </div>
  </div>
</template>

<script>
import { selectDeviceMaintainData,deviceList } from 'api/index'
import moment from 'moment'
export default {
    name: 'mainstatistics',
    data() {
        return {
            tableData:[],
            columnlist:[],
            deviceList:[],
            isload:false,
            terms: {
                    yearParam: '',
                    monthParam: '',
                    deviceId: '',
                    state: ''
                },
             stateArr: [{label: '未保养', value: '1'}, {label: '已保养', value: '2'}, {
                    label: '未维修',
                    value: '3'
                }, {label: '已维修', value: '4'}],
            list:[
                    {date:'03',
                        devicelist:[{
                            name:'生产1',
                            statelist:{state:1,num:4}
                        }]
                    },
                    {date:'04',
                        devicelist:[{
                            name:'生产1',
                            statelist:{state:1,num:4}
                        },{
                            name:'生产2',
                            statelist:{state:3,num:4}
                        }]
                    }
                ]
        }
    },
    created(){
        this.getselectDeviceMaintainData()
        this.getDeviceList()
        // this.getlist()
    },
    methods: {
      getlist(){
          var year = ['01','02','03','04','05','06','07','08','09','10','11','12']
          var scx = ['生产1','生产2']
          var arr =[]
          year.map((item,index)=>{
            var a =  (this.list.findIndex(v=>v.date===item)!=-1)
            this.list.map(h=>{
                if(h.date===item){
                    h.value = `state${index}`
                    arr.push(h)
                }
            })
            if(!a){
               arr.push({date:item,value:`state${index}`})
            }
          })
          console.log(arr)
          var arr2 = []
          
          scx.map((i,index)=>{
              var arr3 = []
              var obj = {}
             arr.map((m,index1)=>{
                
                  if(m.devicelist&&Array.isArray(m.devicelist)){
                       
                            
                        var a1 =  (this.list.findIndex(v=>v.date===m.date)!=-1)
                        m.devicelist.forEach(element => {
                            if(element.name===i){
                                 if(!a1){
                                      obj[`state${index1}`] = ''
                                 }else{
                                     obj[`state${index1}`] = element.statelist.state
                                 }
                                
                            }else{
                               
                                    obj[`state${index1}`] = ''
                                
                               
                            }
                        });
                        
                       
                       
                    }else{
                        obj[`state${index1}`] = ''
                    }
                 
               arr3.push(obj)
             })
             arr2.push(arr3)
          })
          console.log(arr2)
         
      },
      getselectDeviceMaintainData(){
          this.isload = true
          selectDeviceMaintainData(this.terms).then(res=>{
               this.isload = false
              if(res.code==='0'){
                let arr = []
                var arr1 = {}
                this.columnlist= []
                res.data.map((item,index) => {
                    arr1 = {}
                    //处理数据格式
                    item.deviceMaintainList.map((h,j)=>{
                        if(index=='0'){
                            this.columnlist.push({label: h.dateTime,prop:`state${j}`})
                        }
                        arr1[`dateTime${j}`] = h.dateTime
                        arr1[`state${j}`] = h.state
                    })
                        arr.push({ ...item,...arr1})
                    });
                    this.$nextTick(()=>{
                        this.tableData = arr
                    })
                    // console.log(this.columnlist,arr)
                }
          })
        },
        getDeviceList(){
                deviceList().then(res=>{
                    if(res.code==='0'){
                        this.deviceList = res.data
                    }
                })
        },
        changeyear(i){
          this.terms.yearParam =  moment(i).format('YYYY')
            
        },
        changemon(i){
            this.terms.monthParam = moment(i).format('MM')
        },
        onSubmit(){
            this.getselectDeviceMaintainData()
        },
        onReset(){
            this.terms= {
                    yearParam: '',
                    monthParam: '',
                    deviceId: '',
                    state: ''
                }
            this.getselectDeviceMaintainData()
        }
    }
}
</script>


<style lang='less'>
    .mainstatistics{
        width: 100%;
        height: 100%;
        display: flex;
        padding: 0 5px;
        flex-direction: column;
        .top{
            padding-left: 5px;
        }
        .el-form-item__content{
            
            .el-date-editor{
                width: 120px;
            }
            .el-select{
                width: 140px;
            }
            
        }
        .el-table .cell{
            display: flex;
            align-items: center;
            justify-content: center;
            img{
                width: 18px;
                margin: 1px;
            }
        }
        .titimg{
            display: flex;
            padding-bottom: 10px;
            padding-left: 5px;
            span{
                display: flex;
                align-items: center;
                height: 30px;
                line-height: 30px;
                margin-right: 15px;
                img{
                    width: 20px;
                    margin-right: 5px;
                }
            }
        }
        .bot{
            // flex: 1;
            // overflow: auto;
            .is-scrolling-left{
                height: 471px !important;
            }
            .is-scrolling-right{
                 height: 471px !important;
            }
            .is-scrolling-middle{
                 height: 471px !important;
            }
        }
    }
</style>
