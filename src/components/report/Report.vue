<template>
<div>
                 <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>数据统计</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片 -->
<el-card>
   <!--2. 为 echarts图表设置 -->
<div id="main" style="width: 700px;height:400px;"></div>
</el-card>

</div>
</template>

<script>
// 1.导入 echarts
// import echarts from 'echarts'
import * as echarts from 'echarts'
import _ from 'lodash'

export default {
  data () {
    return {

    }
  },
  created () {

  },
  async  mounted () {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线数据失败')
    }
    // 4.调色盘，可以在 option 中设置。 准备数据和配置
    const result = _.merge(res.data, this.options)

    // 5.展示数据
    myChart.setOption(result)
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>

</style>
