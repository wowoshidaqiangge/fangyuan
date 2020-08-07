<template>
  <div class="recordmodal">
    <el-dialog :title="tit" :destroy-on-close="isclose" :visible.sync="dialogFormVisible" :before-close="close"
      width="50%" center>
      <el-row>
        <el-form ref="form">
          <el-col :span="24">
            <el-table :data="tableData" :show-header="false" row-key="id" default-expand-all>
              <el-table-column label prop="name"></el-table-column>
              <el-table-column align="right">
                <template slot-scope="scope">
                  <span v-if="scope.row.id" style="color:green;"><i class="el-icon-circle-check" />通过</span>
                  <span v-else style="color:red;"><i class="el-icon-circle-close" />未通过</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <el-form-item label="现场照片：">

            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="点检问题描述：">
              <el-input type="textarea" :rows="3" resize="none"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close()">取 消</el-button>
        <el-button type="primary" @click="marksure('form')" :loading="sureload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mainrecordDetail, mainrecordput } from 'api/main1';
import moment from 'moment';
export default {
  name: 'recordmodal',

  props: {
    dialogFormVisible: {
      type: Boolean
    },
    tit: {
      type: String
    },
    ifEdt: {
      type: Boolean
    }
  },
  data() {
    return {
      isclose: true,
      sureload: false,
      deptlist: [],
      rolelist: [],
      devicelist: [],
      input: '',
      param: {},
      form: {
        deviceName: '',
        id: '',
        deviceNumer: '',
        toType: '',
        dateTime: '',
        content: ''
      },
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          children: [
            {
              id: 10,
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            },
            {
              id: 11,
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            }
          ]
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      formLabelWidth: '90px',
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      timelist: [
        { value: 'year', label: '按年' },
        { value: 'month', label: '按月' }
      ],
      userlist: []
    };
  },
  created() {
    //   this.getdeviceToTypeList()
    //   this.getuserPage()
  },
  mounted() { },
  watch: {},
  methods: {
    //查看详情
    getmainrecordid(id) {
      mainrecordDetail(id).then(res => {
        if (res.code === '0') {
          // this.form = res.data;
          // this.form.monthTime = res.data.date.slice(0, 7);
          // console.log(this.form);
        }
      });
    },
    close(num) {
      this.init();
      this.$emit('close', num);
    },
    //初始化
    init() {
      this.form = {
        deviceName: '',
        id: '',
        deviceNumer: '',
        toType: '',
        dateTime: '',
        content: ''
      };
    },
    marksure() {
      this.param.id = this.form.id;
      this.param.content = this.form.content;
      mainrecordput(this.param).then(res => {
        if (res.code === '0') {
          this.$message.success(res.msg);
          this.close('0');
        }
      });
    },
    beforclose() {
      this.init();
      this.$emit('close', false);
    }
  }
};
</script>

<style lang="less">
.recordmodal {
  .el-dialog {
    border-radius: 5px;
  }
  .el-dialog__header {
    background-color: #409baf;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    .el-dialog__title {
      color: #fff;
      letter-spacing: 2px;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
  }
  .dialogTitle {
    margin-left: 20px;
    font-size: 15px;
    font-weight: 600;
    // color: #409BAF
  }
  .dialog-footer {
    text-align: end;
  }
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-table {
      .el-icon-arrow-right {
        display: none;
      }
      .el-table__row > td {
        border: none;
      }

      .el-table::before {
        height: 0px;
      }
    }
  }
  .el-select {
    width: 100%;
  }
  // .el-col {
  //     margin-bottom: 20px;
  // }
}
</style>
