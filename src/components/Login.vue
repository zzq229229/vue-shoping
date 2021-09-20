<template>
 <div class="login_container">
 <div class="login_box">
     <!-- 头像部分 -->
     <div class="avatar_box">
         <img src="../assets/logo.png" alt="">
     </div>
     <!-- 登录表单部分 -->
     <el-form ref="loginFormRef" :model="loginForm"  :rules="loginFormRules" label-width="0px" class="login_form">
         <!-- 用户名 -->
  <el-form-item prop="username">
    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-yonghu" ></el-input>
  </el-form-item>
       <!-- 密码 -->
  <el-form-item  prop="password">
     <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-a-tupianyihuifu-54  " ></el-input>
  </el-form-item>
     <!-- 按钮 -->
  <el-form-item class="btns">
      <el-button type="primary" @click="lolgin">登录</el-button>
        <el-button type="warning" @click="resetLoginForm">重置</el-button>
  </el-form-item>
     </el-form>
 </div>
 </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //   表单验证规则对象,是否合法
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //   点击重置按钮，重置登录
    resetLoginForm () {
    //   console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    lolgin () {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.console.error('登录失败')
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.data.token)
        // 跳转页面到后台
        this.$router.push('/home')
      })
    }
  }
}

</script>

<style lang = "less" scoped>
.login_container {
    background-color: rgb(45, 36, 131);
    height: 100%;
}
.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
.avatar_box {
    height:130px;
    width: 130px;
    border:1px solid #eee ;
    border-radius: 50%;
    padding: 10px;
    box-shadow:0 0 5px #ddd ;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
}
/* 表单区 */
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns {
    display: flex;
    justify-content: flex-end;
}

</style>
