<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" class="main-article" element-loading-text="loading..."> 
        <div  v-for="(item,index) in groupData" v-bind:key="index" >
        <div class="article__heading" :id="'codeimg' + index"  style="page-break-after:always;width:740px;margin:20px auto">
          <div class="article__heading__title"  style="text-align: center;font-size: 32px; font-weight: 600;height: 55px;">
            生产流转卡
          </div>
          <div style="text-align: center">
            <div class="oneItem" style="display: flex;width:100%">
              <div class="oneLeft" style="border: solid 1px;width: 180px;font-size: 20px;font-weight: 600;padding: 34px 0;">计划单号</div>
              <div class="oneRight" style="border: solid 1px;border-left: none;width: calc(100% - 180px);font-size: 30px;font-weight: 600;padding: 30px 0;">{{item.taskNumber}}</div>
            </div>
            <div style="display:flex">
                <div style="flex:4">
                        <div class="oneItem" style="display: flex;width:100%">
                          <div class="oneLeft" style="border: solid 1px;width: 180px;font-size: 20px;font-weight: 600;padding: 34px 0;">产品信息</div>
                          <div class="twoLeft" style="border: solid 1px;border-left: none;width: calc(100% - 180px);">
                            <!-- <div class="ttwoLeft" style="display: flex;border-bottom: solid 1px;">
                              <div class="tttwoLeft" style="border-right: 1px solid;padding: 5px;width: 100px">产品编号</div>
                              <div class="tttwoItem" style="padding: 5px">{{item.productCode}}</div>
                            </div> -->
                            <div class="ttwoLeft" style="display: flex;border-bottom: solid 1px;">
                              <div class="tttwoLeft" style="border-right: 1px solid;padding: 5px;width: 100px">产品名称</div>
                              <div class="tttwoItem" style="padding: 5px">{{item.productName}}</div>
                            </div>
                            <div class="ttwoLeft" style="display: flex;border-bottom: solid 1px;">
                              <div class="tttwoLeft" style="border-right: 1px solid;padding: 5px;width: 100px">产品规格</div>
                              <div class="tttwoItem" style="padding: 5px">{{item.model}}</div>
                            </div>
                          </div>
                        </div>

                          <div class="oneItem" style="display: flex;width:100%">
                            <div class="oneLeft" style="border: solid 1px;width: 180px;font-size: 20px;font-weight: 600;padding: 34px 0;">计划内容</div>
                            <div class="twoLeft" style="border: solid 1px;border-left: none;width: calc(100% - 180px);">
                              <div class="ttwoLeft" style="display: flex;border-bottom: solid 1px;">
                                <div class="tttwoLeft" style="border-right: 1px solid;padding: 5px;width: 100px">计划生产数量</div>
                                <div class="tttwoItem" style="padding: 5px">{{item.planYield}}</div>
                              </div>
                              <div class="ttwoLeft" style="display: flex;border-bottom: solid 1px;">
                                <div class="tttwoLeft" style="border-right: 1px solid;padding: 5px;width: 100px">开工时间</div>
                                <div class="tttwoItem" style="padding: 5px">{{item.planStartTime}}</div>
                              </div>
                              <div class="ttwoLeft" style="display: flex;border-bottom: solid 1px;">
                                <div class="tttwoLeft" style="border-right: 1px solid;padding: 5px;width: 100px">完工时间</div>
                                <div class="tttwoItem" style="padding: 5px">{{item.planEndTime}}</div>
                              </div>
                            </div>
                          </div>
                </div>
                <div style="flex:1">
                    <div class="qrcode codeImg"  :id="'XQ' + index"></div>
                </div>
            </div>
          </div>
        </div>
      </div>
    
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  data() {
    return {
      article: '',
      fullscreenLoading: false,
      row: {},
      rrow: {},
      index: 0,
      groupData:[]
    }
  },
  mounted() {
      
      this.gourpPrint()
      this.groupData = JSON.parse(this.$route.query.downlist)

  },
  created(){
    var beforePrint = function() {
         console.log('beforePrint',);
    };

    var afterPrint = function() {
        console.log('afterPrint',);
    };
    
    if (window.matchMedia) {   //返回一个新的 MediaQueryList 对象，表示指定的媒体查询字符串解析后的结果。
        // var mediaQueryList = window.matchMedia('print');
        window.matchMedia('print').addListener(function(mql) {
          console.log(mql,mql.matches)
            if (mql.matches) {
                beforePrint();
            } else { 
               afterPrint();
            }
        });
    }
    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;
  },
  ready() {
    

 },
  methods: {
    
     beforePrint (){
       console.log("打印前");
     },
     afterPrint (){
       
     },
      gourpPrint() {
        let that =this
        setTimeout(()=>{
          this.$nextTick(() => {
          for(let i = 0; i < that.groupData.length; i++) {
           debugger
            let imageToPrint = document.getElementById('codeimg' + i)
              console.log(imageToPrint.outerHTML)
              document.getElementById('XQ'+i).innerHTML='';//置空
              var qrcode = new QRCode(document.getElementById("XQ"+i), {
                  text: `http://pda.junda.test.thingcom.com/?produceTaskId=${that.groupData[i].id}`, // 需要转换为二维码的内容
                  width: 196,
                  height: 196,
                  colorDark: '#000000',
                  colorLight: '#ffffff',
                  correctLevel: QRCode.CorrectLevel.H
              })
            setTimeout(function() {
              window.document.write(imageToPrint.outerHTML);
            }, 100);
          }
        })
         window.document.close(); //在IE浏览器中使用必须添加这一句
         window.focus(); //在IE浏览器中使用必须添加这一句
        setTimeout(function() { 
           
          that.$nextTick(()=>{
            debugger
               //打印
              window.print(); 
              //  let that = this
              //   if (window.matchMedia) {
              //     debugger
              //       var mediaQueryList = window.matchMedia('print');
                    
              //       //为印添加事件
              //       mediaQueryList.addListener(mql=>{
              //           if (mql.matches) {
              //               that.beforePrint();
              //           } else {
              //               that.afterPrint();
              //           }
              //       });
              //   }
          })
        }, 2000);
        },100)
        
      },
    //    gourpPrint1(groupData) {
    //     console.log(groupData)
    //     this.groupData = groupData
    //     if(groupData === null || groupData.length === 0) {
    //       return
    //     }
    //     var newWin = window.open("")
    //     this.$nextTick(() => {
    //       for(let i = 0; i < groupData.length; i++) {
    //         let imageToPrint = document.getElementById('codeimg' + i)
    //           console.log(imageToPrint.outerHTML)
    //           document.getElementById('XQ'+i).innerHTML='';//置空
    //           var qrcode = new QRCode(document.getElementById("XQ"+i), {
    //               text: 'xxxx', // 需要转换为二维码的内容
    //               width: 196,
    //               height: 196,
    //               colorDark: '#000000',
    //               colorLight: '#ffffff',
    //               correctLevel: QRCode.CorrectLevel.H
    //           })
    //         setTimeout(function() {
    //           newWin.document.write(imageToPrint.outerHTML);
    //         }, 100);
    //       }
    //     })
    //     newWin.document.close(); //在IE浏览器中使用必须添加这一句
    //     newWin.focus(); //在IE浏览器中使用必须添加这一句
    //     setTimeout(function() {
    //       newWin.print(); //打印
    //       newWin.close(); //关闭窗口
    //     }, 500);
    //   },
    //  creatQrCode(row) {
    //     this.row = row
    //     var qrcode = new QRCode(this.$refs.qrCodeUrl, {
    //         text: 'xxxx', // 需要转换为二维码的内容
    //         width: 196,
    //         height: 196,
    //         colorDark: '#000000',
    //         colorLight: '#ffffff',
    //         correctLevel: QRCode.CorrectLevel.H
    //     })
    //     setTimeout(() => {
    //           this.fetchData()
    //       }, 1000)
    // },
    // fetchData() {
    //   this.fullscreenLoading = true
    //   let subOutputRankPrint = document.getElementById('subOutputRank-print');
    //   console.log(subOutputRankPrint.innerHTML);
    //   let newContent =subOutputRankPrint.innerHTML;
    //   let oldContent = document.body.innerHTML;
    //   document.body.innerHTML = newContent;
    //   setTimeout(() => {
    //       this.fullscreenLoading = false
    //       this.$nextTick(() => {
    //         window.print()
    //         window.location.reload();
    //         document.body.innerHTML = oldContent;
    //       })
    //     }, 1000)
    //   // import('./content.js').then(data => {
    //   //   const { title } = data.default
    //   //   document.title = title
    //   //   this.article = data.default
    //     // setTimeout(() => {
    //     //   this.fullscreenLoading = false
    //     //   this.$nextTick(() => {
    //     //     window.print()
    //     //   })
    //     // }, 3000)
    //   // })
    // }
  }
}
</script>

<style lang="less" scoped>
    // .main-article{
    //     width: 740px;
    //     margin:0 auto
    // }
</style>
