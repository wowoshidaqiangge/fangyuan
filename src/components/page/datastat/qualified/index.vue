<template>
  <div class="qualified">
    <div class="top">
      
        <el-form
          :model="seachinfo"
          ref="seachinfo"
          class="demo-ruleForm"
        >
        <el-row type="flex" justify='end'>
          
        
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
          <Charts ref="charts1"  />
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
              prop="time1"
              label="时间"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="rate0"
              label="整表一组合格率"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="rate1"
              label="整表二组合格率"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="rate2"
              align="center"
              label="整表三组合格率"
            ></el-table-column>
             <el-table-column
              prop="rate3"
              align="center"
              label="整表四组合格率"
            ></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { selectProduceWorkRate, deviceTypeList, getProduceQualifiedRate} from 'api/index';
import { export2Excel } from '../../../../utils/util.js';
import moment from 'moment';
import Charts from './../charts';
export default {
  name: 'qualified',
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
      echarttitle: '整表车间生产合格率图',
      tableData: [],
      // options: [],
      echarttitlename: '',
    
      isload: false,
      option:{},
      series:[]
    };
  },
  created() {
    // this.getselectProduceWorkRate();
    this.getProduceQualifiedRate()
  },
  methods: {
   
    getProduceQualifiedRate(){
        getProduceQualifiedRate(this.seachinfo).then(res=>{
            if(res.code==='0'){
              let arr = []
              let arr1 = []
              if(res.data&&res.data.length>0){
                  res.data.map((item,index)=>{
                    if(index < res.data.length-1){
                      item.produceQualifiedRate.map(v=>{
                        v.createTime = v.createTime.split(' ')[0]
                        v.qualifiedRate = v.qualifiedRate
                      })
                      arr1.push(item)
                    }else{
                      item.produceQualifiedRateDateList.map(v=>{
                        arr.push(v.createTime.split(' ')[0])
                      })
                    }
                  })
                  arr1.map(v=>{
                    v.list = []
                    arr.map((m,i)=>{
                      if(v.produceQualifiedRate.findIndex(h=> h.createTime===m)==-1){
                        v.list.push({createTime:m,qualifiedRate:"-"}) 
                      }else {
                        v.list.push(v.produceQualifiedRate.filter(c=>{return c.createTime === m})[0])
                      }
                    })
                  })
                
                  this.$nextTick(() => {
                    this.$refs.charts1.getxAxis(arr);
                    this.$refs.charts1.getseries1(arr1);
                    this.$refs.charts1.getoption();
                  });
                  let arr3 = []
                  arr.map((v,t)=>{
                    let obj = {}
                    arr3.push({time1:v})
                    arr1.map((h,i)=>{
                      arr3[t][`name${i}`] = h.deptName
                      h.list.map((m,n)=>{
                        if(m.createTime===v){
                          arr3[t][`rate${i}`] = m.qualifiedRate
                        }
                      })
                    })
                  })
                  this.tableData = arr3
              }else{
                 this.$refs.charts1.chartclear()
              }
          }else{
            this.$message.error(res.msg)
          }
        })
    },
    resetting() {
      this.seachinfo = {
        beginDate: '',
        endDate: '',
        deptId: ''
      };
      this.value1 = '';
      this.getProduceQualifiedRate();
    },
    seachinfo1() {
      this.getProduceQualifiedRate();
    },
    changedate(val) {
      this.seachinfo.beginDate = moment(val[0]).format('YYYY-MM-DD');
      this.seachinfo.endDate = moment(val[1]).format('YYYY-MM-DD');
    },
    //表格导出
    excelexport() {
      let nowtime = moment(new Date()).format('YYYYMMDDhhmmss')
      let column = [
        { prop: 'time1', label: '时间' },
        { prop: 'rate0', label: '整表一组合格率' },
        { prop: 'rate1', label: '整表二组合格率' },
        { prop: 'rate2', label: '整表三组合格率' },
        { prop: 'rate3', label: '整表四组合格率' },
      ];
      export2Excel(column, this.tableData, `${this.echarttitle}_${nowtime}`);
    }
  }
};
</script>

<style lang="less">
.qualified {
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
