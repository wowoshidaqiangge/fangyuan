<template>
  <div class="statistics">
    <div class="top">
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
      >
      <el-row type="flex" justify='end'>
        <div style="flex:1;margin-left:50px">
          <el-col :span="6">
            <el-form-item label="车间设备:" label-width="80px">
              <el-cascader
                v-model="value2"
                :options="devlist"
                :props="optionProps"
                @change="caschange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label="统计:"
              label-width="60px"
              prop="selectType"
            >
              <el-select
                v-model="formInline.selectType"
                @change="changesel"
                placeholder="统计"
              >
                <el-option
                  v-for="item in censuelist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期:" :label-width="formLabelWidth">
              <el-date-picker
                v-model="value1"
                type="daterange"
                @change="timechange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </div>
      
        <div style="margin:0 15px">
          <el-button
              type="add"
              icon="el-icon-search"
              @click="seachinfo"
              >搜索</el-button
            >
            <el-button
              type="success"
              icon="el-icon-refresh-right"
              @click="resetting"
              >重置</el-button
            >
            <el-button type="add" @click="excelexport"
              >EXCEL导出</el-button
            >
        </div>
      </el-row>
        
      </el-form>
    </div>
    <div class="echarttit">
      {{ optiontitle || echarttitle }}
    </div>
    <div class="bot">
      <el-tabs v-model="activeName" type="card" class="tab">
        <el-tab-pane label="图形" name="first">
          <v-chart
            ref="chart"
            :options="option"
            :auto-resize="true"
            class="chart"
            id="chart"
          />
        </el-tab-pane>
        <el-tab-pane label="表格" name="second">
          <el-table
            v-if="formInline.selectType === 'yield'"
            class="secondtab"
            :data="excellist"
            v-loading="isload"
            element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading"
            style="width: 100%"
          >
            <el-table-column
              prop="dateList"
              label="日期"
              align="center"
            />
            <el-table-column
              prop="yield"
              label="产量"
              align="center"
            />
          </el-table>
          <el-table
            v-if="formInline.selectType === 'run'&& !this.ismore"
            class="secondtab"
            :data="excellist"
            v-loading="isload"
            element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading"
            style="width: 100%"
          >
            <el-table-column
              prop="dateTime"
              label="时间"
              align="center"
            />
            <el-table-column
              prop="state"
              label="状态"
              align="center"
            />
          </el-table>
          <el-table
            v-if="formInline.selectType === 'run'&& this.ismore"
            class="secondtab"
            :data="excellist"
            v-loading="isload"
            element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading"
            style="width: 100%"
          >
            <el-table-column
              prop="time1"
              label="时间"
              align="center"
            />
            <el-table-column
              prop="offLength"
              label="关机时长(分钟)"
              align="center"
            />
            <el-table-column
              prop="onLength"
              label="开机时长(分钟)"
              align="center"
            />
            <el-table-column
              prop="runLength"
              label="运行时长(分钟)"
              align="center"
            />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  selectDeviceRunData,
  deviceTypeList,
  deviceList,
  deviceListByType
} from 'api/index';
import { export2Excel } from '../../../utils/util.js';
import moment from 'moment';
import Echarts from 'echarts';
export default {
  name: 'statistics',
  components: {},
  data() {
    return {
      value: '',
      value1: [],
      value2: [],
      option: {},
      formLabelWidth: '60px',
      optionProps: {
        // checkStrictly: true,
        value: 'id',
        label: 'title',
        children: 'deviceList'
      },
      formInline: {
        deviceTye: '',
        deviceId: '',
        selectType: 'yield',
        endDate: '',
        beginDate: ''
      },
      censuelist: [
        {
          value: 'yield',
          label: '产量'
        },
        {
          value: 'run',
          label: '运行状态'
        }
      ],
      devlist: [],
      casarr: [],
      echarttitle: '车间设备统计',
      echarttitlename: '',
      excellist: [], //表格数据
      optiontitle: '整表车间',
      optiontit:'',
      optiontname: '整表车间',
      ismore: false,
      unit: '',
      isload: false,
      activeName: 'first'
    };
  },
  computed: {},
  mounted() {
    this.unit = '单位:件';
    this.getDate();
    
    this.getdeviceListByType();
    //    this.getdeviceList()
    //    this.getdeviceTypeList()
  },
  methods: {
    getDate() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      let value1 = [start, end];
      this.$set(this.$data, 'value1', value1);
      this.timechange(value1);
    },
    showLoading() {},
    hideLoading() {},
    getoption() {
      this.option = {
        title: {
          text: this.unit,
          left: 40,
          top: 20,
          textStyle: {
            color: '#525f86',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '8%',
          top: '10%',
          containLabel: true
        },
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ['line', 'bar'] }
            // restore: {show: true},
            // saveAsImage: {show: true}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          x: 'right'
        },
        series: [
          {
            name: '',
            data: [],
            type: 'line',
            barWidth: 20,
            stack: '时长',
            smooth: true
          },
          {
            name: '开机时长',
            data: [],
            type: 'line',
            barWidth: 20,
            stack: '时长',
            smooth: true
          },
          {
            name: '运行时长',
            data: [],
            type: 'line',
            barWidth: 20,
            stack: '时长',
            smooth: true
          }
        ]
      };
    },
    caschange(e) {
     
      // this.casarr = e;
      let obj = {};
      obj = this.devlist.find(item => {
        return item.id === e[0];
      });
      obj.deviceList.map(item => {
        if (item.id === e[1]) {
          this.optiontit = item.title;
        }
      });
    },
    changesel(val) {
      this.excellist = [];
    },
    init() {
      this.formInline = {
        deviceTye: '',
        deviceId: '',
        selectType: 'yield'
      };
      
      this.value2 = this.casarr
      this.ismore = false;
      this.optiontitle = this.optiontname
      this.unit = '单位:件';
      this.getDate();
    },
    seachinfo() {
   
      if (this.formInline.selectType === 'yield') {
        this.optiontitle = this.optiontit + '产量';
         this.unit = '单位:件';
      } else {
        this.optiontitle = this.optiontit + '运行状态';
        this.unit = '单位:分钟';
      }
      this.getselectDeviceRunData();
    },
    // 重置
    resetting() {
      this.init();
      this.getselectDeviceRunData();
    },
    //表格导出
    excelexport() {
      let nowtime = moment(new Date()).format('YYYYMMDDhhmmss')
      if (this.formInline.selectType === 'yield') {
        //选择产量
        let column = [
          { prop: 'yield', label: '产量' },
          { prop: 'dateList', label: '日期' }
        ];
        export2Excel(column, this.excellist, `产量统计_${nowtime}`);
      } else {
        //状态统计
        if (this.ismore) {
          //多日
          let excellist = this.excellist;
         
          let column = [
            { prop: 'time1', label: '日期' },
            { prop: 'offLength', label: '关机时长' },
            { prop: 'onLength', label: '开机时长' },
            { prop: 'runLength', label: '运行时长' }
          ];
          export2Excel(column, excellist, `运行状态统计_${nowtime}`);
        } else {
          let excellist1 = this.excellist;
          if (excellist1.length > 0) {
            excellist1.forEach(item => {
              if (item.state === '0') {
                item.state = '关机';
              } else if (item.state === '1') {
                item.state = '开机';
              } else if (item.state === '2') {
                item.state = '运行';
              }
            });
            let column = [
              { prop: 'dateTime', label: '时间' },
              { prop: 'state', label: '运行状态' }
            ];
            export2Excel(column, excellist1, `运行状态统计_${nowtime}`);
          }
        }
      }
    },
    timechange(e) {
      console.log(e);
      this.formInline.beginDate = moment(e[0]).format('YYYY-MM-DD');
      this.formInline.endDate = moment(e[1]).format('YYYY-MM-DD');
      if (this.formInline.beginDate !== this.formInline.endDate) {
        this.ismore = true;
      } else {
        this.ismore = false;
      }
    },
    //获取图表数据
    getselectDeviceRunData() {
      this.formInline.deviceId = '';
      this.formInline.deviceTye = '';
      if (this.value2.length > 1) {
        let a = this.value2[1];
        this.formInline.deviceId = a;
      } else if ((this.value2.length = 1)) {
        let b = this.value2[0];
        this.formInline.deviceTye = b;
      }
      console.log(this.value2)
      selectDeviceRunData(this.formInline).then(res => {
        if (res.code === '0') {
          var nowtime = [];
          var num = [];
          var num1 = [];
          var num2 = [];
          // 选择产量
          if (this.formInline.selectType === 'yield') {
            this.isload = true;
            this.excellist = res.data;
            res.data.map(item => {
              nowtime.push(item.dateList);
              num.push(item.yield.toString());
            });
            this.isload = false;

            //渲染图表
            this.getoption();
            this.option.xAxis.data = nowtime;
            this.option.series[0].data = num;
            this.option.series[0].name = '产量';
          } else {
            //选择运行状态
            // 多日
            if (this.ismore) {
              // this.$message({
              //   message: '注意：运行状态的起始时间需要是同一天',
              //   type: 'warning'
              // });
              
              res.data[0].deviceRunTimeList.map(item => {
                  if (item.dateTime.split(' ')[1]) {
                      nowtime.push(item.dateTime.split(' ')[1]);
                  } else {
                      nowtime.push(item.dateTime);
                  }
              });
              res.data[0].deviceRunList.map(item => {
                  //关机时长
                  num.push(item.offLength.toString());
                  //开机时长
                  num1.push(item.onLength.toString());
                  //运行时长
                  num2.push(item.runLength.toString());
              });
              this.getoption();
              let hour;
              hour = res.data[0].dateList;
              
              this.option.xAxis.data = hour;
              this.option.series[0].name = '关机时长';
              this.option.series[0].data = this.hanld2(hour, nowtime, num);
              this.option.series[1].data = this.hanld2(hour, nowtime, num1);
              this.option.series[2].data = this.hanld2(hour, nowtime, num2);
              let att = []
              // att.push(...hour,...num,...num1,...num2)
              hour.map((m,n)=>{
                att.push({time1:m,offLength:this.hanld2(hour, nowtime, num)[n],onLength:this.hanld2(hour, nowtime, num1)[n],runLength:this.hanld2(hour, nowtime, num2)[n]})
              })
              this.excellist = att
              console.log(att)
            } else {
              // 图数据
              let state = [];
              let hour = [];
              let hou1 = [] // 辅助数据
              res.data[0].deviceRunList.map(item => {
                state.push(Number(item.state) + 1);
              });
              res.data[0].deviceRunList.map(item => {
                hour.push(item.dateTime.split(' ')[1]);
                hou1.push(item.dateTime.split(' ')[1]);
              });
              hou1.pop()
              this.drawStateChart(hour, state,hou1);
              // 表数据：
              this.isload = true;
              this.excellist = res.data[0].deviceRunList;
              let stateMsg = ['关机', '开机', '运行'];
              for (let i = 0; i < this.excellist.length; i++) {
                this.excellist[i].dateTime = this.excellist[
                  i
                ].dateTime.split(' ')[1];
                this.excellist[i].state =
                  stateMsg[this.excellist[i].state];
              }
              this.isload = false;
            }
          }
        }
      });
    },
    // 绘制阶梯状态图（柱状图模拟，无法切换折线/柱状）

    drawStateChart(hour, state,hour1) {
      
     
      let myChart = Echarts.init(document.getElementById('chart'));
      // 使用 aidState做填充，fakeState显示小线条
      myChart.showLoading({
        text: '正在加载...'
      });
      var aidState = [];
      var fakeState = [];
      let yax = [];
      for (let i = 0; i < state.length; i++) {
        fakeState[i] = state[i] * 0.01;
        aidState[i] = state[i] - fakeState[i];
        yax[i] = 0.01;
      }
      let option1 = {
        title: {
          show: Object.keys(state).length === 0,
          extStyle: {
            color: 'grey',
            fontSize: 20
          },
          text: '暂无数据',
          left: 'center',
          top: 'center'
        },
        tooltip: {
          // trigger: 'axis'
          show: false
        },
        toolbox: {
          show: false,
         
        },
        grid: {
          bottom: '10%',
          top: '10%',
          containLabel: false
        },

        xAxis: [
          {
          type: 'category',
          data: hour,
          boundaryGap: false,
          // axisTick: {
          //   show: false
          
            
          // },
          // axisLabel: {
          //   interval: 0,
          //   align: 'center'
          // }
        },
        {
          type: 'category',
          data: hour1,
          boundaryGap: true,
          axisTick: {
            show: false
            
          },
          axisLabel: {
            show: false
          }
        }
        ],
        yAxis: {
          type: 'value',
          interval: 1,
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            interval: 0,
            margin: 36,
            align: 'left',
            formatter: function(value) {
              debugger
              let stateMsg = ['状态','关机', '开机', '运行'];
              return (value = stateMsg[value]);
            }
          },
          splitLine: {
            interval: 0
          }
        },
        series: [
          {
              type: 'line',
              data:''
          },
          {
            name: '辅助',
            type: 'bar',
            data: aidState,
            stack: '设备状态值',
            xAxisIndex: 1,
            barWidth: '100%',
            itemStyle: {
              color: 'rgba(0,0,0,0)',
              barBorderColor: 'rgba(0,0,0,0.2)',
              borderType: 'dashed'
            }
          },
          {
            type: 'bar',
            name: '状态',
            data: fakeState,
            stack: '设备状态值',
            xAxisIndex: 1,
            barWidth: '100%',
            itemStyle: {
              color: function(params) {
                // build a color map as your need.
                var colors = ['#000','#737172', '#0096ff', '#259B24'];
                return colors[params.value * 100];
              }
            }
          }
        ]
      };
      myChart.hideLoading();
      myChart.setOption(option1, (window.onresize = myChart.resize));
    },
    // 处理图表数据格式
    hanld2(hour, time, data) {
      if (
        !(
          Array.isArray(time) &&
          Array.isArray(data) &&
          time.length === data.length
        )
      ) {
        return;
      }
      let result = [];
      let i = 0;
      hour.map((item, index) => {
        if (time.indexOf(item) === -1) {
          result.push('0');
        } else {
          result.push(data[i]);
          i++;
        }
      });
      return result;
    },
    // 车间设备
    getdeviceListByType() {
      deviceListByType().then(res => {
        if (res.code === '0') {
          if(res.data&&res.data[0].deviceList){
            this.devlist = res.data;
            this.value2 = [res.data[0].id,res.data[0].deviceList[0].id]
            this.casarr =[res.data[0].id,res.data[0].deviceList[0].id]
            this.optiontitle = res.data[0].deviceList[0].title+'产量'
            this.optiontit = res.data[0].deviceList[0].title
            this.optiontname = res.data[0].deviceList[0].title+'产量'
          }
        }else{
          this.$message.error(res.msg)
        }
        this.getselectDeviceRunData();
      });
    },
    // 获取设备列表
    // getdeviceList(){
    //     deviceList().then(res=>{
    //         if(res.code === '0'){
    //             this.deviceList = res.data
    //         }
    //     })
    // },
    // // 获取车间列表
    // getdeviceTypeList(){
    //     deviceTypeList().then(res=>{
    //         this.deviceTypeList = res.data
    //     })
    // },
    initEcharts() {
      let myChart = Echarts.init(this.$refs.chart);
      myChart.setOption(this.option);
    }
  }
};
</script>

<style lang="less">
.statistics {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .top {
    height: 45px;

    .mr10 {
      width: 20%;
    }
    .mr11 {
      margin-left: 4%;
    }
    .mr1 {
      float: right;
    }
    .mr2 {
      width: 25%;
    }
    .el-form-item__content {
      width: calc(100% - 80px);
      float: right;
    }
    .demo-form-inline {
      margin-top: 9px;
    }
  }
  .echarttit {
    text-align: center;
    font-size: 18px;
    letter-spacing: 1px;
    font-weight: 600;
    margin-bottom: -60px;
    line-height: 69px;
  }
  .bot {
    flex: 1;
    position: relative;
    .chart {
      width: 100%;
      height: 100%;
    }
    .el-tabs__header {
      border: none;
      .el-tabs__nav {
        border-bottom: 1px solid #e4e7ed;
        float: left;
        margin-left: 4%;
        .is-active {
          color: #fff;
          background-color: #409efe;
        }
      }
    }
    .tab {
      width: 100%;
      height: 100%;
      .el-tabs__content {
        height: 90%;
        .el-tab-pane {
          height: 100%;
        }
      }
    }
    .secondtab {
      width: 92%;
      margin: 0 4%;
    }
  }

  // .page{
  //     margin: 10px 0;
  //     float: right;
  // }
  // .el-pager li.active{
  //     background-color: #409baF !important;
  //     color: #fff;
  // }
}
</style>
