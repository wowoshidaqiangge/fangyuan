<template>
  <div class="poper">
    <div class="top">
      
        <el-form
          :model="seachinfo"
          ref="seachinfo"
          class="demo-ruleForm"
        >
        <el-row type="flex" justify='end'>
          
          <el-col :span="3" style="margin:0 20px">
            <el-form-item
              label="车间"
              label-width="50px"
              prop="deptId"
            >
              <el-select
                v-model="seachinfo.deptId"
                @change="changesel"
                placeholder="请选择车间"
              >
                <el-option
                  v-for="item in options"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label prop="value1">
              <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                @change="changedate"
                class="datetime"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <div style="margin:0 15px">
            <el-button
                type="add"
                icon="el-icon-search"
                @click="seachinfo1"
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
    <div class="echarttit">{{ echarttitle }}</div>
    <div class="bot">
      <el-tabs v-model="activeName" type="card" class="tab">
        <el-tab-pane label="图形" name="first">
          <Charts ref="charts1" :unit="unit" id='popchart'/>
        </el-tab-pane>
        <el-tab-pane label="表格" name="second">
          <el-table
            class="secondtab"
            :data="tableData"
            v-loading="isload"
            element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading"
            style="width: 100%"
          >
            <el-table-column
              prop="taskNumber"
              label="生产工单号"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="planDay"
              label="计划时长(天)"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="realDay"
              align="center"
              label="完成时长(天)"
            ></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { selectProduceWorkRate, deviceTypeList } from 'api/index';
import { getProduceDeptList } from 'api/main';
import { export2Excel } from '../../../utils/util.js';
import moment from 'moment';
import Charts from './charts';

export default {
  name: 'poperformance',
  components: {
    Charts
  },
  data() {
    return {
      value1: '',
      formInline: {},
      formLabelWidth: '80px',
      seachinfo: {
        beginDate: '',
        endDate: '',
        deptId: ''
      },
      activeName: 'first',
      echarttitle: '车间生产绩效',
      tableData: [],
      options: [],
      echarttitlename: '',
      unit: '单位:天',
      isload: false
    };
  },
  created() {
    this.seachinfo.beginDate = moment().subtract(1, "weeks").format('YYYY-MM-DD'),
    this.seachinfo.endDate = moment().format('YYYY-MM-DD'),
    this.value1 = [moment().subtract(1, "weeks").format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    this.getProduceDeptList();
  },
  methods: {
    changesel(val) {
      debugger
      let obj = {};
      obj = this.options.find(item => {
        return item.deptId === val;
      });
      this.echarttitlename = obj.deptName;
    },
    //获取车间列表
    getProduceDeptList() {
      getProduceDeptList().then(res => {
        if (res.code === '0') {
          this.options = res.data;
          if(res.data&&res.data.length>0){
            this.seachinfo.deptId = res.data[0].deptId
            this.echarttitlename = res.data[0].deptName
          }
        }
        this.getselectProduceWorkRate();
      });
    },
    getselectProduceWorkRate() {
      this.isload = true;
      selectProduceWorkRate(this.seachinfo).then(res => {
        let a = [];
        let b = [];
        let c = [];
        let d = [];
        this.isload = false;
        if (res.code === '0') {
          this.tableData = res.data;
          if(res.data.length>0){
            res.data.map(item => {
              a.push(item.taskNumber);
              b.push(item.planDay);
              c.push(item.realDay);
            });
            d.push(
              { name: '计划天数', type: 'bar', data: b },
              { name: '实际天数', type: 'bar', data: c }
            );
            this.$nextTick(() => {
              this.$refs.charts1.getxAxis(a);
              this.$refs.charts1.getseries(d);
              this.$refs.charts1.getoption();
               
            });
          }else{
              this.$refs.charts1.chartclear()
              // document.getElementById('popchart').init()
          }
          if (this.echarttitlename) {
                this.echarttitle = this.echarttitlename + '生产绩效';
          }
        }
      });
    },
    resetting() {
      this.seachinfo = {
        beginDate: moment().subtract(1, "weeks").format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        deptId: this.options[0].deptId
      };
      this.value1 = [moment().subtract(1, "weeks").format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
      this.changesel(this.seachinfo.deptId)
      this.getselectProduceWorkRate();
    },
    seachinfo1() {
      this.getselectProduceWorkRate();
    },
    changedate(val) {
      this.seachinfo.beginDate = moment(val[0]).format('YYYY-MM-DD');
      this.seachinfo.endDate = moment(val[1]).format('YYYY-MM-DD');
    },
    //表格导出
    excelexport() {
      let nowtime = moment(new Date()).format('YYYYMMDDhhmmss')
      let column = [
        { prop: 'taskNumber', label: '生产工单号' },
        { prop: 'planDay', label: '计划时长' },
        { prop: 'realDay', label: '完成时长' }
      ];
      export2Excel(column, this.tableData, `${this.echarttitle}_${nowtime}`);
    }
  }
};
</script>

<style lang="less">
.poper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .top {
    height: 50px;
    margin-top: 10px;

    .datetime {
      width: 100%;
    }
    .bot {
      .el-form-item__content {
        // width: calc(100% - 80px);
        float: right;
      }
    }

    // .demo-form-inline{
    //     margin-top: 9px;
    // }
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
}
</style>
