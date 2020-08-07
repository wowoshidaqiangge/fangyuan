<!--
 * @Author: your name
 * @Date: 2020-07-01 18:33:47
 * @LastEditTime: 2020-07-02 09:27:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \方圆web\fangyuan-web\src\components\testSvg.vue
--> 
<!--  -->
<template>
  <div class="test-svg">
    <!-- <div id="svgTemplate"></div> -->
    <testsvg ref="svg"/>
  </div>
</template>

<script>
import testsvg from "./10100001-00.svg"
export default {
  components: {
      testsvg,
    },
  data() {
    return {};
  },
  created() {
   
  },
  mounted() {
     this.getSvg()
  },
  computed: {},
  methods: {
    getSvg() {
      let svgDom = this.$refs['svg']
      let id = ''
      console.log(svgDom)
      // const xhr = new XMLHttpRequest();
      // this.svgUrl = 'http://gt.thingcom.com/10100001.svg'; // svg的绝对地址，在浏览器中打开能看到的那个
      // xhr.open('GET', this.svgUrl, true);
      // xhr.send();
    }
  }
};
</script>
<style lang="less">
.test-svg{
  background-color:black;
}
</style>