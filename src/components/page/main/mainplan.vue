<template>
  <div class="mainplan">
    <el-row :gutter="20" type="flex" justify="end">
      <el-col :span="4" class="grop">
        <el-input placeholder="请输入名称或编号" prefix-icon="el-icon-search" v-model="deviceNameOrCode"></el-input>
      </el-col>
      <div class="grop">
        <el-button class="searchBtn" type="add" @click="searchmain()">查询</el-button>
        <el-button type="success" icon="el-icon-refresh-right" @click="resetting">重置</el-button>
      </div>
    </el-row>
    <div class="bot">
      <el-table :data="tableData" stripe :height="screenWidth" style="width: 100%">
        <el-table-column v-for="(item, index) in columnlist" :key="index" :prop="item.prop" :label="item.label"
          align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">点检项配置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination :background="true" :current-page.sync="pagesize" @current-change="handleCurrentChange"
        layout="total, prev, pager, next" :total="totals"></el-pagination>
    </div>
    <planModal :dialogFormVisible.sync="dialogFormVisible" @close="close" :tit="tit" ref="planmodal" />
  </div>
</template>

<script>
import { maintenancepage, maintenancedelete } from 'api/main1';
import planModal from './planmodal';
export default {
  name: 'mainplan',
  components: {
    planModal
  },
  data() {
    return {
      deviceNameOrCode: '',
      columnlist: [
        { prop: 'index', label: '序号' },
        { prop: 'model', label: '规格型号' },
        { prop: 'configResult', label: '配置结果' },
        // { prop: 'deviceName', label: '设备名称' },
        // { prop: 'deviceNumer', label: '设备编号' },
        // { prop: 'deviceModel', label: '规格型号' },
        // { prop: 'toTypeName', label: '设备类型' },
        // { prop: 'category', label: '保养类别' },
        // { prop: 'period', label: '保养周期' },
        // { prop: 'dateTime', label: '保养时间' },
        // { prop: 'assumeUserName', label: '担当人' },
        // { prop: 'dutyUserName', label: '责任人' },
        // { prop: 'createTime', label: '新增时间' },
        // { prop: 'remark', label: '备注' }
      ],
      tableData: [],
      screenWidth: document.body.clientHeight - 215 + 'px',
      page: {
        current: 1,
        size: 10
      },
      totals: 0,
      pagesize: 1,
      dialogFormVisible: false,
      tit: ''
    };
  },
  computed: {},
  created() {
    this.getmaintenancepage();
  },
  methods: {
    searchmain() {
      this.getmaintenancepage()
    },
    resetting() {
      this.deviceNameOrCode = '';
      this.page.current = 1;
      this.getmaintenancepage();
    },
    getmaintenancepage() {
      maintenancepage({ ...this.page, deviceNameOrCode: this.deviceNameOrCode }).then(res => {
        if (res.code === '0') {
          res.data.map((item, index) => {
            // item.period = item.period == 'month' ? '月' : '年';
            // item.createTime = item.createTime.split(' ')[0];
            // if (item.dateTime) {
            //   item.dateTime = item.dateTime + ':00';
            // }

            item.index = index + 1;
          });
          // this.pagesize = parseInt(res.data.current);
          // this.totals = parseInt(res.data.total);
          this.tableData = res.data;
        }
      });
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getmaintenancepage();
    },

    close(num) {
      this.dialogFormVisible = false;
      // if (num === '0') {
      //     this.getmaintenancepage();
      // }
    },
    // 修改
    handleEdit(h, m) {
      this.tit = '点检项配置';
      // this.$refs.planmodal.getmaintenanceid({ id: m.id });
      this.dialogFormVisible = true;
    }
    // 删除
    // handledistribute(h, m) {
    //     // 二次确认删除
    //     this.$confirm('确定要删除吗？', '提示', {
    //         type: 'warning'
    //     })
    //         .then(() => {
    //             maintenancedelete(m).then(res => {
    //                 if (res.code === '0') {
    //                     this.$message.success('删除成功');
    //                     this.getmaintenancepage();
    //                 }
    //             });
    //         })
    //         .catch(() => {});
    // }
  }
};
</script>

<style lang="less">
.mainplan {
  width: 100%;
  height: 100%;
  .grop {
    height: 50px;
    // margin: 20px 20px;
  }
  .page {
    margin-top: 10px;
    float: right;
  }
  .el-pager li.active {
    background-color: #409baf !important;
    color: #fff;
  }
}
</style>
