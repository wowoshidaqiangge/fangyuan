<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  name: 'App',

  data () {
    return {
      
    }
  },

  watch: {
    /**
    * 侦听页面可视高度的变化,将底部tabbar display:block
    */
  
  },

  methods: {
    ...mapMutations(['changeScreenHeight'])
  },

  mounted () {
    
    window.onresize = () => {
      this.changeScreenHeight(document.documentElement.clientHeight)
    }
    window.addEventListener('print',(event)=>{
      debugger
    })
  }
}
</script>
<style>
    @import "./assets/css/main.css";
    @import "./assets/css/color-dark.css";     /*深色主题*/
    /*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
</style>