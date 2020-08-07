<template>
  <div class="charts">
      <v-chart ref='chart' :options="option" :auto-resize="true" id='vchart' :data-empty="dataEmpty" class="chart"/>
      <div class="popno" v-if='isshow'>暂无数据</div>
  </div>
</template>

<script>
// import { selectDeviceMaintainList } from 'api/index'
import Echarts from 'echarts';
export default {
    name: 'charts',
    props:{
        numlist:{
            type:Array
        },
        devicelist:{
            type:Array
        },
        unit:{
            type:String
        }
    },
    data() {
        return {
            option:{
            },
            isshow:false,
            series:[],
            xAxisarr:[],
            dataEmpty:true

        }
    },
    created(){

    },
    methods: {
        chartclear(){
             this.$refs.chart.clear()
             this.isshow = true
        },
        showLoading(){
        },
        hideLoading(){},
        getoption(){
            this.isshow = false
            this.option={
                    title: {
                        text: this.unit,
                        left:30,
                        top:0,
                        fontSize:12,
                        textStyle:{
                            color:'#000000'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        // formatter: `{b0}<br/>{a0}: {c0}% <br />{a1}:  {c1}%<br />{a2}:  {c2}%<br />{a3}:  {c3}%<br />`
                    },
                    grid: {
                        left: '3%',
                        right: '3%',
                        bottom: '8%',
                        top: '7%',
                        containLabel:true
                    },
                    toolbox: {
                        show: true,
                        feature: {
                         
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap:true,
                        data: this.xAxisarr
                    },
                    yAxis: {
                        type: 'value',
                        x:'right',
                    },
                    series: this.series
               }
            },
            getseries(obj){
                let series=[];
                if(Array.isArray(obj)){
                     obj.forEach(item=>{
                     series.push({
                           name: item.name,
                           type: item.type,
                           data: item.data,
                            stack:'总量',
                            barMaxWidth: 30
                       });
                })
                 this.series = series
                }
            },
            getseries1(obj){
                let series=[];
                if(Array.isArray(obj)){
                     obj.forEach(item=>{
                     let arr = []
                     item.list.map(v=>{
                         debugger
                         if(isNaN(parseInt(v.qualifiedRate))){
                             arr.push("-")
                         }else{
                             arr.push(parseInt(v.qualifiedRate))
                         }
                         
                     })
                     series.push({
                         name: item.deptName,
                         type:"line",
                         data: arr,
                      });
                })
                    this.series = series
                }
            },
            getxAxis(arr){
                this.xAxisarr = arr
            }
    }
}
</script>


<style lang='less'>
    .charts{
        width: 100%;
        height: 100%;
        .chart{
            width: 100%;
            height: 100%;
        }
        .popno{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            line-height: 300px;
            text-align: center;
            color: #999;
        }
    }

</style>
