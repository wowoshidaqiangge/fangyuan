<template>
  <div class="eqperformance">
       <div class="top">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">

            <el-form-item label="车间设备:" class="handle-select mr10 mr11" label-width="80px" >
                    <el-cascader
                        v-model="value2"
                        :options="devlist"
                    
                        clearable>
                    </el-cascader>
             </el-form-item>
            
             <el-form-item label="日期:" class="handle-select mr10" :label-width="formLabelWidth">
                  <el-date-picker
                    v-model="value1"
                    type="year"
                    placeholder="选择年">
                    </el-date-picker>
             </el-form-item>
             <el-form-item label="日期:" class="handle-select mr10" :label-width="formLabelWidth">
                  <el-date-picker
                    v-model="value3"
                    type="month"
                    placeholder="选择月">
                    </el-date-picker>
             </el-form-item>
            
              <el-form-item class="handle-select mr1">
                  <el-button type="success" icon="el-icon-refresh-right" @click="resetting">重置</el-button>
              </el-form-item>
                <el-form-item class="handle-select mr1">
                  <el-button type="add" icon="el-icon-search" @click="seachinfo">搜索</el-button>
              </el-form-item>
             </el-form>
          </div>
          <div class="bot">
              <Charts ref="charts" :devicelist='devicelist' :numlist='numlist'/>
          </div>
  </div>
</template>

<script>
import {selectDeviceWorkTimeList} from 'api/index'
import Charts from './charts'
export default {
    name: 'eqperformance',
    components:{
        Charts
    },
    data() {
        return {
            formInline:{},
            value1:'',
            value2:'',
            value3:'',
            devlist:[],
            formLabelWidth:'60px',
            devicelist:[],
            numlist:[]
        }
    },
    created(){
        this.getselectDeviceWorkTimeList()
    },
    methods: {
        getselectDeviceWorkTimeList(){
            var that = this
            selectDeviceWorkTimeList().then(res=>{
                let a =[]
                let b = []
                let c= []
                let d = []
                if(res.code==='0'){
                    res.data.map(item=>{
                        a.push(item.dateList)
                        b.push(item.onLength)
                        c.push(item.runLength)
                    })
                    d.push({name:'生成时长',type:'line',barWidth:'',data:b},{name:'开机时长',type:'line',barWidth:'',data:c})
                    that.$nextTick(()=>{ 
                        that.$refs.charts.getxAxis(a)
                        that.$refs.charts.getseries(d)
                        that.$refs.charts.getoption()
                    })
             
                }
            })
        },
        seachinfo(){

        },
        resetting(){
          
        }
    }
}
</script>


<style lang='less'>
    .eqperformance{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
         .top{
                height: 45px;
          
                .mr10{
                  width: 20%;
                  
                }
                .mr11{
                    margin-left: 4%;
                }
                .mr1{
                    float: right;
                }
                .el-form-item__content{
                    width: calc(100% - 80px);
                }
                .demo-form-inline{
                    margin-top: 9px;
                }
            }
            .bot{
               flex: 1; 
            }
    }
</style>
