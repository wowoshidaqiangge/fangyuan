  <template>
  <div class="svgPage">
    <div class="btn_group">
      <el-button id="full_screen">全屏</el-button>
      <el-button id="zoom_in">放大</el-button>
      <el-button id="zoom_out">缩小</el-button>
    </div>
    <div id="svgTemplate"></div>
    <el-dialog :title="dialog.title" :visible.sync="dialog.dialogVisible" width="30%">
      <span>你点击了：{{id}}</span>
    </el-dialog>
  </div>
</template>

<script>
import * as d3 from 'd3';
import Vue from 'vue/dist/vue.esm.js';
export default {
  name: 'demo',
  props: {
    msg: String
  },
  data() {
    return {
      svgUrl: '',
      svgDom: '',
      dialog: {
        dialogVisible: false,
        title: '',
        list: []
      },
      fullscreen: false,
      id: null,
      outSide: null, //判断是否为外部缩放
      min: 0.5,
      max: 2
    };
  },
  created() {
    this.getSvg();
  },
  mounted() {
    // 将takeLoopDetail方法绑定到window下面，提供给外部调用
    window['handleLoopClick'] = e => {
      this.takeLoopDetail(e);
    };
    window['doRollerZoom'] = () => {
      this.rollerZoom();
    };
  },
  methods: {
    getSvg() {
      //获取svg
      /* 创建xhr对象 */
      const xhr = new XMLHttpRequest();
      this.svgUrl = 'http://saw.thingcom.com/10100001.svg';
      xhr.open('GET', this.svgUrl, true);
      xhr.send();
      /* 监听xhr对象 */
      xhr.addEventListener('load', () => {
        /* 获取 dom */
        const resXML = xhr.responseXML;
        this.svgDom = resXML.documentElement.cloneNode(true);
        /* 添加事件（点击事件，鼠标滚轮事件,全屏事件） */
        this.addEvents();
        /* dom重置 */
        this.resetDom();
        /* 将svgDom对象转换成vue的虚拟dom */
        var oSerializer = new XMLSerializer();
        var sXML = oSerializer.serializeToString(this.svgDom);
        var Profile = Vue.extend({
          template: "<div id='svgTemplate'>" + sXML + '</div>'
        });
        // 创建实例，并挂载到元素上
        new Profile().$mount('#svgTemplate');
      });
    },
    addEvents() {
      this.svgDom.setAttribute(
        'v-on:mousewheel',
        'this.doRollerZoom()'
      );
      //添加外部放大缩小按钮点击事件,全屏事件
      d3.select('#full_screen').on('click', () => {
        this.screen();
      });
      d3.select('#zoom_in').on('click', () => {
        this.doZoom('in');
      });
      d3.select('#zoom_out').on('click', () => {
        this.doZoom('out');
      });
      /* SVG对象添加click事件 */
      let idGroup = [
        '10100001020',
        '10100001021',
        '10100001022',
        '10100001023',
        '10100001024'
      ];
      idGroup.forEach(id => {
        let btnTakePieceDom = this.svgDom.getElementById(id);
        btnTakePieceDom.setAttribute(
          'v-on:click',
          'this.handleLoopClick($event)'
        );
      });
    },
    resetDom() {
      //开关
      let stateId = 'g5254';
      this.svgDom.getElementById(stateId).style.display = 'none';
      let electricId = ['text5298', 'text5300', 'text5302'];
      //数值
      let  electricVal = ['0.01A', '0.02A', '0.03A'];
      electricId.forEach((item, i) => {
        this.svgDom.getElementById(item).innerHTML = electricVal[i];
      });
    },
    doZoom(type) {
      // 外部放大缩小
      this.outSide = true;
      let transformStr = document
        .getElementById('svg4703')
        .getAttribute('transform');
      let multiples; //缩放倍数
      if (transformStr) {
        let scaleStr = 'scale(';
        let start = transformStr.indexOf(scaleStr);
        let end = transformStr.lastIndexOf(')');
        multiples = transformStr.slice(start + scaleStr.length, end);
        multiples = Number(multiples);
      } else {
        multiples = 1;
      }
      if (type === 'in') {
        //控制缩放范围在0.5-2
        multiples < this.max
          ? (multiples += 0.1)
          : (multiples = multiples);
      } else {
        multiples > this.min
          ? (multiples -= 0.1)
          : (multiples = multiples);
      }
      this.multiples = multiples;
      document
        .getElementById('svg4703')
        .setAttribute('transform', 'scale(' + multiples + ')');
      this.$forceUpdate;
    },
    takeLoopDetail(e) {
      //svg点击事件
      let id = e.currentTarget.getAttribute('id');
      this.id = id;
      setTimeout(() => {
        let res = [
          {
            name: '消防栓机械泵2路',
            i: {
              Ia: '0.7',
              Ib: '0.5',
              Ic: '0.1'
            }
          }
        ];
        this.dialog.title = res[0].name;
        this.dialog.dialogVisible = true;
      }, 300);
    },
    rollerZoom() {
      // 滚轮放大缩小
      this.outSide = false;
      let that = this;
      let svg = d3.select('#svgTemplate');
      svg.call(
        d3
          .zoom()
          .scaleExtent([this.min, this.max])
          .on('zoom', zoom)
      );
      function zoom() {
        if (that.outSide) {
          d3.event.transform.k = that.multiples;
        }
        d3.select(this)
          .selectAll('svg')
          .attr('transform', d3.event.transform);
      }
    },
    screen() {
      //全屏
      // let element = document.documentElement;//设置后就是我们平时的整个页面全屏效果
      let element = document.getElementById('svgTemplate'); //设置后就是   id==con_lf_top_div 的容器全屏
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.svgPage {
  background-color: #000;
  overflow: hidden;
  #svgTemplate {
    overflow: hidden;
    height: calc(100vh - 174px);
  }
  .btn_group {
    background-color: #fff;
    padding: 10px;
  }
}
</style>
