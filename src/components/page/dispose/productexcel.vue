<template>
  <div class="metaexcel">
    <el-dialog 
    :title="tit" 
    :destroy-on-close='isclose'
    :visible.sync="dialogFormVisible1"
    width='40%' 
    :before-close='beforclose' 
    center>
    <el-row>
           <excelupdate @childByValue ='childByValue'/>
           <div>
                <el-button size="small" type="primary" @click="UpData" style="margin:25px 0 15px 0">点击导入</el-button>    
                <p class="login-tips">说明: 导入文件类型必须为excel格式，你可以先点击 <a href="https://thingcom-test.oss-cn-hangzhou.aliyuncs.com/%E4%BF%8A%E8%BE%BE-%E4%BA%A7%E5%93%81-%E6%A8%A1%E6%9D%BF.xlsx">下载模板</a>。</p>
            </div>
    </el-row>
    </el-dialog>

  </div>
</template>

<script>
import excelupdate from './../../common/excelupdate'
import {productaddExcel} from 'api/main'
export default {
    name: 'metaexcel',
    components:{
       excelupdate
    },
    props:{
        dialogFormVisible1:{
            type:Boolean
        },
        tit:{
            type:String
        },
       
    },
    data() {
        return {
            isclose:true,
            sureload:false,
            excelData: []
           
        }
    },
    created(){
       
    },
    mounted(){
        
    },
    watch:{
     
    },
    methods: {
       // 处理excel数据
        childByValue(val){
          let arr = []
          val.map((item,index)=>{
            let obj = {}
            obj.productCode = JSON.parse(JSON.stringify(item))["产品编码"]
            obj.productName = JSON.parse(JSON.stringify(item))["产品名称"]
            obj.model = JSON.parse(JSON.stringify(item))["规格"]
            obj.itemCode = JSON.parse(JSON.stringify(item))["部件编码"]
            obj.unit = JSON.parse(JSON.stringify(item))["基本单位"]
            arr[index] = obj
          })
          this.excelData = arr
          console.log(this.excelData)
        },
        UpData () {
           productaddExcel(this.excelData).then(res=>{
               if(res.code==='0'){
                   this.close(0)
                   this.$message({
                        message: '上传成功',
                        type: 'success'
                    });
               } else {
                   this.$message.error('上传失败');
               }
           })
        },
       close(num){
         
           this.$emit('close',num)
       },
   
    
       beforclose(){
        
          this.$emit('close',false)
       }
    }
}
</script>


<style lang='less'>
    .metaexcel{
        .el-dialog{
            border-radius: 5px;
        }
        .el-dialog__header{
            background-color: #409BAF;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
           .el-dialog__title{
               color: #fff;
                 letter-spacing: 2px;
           }
           .el-dialog__headerbtn .el-dialog__close{
               color: #fff;
             
           }
        }
        .dialog-footer{
            text-align: end;
        }
        .el-form{
            display: flex;
            flex-wrap: wrap;
        }
        .el-select {
            width: 100%;
        }
        .el-col{
            margin-bottom: 20px;
        }
        // .formitem{
        //     width: 45%;
         
        //     margin-bottom: 40px;
        // }
        // .formitem1{
        //     margin-right: 5%;
        // }
    }

</style>
