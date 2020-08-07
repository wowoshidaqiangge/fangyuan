<template>
  <div class="production">
    <el-row type="flex" justify="end" class="pageheader">
      <el-col :span="5" class="pageheader_item">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changedate"
          class="datetime"
        >
        </el-date-picker
      ></el-col>
      <el-col :span="2" class="pageheader_item">
        <el-select v-model="searchInfo.state" placeholder="全部状态">
          <el-option
            v-for="item in orderlist"
            :key="item.enumKey"
            :label="item.enumValue"
            :value="item.enumKey"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3" class="pageheader_item">
        <el-input
          placeholder="请输入任务单号"
          v-model="searchInfo.taskNumber"
          class="elinput"
        >
        </el-input
      ></el-col>
      <div class="pageheader_item">
        <el-button
          type="add"
          icon="el-icon-search"
          @click="handleSearch"
          >查询</el-button
        >
        <el-button
          type="info"
          icon="el-icon-refresh-right"
          @click="handleReset"
          >重置</el-button
        >
      </div>
    </el-row>
    <div class="tablebox">
      <el-table
        :data="tableData"
        stripe
        border
        :header-cell-style="{
          background: '#fddd9b66 !important',
          color: '#333'
        }"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              :data="props.row.taskPlanList"
              stripe
              border
              style="width: 100%"
              lazy
              :header-cell-style="{
                background: 'oldlace !important',
                color: '#666'
              }"
            >
              <el-table-column type="expand">
                <template slot-scope="props2">
                  <el-table
                    :data="props2.row.reportList"
                    stripe
                    border
                    lazy
                    :header-cell-style="{
                      background: '#f0f9eb !important',
                      color: '#888'
                    }"
                  >
                    <el-table-column
                      v-for="(item, index) in columnlist3"
                      :key="index"
                      :width="item.width"
                      :prop="item.prop"
                      :label="item.label"
                      align="center"
                    ></el-table-column>
                  </el-table>
                  <br />
                  <el-table
                    :data="props2.row.qualityList"
                    stripe
                    border
                    lazy
                    :header-cell-style="{
                      background: '#f0f9eb !important',
                      color: '#888'
                    }"
                  >
                    <el-table-column
                      v-for="(item, index) in columnlist4"
                      :key="index"
                      :width="item.width"
                      :prop="item.prop"
                      :label="item.label"
                      align="center"
                    ></el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column
                v-for="(item, index) in columnlist2"
                :key="index"
                :width="item.width"
                :prop="item.prop"
                :label="item.label"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="produceDuration"
                label="生产用时"
                align="center"
                width="100"
              >
                <template slot-scope="scope">
                  <span
                    >{{
                      scope.row.produceDuration
                        ? scope.row.produceDuration + ' day'
                        : ''
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="produceTaskPlanState"
                label="状态"
                width="130"
                align="center"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.state === 1">{{
                    scope.row.produceTaskPlanState
                  }}</span>
                  <span
                    style="color:#E6A23C"
                    v-if="scope.row.state === 2"
                    >{{ scope.row.produceTaskPlanState }}</span
                  >
                  <span
                    style="color:#409EFF"
                    v-if="scope.row.state === 3"
                    >{{ scope.row.produceTaskPlanState }}</span
                  >
                  <span
                    style="color:#67C23A"
                    v-if="scope.row.state === 4"
                    >{{ scope.row.produceTaskPlanState }}</span
                  >
                  <span
                    style="color:#F56C6C"
                    v-if="scope.row.state === 5"
                    >{{ scope.row.produceTaskPlanState }}</span
                  >
                  <span
                    style="color:#909399"
                    v-if="scope.row.state === 6"
                    >{{ scope.row.produceTaskPlanState }}</span
                  >
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in columnlist1"
          :key="index"
          :width="item.width"
          :prop="item.prop"
          :label="item.label"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="produceDuration"
          label="生产用时"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <span
              >{{
                scope.row.produceDuration
                  ? scope.row.produceDuration + ' day'
                  : ''
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="produceTaskState"
          label="状态"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.state === 1">{{
              scope.row.produceTaskState
            }}</span>
            <span
              style="color:#E6A23C"
              v-if="scope.row.state === 2"
              >{{ scope.row.produceTaskState }}</span
            >
            <span
              style="color:#409EFF"
              v-if="scope.row.state === 3"
              >{{ scope.row.produceTaskState }}</span
            >
            <span
              style="color:#67C23A"
              v-if="scope.row.state === 4"
              >{{ scope.row.produceTaskState }}</span
            >
            <span
              style="color:#F56C6C"
              v-if="scope.row.state === 5"
              >{{ scope.row.produceTaskState }}</span
            >
            <span
              style="color:#909399"
              v-if="scope.row.state === 6"
              >{{ scope.row.produceTaskState }}</span
            >
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
  </div>
</template>

<script>
import { produceTaskStateList } from 'api/index';
import { getProduceRetrospect } from 'api/product';

import moment from 'moment';
import { mapState } from 'vuex';
export default {
  name: 'retroSpect',
  components: {},
  computed: {
    ...mapState(['screenHeight'])
  },
  watch: {
    // 监听高度
    // screenHeight(newVal, oldVal) {
    //   if (newVal) {
    //     this.screenCusHeigth = newVal - 300 + 'px';
    //   }
    // }
  },
  data() {
    return {
      pagesize:1,
      totals:0,
      orderlist: [],
      dateValue: '',
      searchInfo: {
        beginDate: '',
        endDate: '',
        state: '',
        taskNumber: ''
      },
      page:{
        current:1,
        size:10
      },
      loading: false,
      tableData: [],
      columnlist1: [
        // { prop: 'deviceTypeName', label: '部门' },
        { prop: 'taskNumber', label: '任务单号' },
        { prop: 'productName', label: '产品名称' },
        // { prop: 'productCode', label: '产品型号' },
        { prop: 'model', label: '规格型号', width: '120' },
        { prop: 'planYield', label: '计划生产量', width: '100' },
        {
          prop: 'taskStartTime',
          label: '实际开始时间'
        },
        {
          prop: 'taskFinishTime',
          label: '实际完成时间'
        },
        { prop: 'createTime', label: '新增时间' },
        { prop: 'createUser', label: '下单人', width: '100' }
     
      ],
      columnlist2: [
      
        { prop: 'taskNumber', label: '工单号' },
     
        { prop: 'planYield', label: '计划生产量', width: '130' },
        { prop: 'nowCount', label: '实际生产量', width: '130' },
        {
          prop: 'taskStartTime',
          label: '实际开始时间'
        },
        { prop: 'taskFinishTime', label: '实际完成时间' }
      
      ],
      columnlist3: [
    
        { prop: 'reportNumber', label: '报工流水号' },
        { prop: 'reportUser', label: '生产人员', width: '260' },
        { prop: 'produceCount', label: '生产数量', width: '260' },
        {
          prop: 'totalCount',
          label: '累计产量',
          width: '260'
        },
        { prop: 'createTime', label: '报工时间' }
      ],
      columnlist4: [
       
        { prop: 'qualityNumber', label: '质检流水号' },
        { prop: 'produceCount', label: '已生产数量', width: '130' },
        { prop: 'qualityCount', label: '已核验数量', width: '130' },
        { prop: 'unqualifiedCount', label: '不良数', width: '130' },
        {
          prop: 'qualifiedRate',
          label: '合格率',
          width: '130'
        },
        { prop: 'remark', label: '质检概要', width: '130' },
        { prop: 'qualityUserName', label: '质检员', width: '130' },
        { prop: 'createTime', label: '质检时间' }
      ]
    };
  },

  created() {
    this.init();
  },
  methods: {
    init() {
      this.getproduceTaskStateList();
      this.getProduceRetrospectData();
    },
    // API:查询状态列表
    getproduceTaskStateList() {
      produceTaskStateList().then(res => {
        if (res.code === '0') {
          this.orderlist = res.data;
        }
      });
    },
    // API:获取数据
    getProduceRetrospectData() {
      this.loading = true;
      let obj = {...this.page,...this.searchInfo}
      getProduceRetrospect(obj).then(res => {
        if (res.code === '0') {
          
          this.tableData = res.data.records;
          this.pagesize = parseInt(res.data.current)
          this.totals = parseInt(res.data.total)
          this.loading = false;
        }
      });
    },
    // 处理日期参数
    changedate(val) {
      this.searchInfo.beginDate = moment(val[0]).format('YYYY-MM-DD');
      this.searchInfo.endDate = moment(val[1]).format('YYYY-MM-DD');
    },
    //搜索
    handleSearch() {
      this.getProduceRetrospectData();
    },
    //重置
    handleReset() {
      this.searchInfo = {
        beginDate: '',
        endDate: '',
        state: '',
        taskNumber: ''
      };
      this.dateValue = '';
      this.getProduceRetrospectData();
    },
    //分页
    handleCurrentChange(val){
      this.page.current =val
      this.getProduceRetrospectData()
    }
  }
};
</script>

<style lang="less">
.production {
  .pageheader {
    margin: 15px 0;
    .pageheader_item {
      margin: 0 15px;
    }

    .datetime {
      width: 100%;
    }

    .el-button {
      margin-right: 10px;
      height: 32px;
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
