<template>
    <div>
              <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片 -->
<el-card>
    <el-row>
        <el-col  :span="8">
            <el-input placeholder="请输入内容">
             <el-button slot="append" icon="el-icon-search"></el-button>

  </el-input>
        </el-col>
    </el-row>
    <!-- 订单数据列表 -->
     <el-table :data="orderlist"  border stripe>
          <el-table-column type="index">   </el-table-column>

          <el-table-column label="订单编号" prop="order_number">   </el-table-column>

          <el-table-column label="订单价格" prop="order_price">   </el-table-column>

           <el-table-column label="是否付款" prop="pay_status">
                 <template slot-scope="scope">
                  <el-tag type="success" v-if="scope.row.pay_status===1"> 已付款</el-tag>
                  <el-tag type="danger" v-else > 未付款</el-tag>
                </template>
                </el-table-column>

           <el-table-column label="是否发货" prop="is_send">
                <template slot-scope="scope">
                    {{scope.row.is_send }}
                </template>  </el-table-column>

            <el-table-column label="下单时间" prop="create_time">
                <template slot-scope="scope">
                    {{scope.row.create_time |deteFormet}}
                </template>
                  </el-table-column>

            <!-- 用到作用域插槽 -->
             <el-table-column label="操作" >
                 <template slot-scope="{}">
                     <!-- 物流信息对话框 -->
                 <el-button size="mini" type="success" icon="el-icon-location" @click="showProgress"> </el-button>
                 <!-- 修改地址的对话框  -->
                  <el-button  size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
                 </template>
                   </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 15, 30, 40]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

</el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog
  title="修改地址"
  :visible.sync="addressVisible"
  width="50%"
  @close="addressDialogClosed"
  >
<el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" >
  <el-form-item label="省市区/县区" prop="addressName">
  <!-- 三级选择器 -->
    <el-cascader
    v-model="addressForm.addressName"
    :options="cityData"
   ></el-cascader>
  </el-form-item>
  <el-form-item label="详细地址" prop="addressPath">
    <el-input v-model="addressForm.addressPath"></el-input>
  </el-form-item>
  </el-form>
    <el-button @click="addressVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressVisible = false">确 定</el-button>

</el-dialog>
<!-- 物流信息对话框 -->
<el-dialog
  title="物流信息"
  :visible.sync="ProgressDialogVisible" width="50%">

  <!-- 时间线 -->
   <el-timeline >
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>

    </div>
</template>

<script>
import cityData from './citydata'
export default {
  data () {
    return {
      // 查询对象
      queryInfo: {
        //   搜索的关键字
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条
        pagesize: 5
      },
      //   获取的数据
      orderlist: [],
      total: 0,
      //   修改地址的对话框
      addressVisible: false,
      addressForm: {
        addresaddressNamesname: [],
        addressPath: ''
      },
      addressFormRules: {
        addressName: [
          // 在失去焦点的时候触发trigger: 'blur'验证
          { required: true, message: '请选择省市区域/县区', trigger: 'blur' }
        ],
        addressPath: [
        // 在失去焦点的时候触发trigger: 'blur'验证
          { required: true, message: '请选择详细地址', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      //   物流信息对话框
      ProgressDialogVisible: false,
      //   物流信息
      progressInfo: []

    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async  getOrderList () {
      // params 参数
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$messagt.error('获取订单数据列表失败！')
      }
      this.$message.success('获取订单数据列表成功')
      this.orderlist = res.data.goods
      this.total = res.data.total
      console.log(res)
    },
    // 每页多少条
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 当前页多少条
    handleCurrentChange (newPag) {
      this.queryInfo.pagenum = newPag
      this.getOrderList()
    },
    // 展示修改地址的对话框
    showBox () {
      this.addressVisible = true
    },
    // 关闭对话框重置信息
    addressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    // 物流信息对话框
    async showProgress () {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }
      this.$message.success('获取物流信息')
      this.progressInfo = res.data
      this.ProgressDialogVisible = true
      console.log(this.progressInfo)
    }

  }

}
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}

</style>
