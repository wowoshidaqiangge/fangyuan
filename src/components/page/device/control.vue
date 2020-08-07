<template>
    <div class="constrol">
        <el-tabs type="card" @tab-click="handleClick">
            <el-tab-pane :label="item.deviceType" v-for="(item, index) in runlist" :key="index"  class="conlist">
                <div class="con" >
                    <div class="row-bg" v-for="h in runlistinfo" :key="h.id" >
                        <div class="p1">
                            <span class="icon"></span><span class="tit"> {{ h.deviceName }}</span
                            ><span class="img"><img src="~@/assets/img/wifi.png"/></span>
                        </div>
                        <div class="p1">
                            <p>
                                <span>开机时长:</span><span> {{ h.onLength ? h.onLength + ' h' : '--' }}</span>
                            </p>
                            <p>
                                <span class="icon1 icon2" v-if="h.state == '1'"></span>
                                <span class="icon1 icon3" v-if="h.state == '2'"></span>
                                <span class="icon1 icon4" v-if="h.state == '3'"></span>
                                <span>{{ h.deviceState }}</span>
                            </p>
                        </div>
                        <div class="p1">
                            <p>
                                <span>累计运行:</span><span> {{ h.runLength ? h.runLength + ' h' : '--' }}</span>
                            </p>
                            <p>
                                <span v-if='h.yieldCollect===1'><span>当日产量:</span><span v-if='h.dva|| h.dva ===0'> {{  h.dva + '件' }}</span></span>
                            </p>
                        </div>
                        <div class="p1">
                            <p>
                                <span>使用效率:</span><span style="color:#EB6F43 "> {{ h.useRate ? h.useRate : '--' }}</span>
                            </p>
                            <p>
                                <span v-if='h.yieldCollect===1'><span>累计产量:</span><span> {{ h.totalProduce ? h.totalProduce + '件' : '--' }}</span></span>
                                
                            </p>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { selectDeviceRunList } from 'api/index';
import {onenet} from 'api/onenet'
export default {
    name: 'control',
    data() {
        return {
            runlist: [],
            runlistinfo:[],
          
        };
    },
    created() {
        this.getselectDeviceRunList();
    },
    methods: {
        handleClick(val){
            let obj ={}
            let arr = []
            this.runlist[`${val.index}`].deviceRunVo.map(item=>{
                    obj  = {apikey:item.apiKey,id:item.onenetId,datastream_id:item.streamId}
                    this.getnoet(obj,(res)=>{
                        if(res.errno===0){
                            if(res.data&&res.data.datastreams.length>0){
                                item.dva = res.data.datastreams[0].datapoints[0].value
                            }
                            this.$forceUpdate()
                        }else{
                            this.$message.error(res.error)
                        }
                      })
                        arr.push(item)
                    })
                    this.runlistinfo = arr;
        },
        getnoet:async function(info,cb){
             await onenet.datapoint(info).then(res=>{
               cb&&cb(res)
            })
        },
         getselectDeviceRunList:async function() {
           await selectDeviceRunList().then(res => {
                if (res.code === '0') {
                    let obj = {}
                    let arr = []
                    this.runlist = res.data
                    res.data[0].deviceRunVo.map(item=>{
                     obj  = {apikey:item.apiKey,id:item.onenetId,datastream_id:item.streamId}
                     this.getnoet(obj,(res)=>{
                         item.dva = res.data.datastreams[0].datapoints[0].value
                         this.$forceUpdate()
                      })
                        arr.push(item)
                    })
                    this.runlistinfo = arr;
                }
            });
        }
    }
};
</script>

<style lang="less">
.constrol {
    overflow: hidden;
    height: 100%;
    .top {
        height: 30px;
    }
    .conlist {
        flex: 1;
        flex-direction: column;
        margin-bottom: 10px;
        display: flex;
        .crumbs {
            color: #2c3e50;
            font-weight: 600;
            padding-left: 1%;
        }
    }
    .el-tabs {
        width: 100%;
        height: 100%;
        .el-tabs__content {
            height: calc(100% - 40px);
            overflow: auto;
        }
        .el-tabs__header {
            border-bottom: none;
        }
        .el-tabs__nav {
            border-bottom: 1px solid #e4e7ed;
            border-radius: 0;
        }
        .is-active {
            color: #fff;
            background-color: #409baf;
        }
    }
    .con {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        .row-bg {
            width: 21%;
            padding: 0 10px;
            margin: 1%;
            flex-wrap: wrap;
            box-shadow: 0px 1px 4px 2px rgba(0, 150, 255, 0.09);
            border-radius: 5px;
            .grid-content {
                border-radius: 4px;
                min-height: 99%;
                border: 1px solid #ccc;
            }
            .p1 {
                display: flex;
                height: 40px;
                align-items: center;
                .icon {
                    width: 3px;
                    height: 13px;
                    background: rgba(92, 193, 207, 1);
                    border-radius: 2px;
                    display: inline-block;
                    margin-right: 4px;
                }
                .img {
                    width: 18px;
                    img {
                        width: 100%;
                    }
                }
                .tit {
                    width: calc(100% - 25px);
                }
                p {
                    flex: 1;
                    font-size: 13px;
                }
                p:nth-of-type(1) {
                    span {
                        color: #8c8c8c;
                    }
                }
                p:nth-of-type(2) {
                    span {
                        color: #8c8c8c;
                    }
                    .icon1 {
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        display: inline-block;
                        margin-right: 5px;
                    }
                    .icon2 {
                        background: #ccc;
                    }
                    .icon3 {
                        background: rgba(0, 150, 255, 1);
                    }
                    .icon4 {
                        background: #23d249;
                    }
                }
            }
        }
    }
}
</style>
