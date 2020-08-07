<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#4c5e79"
      text-color="#fff"
      active-text-color="#fff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.children">
          <el-submenu :index="item.obj.index" :key="item.obj.index">
            <template slot="title">
              <i :class="item.obj.icon"></i>
              <span slot="title">{{ item.label }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-submenu
                v-if="subItem.children"
                :index="subItem.obj.index"
                :key="subItem.obj.index"
              >
                <template slot="title">{{ subItem.label }}</template>
                <el-menu-item
                  v-for="(threeItem) in subItem.children"
                  :key="threeItem.index"
                  :index="threeItem.index"
                >{{ threeItem.label }}</el-menu-item>
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.obj.index"
                :key="subItem.obj.index"
              >{{ subItem.label }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.obj.index" :key="item.obj.index">
            <i :class="item.obj.icon"></i>
            <span slot="title">{{ item.label }}</span>
          </el-menu-item>
        </template>
      </template>
      <el-menu-item index="testSvg" key="testSvg">
        <i class="el-icon-setting"></i>
        <span slot="title">配电图</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import bus from '../common/bus';
import { mapState } from 'vuex';
import { userListMenu } from 'api/index';
export default {
  data() {
    return {
      collapse: false,
      items: []
    };
  },
  computed: {
    //  ...mapState({
    //     userId:state=> state.userId
    // }),
    onRoutes() {
      //  console.log(this.$route.path)
      return this.$route.path.replace('/', '');
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg;
      bus.$emit('collapse-content', msg);
    });
    this.getuserListMenu();
  },
  methods: {
    getuserListMenu() {
      userListMenu({ id: sessionStorage.getItem('userId') }).then(
        res => {
          if (res.code === '0') {
            var arr = [];
            this.items = res.data;
            res.data.map(h => {
              if (h.id) {
                arr.push({ id: h.id, name: h.label });
              }
            });
            console.log(res.data);
            //  this.items.unshift({
            //     icon: 'el-icon-lx-home',
            //     index: 'dashboard',
            //     label: '系统首页',
            //      obj:{
            // icon: 'el-icon-lx-home',
            // }
            // })
            // 设置人员设置中角色权限
            sessionStorage.setItem('checkbox', JSON.stringify(arr));
          }
        }
      );
    }
  }
};
</script>

<style>
.el-menu-item.is-active {
  background-color: #409baf !important;
}

.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 215px;
}
.sidebar > ul {
  height: 100%;
}
</style>
