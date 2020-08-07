<template>
  <div class="productmodal">
    <el-dialog
      :title="tit"
      :destroy-on-close="isclose"
      :visible.sync="dialogFormVisible"
      width="50%"
      :before-close="beforclose"
      center
    >
      <el-row>
        <el-form
          id="addProduct"
          :model="form"
          ref="form"
          :rules="rules"
        >
       
          <el-col :span="11">
            <el-form-item
              label="产品名称"
              :label-width="formLabelWidth"
              class="formitem formitem1"
              prop="productName"
            >
              <el-input v-model="form.productName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="规格型号"
              :label-width="formLabelWidth"
              class="formitem formitem1"
              prop="model"
            >
              <el-input v-model="form.model"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
              <el-form-item
              label="基本单位"
              :label-width="formLabelWidth"
              prop="unit"
            >
              <el-select v-model="form.unit" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>
    
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button
          type="primary"
          @click="marksure('form')"
          :loading="sureload"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  producetasklist,
  getListByIds,
  productadd,
  productid,
  productput
} from 'api/main';
import { deviceTypeList } from 'api/index';

export default {
  name: 'productmodal',

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
      isclose: true,
      sureload: false,
      rolelist: [],
      form: {
        productName: '',
        productCode: '',
        model: '',
        productItemList: []
      },
      rules:{
          productName: [
            { required: true, message: '请输入', trigger: 'change' }
          ],
          unit: [
            { required: true, message: '请输入', trigger: 'change' }
          ],
          model: [
            { required: true, message: '请输入', trigger: 'change' }
          ],
      },
      formLabelWidth: '90px',
     
      options:[
        {
          value: '个',
          label: '个'
        }, {
          value: '只',
          label: '只'
        }, {
          value: '件',
          label: '件'
        },
      ],
      innerVisible: false,
      itemIds: [],
      infolist: [],
      productId: '' //修改时根据id 查询数量
    };
  },
  created() {
    
  },
  mounted() {},
  watch: {},
  methods: {
   
    //产品详情
    getproductid(id) {
        productid(id).then(res => {
        if (res.code == '0') {
         
          this.form = res.data
        }
        })
    },
    // 物料列表
    
    close(num) {
      this.init();
      this.$emit('close', num);
    },
    //初始化
    init() {
      this.form = {
        productName: '',
        productCode: '',
        model: '',
        productItemList: []
      };
      this.productId = '';
      this.tableData1 = [];
      this.itemIds = [];
    },
    marksure(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.tit == '新增产品') {
            productadd(this.form).then(res => {
              if (res.code == '0') {
                this.$message.success(res.msg);
                this.close('0');
              }
            });
          } else {
            productput(this.form).then(res => {
              if (res.code == '0') {
                this.$message.success(res.msg);
                this.close('0');
              }
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    beforclose() {
      this.init();
      this.$emit('close', false);
    },
   
  }
};
</script>

<style lang="less" scpoed>
.productmodal {
  .el-form {
    display: flex;
    flex-wrap: wrap;
  }
  .el-select {
    width: 100%;
  }

  // .formitem{
  //     width: 45%;

  //     margin-bottom: 40px;
  // }
  // .formitem1{
  //     margin-right: 5%;
  // }
  .el-col {
    margin-bottom: 20px;
  }
}

.el-dialog {
  border-radius: 5px;
}
.el-dialog__header {
  background-color: #409baf;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  text-align: center;
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
</style>
<style scoped>
#addProduct >>> .el-cascader {
  width: 100%;
}
</style>
