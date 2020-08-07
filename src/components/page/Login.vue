<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">方圆阀门生产管理系统</div>
            <el-form :model="param" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input
                        type="text"
                        v-model="param.username"
                        areadonly
                        placeholder="请输入账号"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="请输入密码"
                        v-model="param.password"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import { login } from 'api/index';
import { mapActions, mapState } from 'vuex';
import bus from './../common/bus'
export default {
    data: function() {
        return {
            param: {
                username: '',
                password: ''
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            },
          
        };
    },
    mounted() {
        // setTimeout(() => {
        //     this.isshow = true;
        // }, 1);
        // if (this.timer) {
        //     clearTimeout(this.timer);
        // }
        // this.timer = setTimeout(() => {
        //     // 100毫秒延迟解决第二次打开弹框，输入框不自动获取焦点的bug
        //     this.$refs.getFocus.focus();
        // }, 100);
    },
    methods: {
        ...mapActions(['handleLogin']),

        submitForm(id) {
            var that = this;
            this.$refs.login.validate(valid => {
                if (valid) {
                    var obj = {};
                    
                    obj = { ...that.param };
                    this.handleLogin(obj).then(res => {
                        this.$message({
                        showClose: true,
                        message: '登录成功',
                        type: 'success',
                        duration: 700,
                        });
                        // this.$message.success('登录成功');
                        sessionStorage.setItem('ms_username', res.username);
                        sessionStorage.setItem('TagsList', '');
                        this.$router.replace('/');
                        
                    });

                    // login(this.param).then(res=>{
                    //  if(res.code==='0'){
                    //       this.$message.success('登录成功');
                    //      localStorage.setItem('userId', res.data.id);
                    //      localStorage.setItem('ms_username', res.data.username);
                    //      this.$router.push('/')
                    //  }
                    // })
                    // this.$message.success('登录成功');
                    // localStorage.setItem('ms_username', this.param.username);
                    // this.$router.push('/')
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/wms31.png);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    background-image: url(../../assets/img/login.png);
    background-size: 100% 100%;
    position: absolute;
    left: 76%;
    top: 60%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    /* background: rgba(255, 255, 255, 0.3); */
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
