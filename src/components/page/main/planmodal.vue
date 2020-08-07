<template>
  <div class="planmodal">
    <el-dialog :title="tit" :destroy-on-close="isclose" :visible.sync="dialogFormVisible" :before-close="close"
      width="50%" center>
      <el-row>
        <el-form ref="form">
          <el-col :span="24" align="right">
            <el-button @click="add(0)">添加点检项</el-button>
          </el-col>
          <el-col :span="24">
            <!-- <el-table :data="tableData" :show-header="false" row-key="id" default-expand-all
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
              <el-table-column label prop="name"></el-table-column>
              <el-table-column align="right">
                <template slot-scope="scope">
                  <el-button size="mini" v-if="!scope.row.parent" @click="add(1,scope)">+
                  </el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table> -->
            <el-tree :data="tableData" :props="defaultProps" @node-click="handleNodeClick" default-expand-all
              :expand-on-click-node="false" node-key="id">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <el-button v-if="!node.parent.parent" type="text" size="mini" @click="() => add(1,data)">+
                  </el-button>
                  <el-button class="el-icon-delete" size="mini" @click="() => handleDelete(node, data)">
                  </el-button>
                </span>
              </span>
            </el-tree>
          </el-col>
          <el-col :span="24">
            <el-form-item label="巡检指导书上传：">
              <el-upload class="upload-demo" :action="host" :data="ossParams" :on-success="handleSuccess1"
                :before-upload="beforeUpload" :before-remove="beforeRemove" :file-list="fileList1">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="点检部位图示上传：">
              <el-upload :action="host" list-type="picture-card" :data="ossParams" :on-exceed="exceed" :limit="limit"
                :before-upload="beforeUpload" :on-success="handleSuccess2" :file-list="fileList2">
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                  <img class="el-upload-list__item-thumbnail" :src="uploadForm.pictureAddress" alt />
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close()">取 消</el-button>
        <el-button type="primary" @click="marksure('form')" :loading="sureload">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="30%" :title="title" :visible.sync="innerVisible" top="25vh" center>
      <!-- <el-checkbox-group v-model="checkList" @change="checkChange">
        <el-checkbox label="复选框 A"></el-checkbox>
        <el-checkbox label="复选框 B"></el-checkbox>
        <el-checkbox label="复选框 C"></el-checkbox>
      </el-checkbox-group> -->
      <el-form :model="addList">
        <el-form-item prop="label" style="width:100%">
          <el-input v-model="addList.label"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerClose">取 消</el-button>
        <el-button type="primary" @click="addItem('form')" :loading="sureload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { inspectionConfig } from 'api/main1';
import { onenet } from 'api/onenet';
import moment from 'moment';
export default {
  name: 'planmodal',
  props: {
    dialogFormVisible: {
      type: Boolean
    },
    tit: {
      type: String
    }
  },
  data() {
    return {
      data: [
        {
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }
      ],
      host: 'http://thingcom-dianliuji.oss-cn-hangzhou.aliyuncs.com',
      ossParams: {
        OSSAccessKeyId: '',
        policy: '',
        signature: '',
        expire: '',
        key: '', // key后面有用，先默认设空字符串
        success_action_status: '200' // 默认200
      },
      limit: 1,
      fileList1: [],
      fileList2: [],
      uploadForm: {
        fileName: '',
        fileAddress: '',
        pictureName: '',
        pictureAddress: ''
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      isclose: true,
      sureload: false,
      tableData: [
        {
          id: '1',
          date: '2016-05-02',
          label: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id: '2',
          date: '2016-05-04',
          label: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          id: '3',
          date: '2016-05-01',
          label: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          children: [{
            id: '3-1',
            date: '2016-05-01',
            label: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            id: '3-2',
            date: '2016-05-01',
            label: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }]
        }, {
          id: '4',
          date: '2016-05-03',
          label: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      title: '',
      // checkList: [],
      addList: {
        id: '',
        name: '',
        label: '',
      },
      innerVisible: false,
      a: '',
      nowRow: {},
      loadNodeMap: new Map()
    };
  },
  created() { },
  mounted() {
    // let arr = []
    // this.tableData.map((item, index) => {
    //   arr.push(item.id)
    //   if (item.children && Array.isArray(item.children)) {
    //     item.children.map((v, h) => {
    //       arr.push(v.id)
    //     })
    //   }
    // })
    // arr.sort((a, b) => {
    //   return a - b
    // })
    // console.log(arr)
  },
  watch: {},
  computed: {},
  methods: {
    loadNextNode(tree, treeNode, resolve) {
      // console.log(tree, treeNode, resolve)
    },
    handleNodeClick(data) {
      // console.log(data);
    },
    init() {
      this.checkList = [];
      this.addList = {}
    },
    innerClose() {
      this.init();
      this.innerVisible = false;
    },
    close() {
      this.init();
      this.$emit('close');
    },
    // 添加巡检配置弹窗
    add(num, data) {
      this.nowRow = data
      // debugger
      console.log(data)
      // this.a = data
      this.innerVisible = true;
      num ? (this.title = '点检项') : (this.title = '添加点检项');
    },
    // 添加巡检配置确认
    addItem() {
      let nowId = ''
      if (this.title == '添加点检项') {
        nowId = `${parseInt(this.tableData[this.tableData.length - 1].id) + 1}`
        let obj = { id: nowId, label: `${nowId}. ${this.addList.label}`, children: [] }
        this.tableData.push(obj)
      } else if (this.title == '点检项') {
        if (this.nowRow.children.id) {
          nowId = `${this.nowRow.id.split('-')[0]}-${parseInt(this.nowRow.id.split('-')[1]) + 1}`
        } else {
          nowId = `${this.nowRow.id}-1`
          this.$set(this.nowRow, 'children', []);
        }
        const newChild = { id: nowId, label: this.addList.label, children: [] };
        this.nowRow.children.push(newChild);
      }
      console.log(this.tableData)
      this.init();
      this.innerVisible = false;
    },
    // 删除巡检配置
    handleDelete(node, data) {
      // if (row.id) {
      //   row.id = row.id.toString();
      //   let fId = Number(row.id.charAt(0));
      //   let cId = Number(row.id.charAt(1));
      //   let item = this.tableData[fId].children[cId];
      //   let index = this.tableData[fId].children.indexOf(item);
      //   this.tableData[fId].children.splice(index, 1);
      // } else {
      // }
      data.id = data.id.toString();
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    // 上传成功回调
    handleSuccess1(res, file) {
      let a = this.host + '/' + this.ossParams.key;
      this.uploadForm.fileName = file.name;
      this.uploadForm.fileAddress = a;
    },
    handleSuccess2(res, file) {
      // debugger
      let a = this.host + '/' + this.ossParams.key;
      this.uploadForm.pictureName = file.name;
      this.uploadForm.pictureAddress = a;
    },
    // 上传之前的回调
    beforeUpload: async function (file) {
      await this.backOssInfo(file);
    },
    beforeRemove(file, fileList) {
      // 二次确认删除
      // return this.$confirm(`确定移除 ${file.name}？`);
      this.fileList1 = [];
      this.uploadForm.fileName = '';
      this.uploadForm.fileAddress = '';

    },
    exceed(files, fileList) {
      this.$message.error('最多只能上传一张图片！');
    },
    // 巡检图提交
    imgPreview: async function (file, fileList) {
      await this.backOssInfo(file).then((file) => {
        let a = this.host + '/' + this.ossParams.key;
        this.uploadForm.pictureName = file.name;
        this.uploadForm.pictureAddress = a;
      })
    },
    // 巡检图删除
    handleRemove(file) {
      console.log(this.fileList2, file)
      let index = this.fileList2.indexOf(file);
      this.fileList2.splice(index, 1);
      this.uploadForm.pictureName = '';
      this.uploadForm.pictureAddress = '';
    },
    // 获取oss签名数据
    backOssInfo: function (file) {
      // debugger
      let fileName = file.name.substring(file.name.lastIndexOf('.') + 1);
      return new Promise(
        function (resolve, reject) {
          onenet.ossInfo().then(
            function (response) {
              if (response === undefined) {
                this.$message.error(response.error);
                reject();
              } else {
                this.ossParams.OSSAccessKeyId = response.accessid;
                this.ossParams.policy = response.policy;
                this.ossParams.signature = response.signature;
                this.ossParams.key = sessionStorage.getItem('userId') + this.randomWord(true, 9, 12) + '.' + fileName;
                resolve();
              }
            }.bind(this)
          );
        }.bind(this)
      );
    },
    randomWord(randomFlag, min, max) {
      let str = '';
      let range = min;
      let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      // 随机产生
      if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
      }
      for (let i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
      }
      return str;
    },


    // 提交表单
    marksure(form) {
      let obj = { model: '', ...this.uploadForm, contentJson: this.tableData }
      inspectionConfig(obj).then(res => {
        if (res.code === '0') {
          this.$message.success('执行成功');
          this.close()
        }
      })
    },

    // checkChange() {
    //   console.log(this.checkList);
    // }
  }
};
</script>


<style lang='less'>
.planmodal {
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
    .el-upload:first-child {
      width: 80px;
      height: 32px;
      border: none;
    }
  }
  .el-col {
    margin-bottom: 20px;
  }
  .el-tree {
    .el-tree-node {
      padding: 2px 0;
      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
        .el-button {
          font-size: 15px;
          margin-left: 0px;
          padding: 5px 15px;
        }
      }
    }
  }
}
</style>
