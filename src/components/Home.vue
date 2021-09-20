<template>
<div>
    Home组件
    <el-button type="info" @click="logout">退出</el-button>
</div>
</template>

<script>

export default {
  methods: {
    logout () {
      // 清空同ken
      window.sessionStorage.clear()
      //   路由强制跳转登录
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>

</style>
