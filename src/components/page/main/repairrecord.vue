<template>
    <div class="repairrecord">
        <div class="top">
            <el-row type="flex">
                <el-form :model="seachinfo"  ref="seachinfo"  class="demo-ruleForm">
                <div style="flex:1">
                    <el-button type="add" icon="el-icon-circle-plus-outline" @click="recordAdd()">新增</el-button>
                </div>
                        
                    
                <el-col :span="6">
                    <el-form-item label="" prop="chosedTime">
                            <el-date-picker
                                v-model="chosedTime"
                                type="daterange"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                @change="changedate"
                                class="datetime"
                                end-placeholder="结束日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" style="margin:0 20px">
                        <el-form-item label="" prop="state">
                            <el-select v-model="seachinfo.state" placeholder="状态">
                                <el-option v-for="item in orderlist" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3" >
                        <el-form-item label="" prop="deviceNameOrCode">
                            <el-input placeholder="设备名称或编码" v-model="seachinfo.deviceNameOrCode" class="elinput"> </el-input>
                        </el-form-item>
                    </el-col>
                    <div style="margin:0 15px">
                        <el-button type="add" icon="el-icon-search" @click="seachinfo1">搜索</el-button>
                        <el-button type="success" icon="el-icon-refresh-right" @click="resetting">重置</el-button>
                    </div>
                            
                       
                </el-form>
            </el-row>
        </div>

        <div class="bot">
            <el-table :data="tableData" stripe :height="screenWidth" style="width: 100%">
                <el-table-column
                    v-for="(item, index) in columnlist"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    align="center"
                ></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="success" plain class="red" @click="recordEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button v-if="scope.row.state" type="success" plain @click="handleEdit(scope.$index, scope.row)">查看</el-button>
                        <el-button type="danger" plain v-else class="red" @click="handledistribute(scope.$index, scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page">
            <el-pagination
                :background="true"
                :current-page.sync="pagesize"
                @current-change="handleCurrentChange"
                layout="total, prev, pager, next"
                :total="totals"
            ></el-pagination>
        </div>
        <repairmodal :dialogFormVisible="dialogFormVisible" @close="close" :tit="tit" :ifEdt="ifEdt" ref="repairmodal" />
        <repairexamine :dialogFormVisible1="dialogFormVisible1" @close="close" ref="repairexamine" />
    </div>
</template>

<script>
import { repairrecordpage, mainrepairdel } from 'api/main';
import repairmodal from './repairmodal';
import repairexamine from './repairexamine';

export default {
    name: 'repairrecord',
    components: {
        repairmodal,
        repairexamine
    },
    data() {
        return {
            orderlist: [
                { name: '待检修', value: '0' },
                { name: '已完成', value: '1' }
            ],
            seachinfo: {
                beginDate: '',
                endDate: '',
                state: ''
            },
            chosedTime: [],
            value1:'',
            tableData: [],
            page: {
                current: 1,
                size: 10
            },
            dialogFormVisible: false,
            dialogFormVisible1: false,
            totals: 0,
            tit: '',
            ifEdt: false,
            pagesize: 1,
            screenWidth: document.body.clientHeight - 215 + 'px',
            columnlist: [
                { prop: 'index', label: '序号' },
                { prop: 'deviceName', label: '设备名称' },
                { prop: 'deviceNumer', label: '设备编号' },
                { prop: 'deviceModel', label: '规格型号' },
                { prop: 'toType', label: '设备类型' },
                { prop: 'fault', label: '故障原因' },
                { prop: 'dateTime', label: '故障时间' },
                { prop: 'dateTime', label: '完成时间' },
                { prop: 'repairUserName', label: '维修人' },
                { prop: 'checkUserName', label: '验收人' },
                { prop: 'states', label: '维修状态' }
            ]
        };
    },
    computed: {},
    created() {
        this.getrepairrecordpage();
    },
    methods: {
        resetting(){
            this.seachinfo= { beginDate:'',endDate:'',state:'',}
            this.chosedTime = []
            this.page.current = 1
            this.getrepairrecordpage()
        },
        seachinfo1(){
            this.seachinfo.beginDate = this.chosedTime[0]
            this.seachinfo.endDate = this.chosedTime[1]
            this.page.current = 1
            this.getrepairrecordpage()
        },
       
        changedate() {},
        getrepairrecordpage() {
          let obj = {...this.seachinfo,...this.page}
          repairrecordpage(obj).then(res => {
           
              if (res.code === '0') {
                  res.data.records.map((item, index) => {
                      item.states = item.state? '已完成' : '待检修';
                      item.index = index + 1;
                  });
                  this.pagesize = parseInt(res.data.current);
                  this.totals = parseInt(res.data.total);
                  this.tableData = res.data.records;
              }
          });
      },
      // 新增
      recordAdd(){
          this.tit = '新增'
          this.dialogFormVisible = true
      },
      // 修改
      recordEdit(h,m){
        console.log(h)
        this.tit= '修改'
        this.ifEdt = true
        this.$refs.repairmodal.getmainrepairid({id:m.id})
        this.dialogFormVisible = true
      },
      // 查看
      handleEdit(h,m){
        console.log(h)
        this.$refs.repairexamine.getmainrepairid({id:m.id})
        this.dialogFormVisible1 = true
      },
      handleCurrentChange(val){
        this.page.current = val
        this.getmainrecordpage()
      },
    close(num){
        this.dialogFormVisible = false
        this.dialogFormVisible1 = false
        console.log(this.dialogFormVisible1)
        if(num==='0'){
            this.getrepairrecordpage()
        }
    },
    handledistribute(h,m){
        this.$confirm('确定要删除吗？', '提示', {
            type: 'warning'
        })
        .then(() => {
                    mainrepairdel(m).then(res=>{
                        if(res.code==='0'){
                            this.$message.success(res.msg)
                            this.getrepairrecordpage()
                        }
                    })
        })
        .catch(() => {});
        
    },
    // 删除
    // handledistribute(h,m){
    //     mainrepairdel(m).then(res=>{
    //         if(res.code==='0'){
    //             this.$message.success(res.msg)
    //             this.getrepairrecordpage()
    //         }
    //     })
    // }
    }
};
</script>

<style lang="less">
.repairrecord {
    .top {
        height: 50px;
        margin-top: 10px;
        .demo-ruleForm{
            width: 100%;
            display: flex;
            justify-content: flex-end;
        }
    }
    .datetime{
        width: 100%;
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
