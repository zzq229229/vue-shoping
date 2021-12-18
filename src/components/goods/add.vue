<template>
    <div>

        <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
</el-breadcrumb>

<!-- 卡片视图区 -->
<el-card>
    <!-- 提示警告 -->
    <el-alert
    title="添加商品信息"
    type="info"
    center
    show-icon
    :closable="false">
  </el-alert>

  <!-- 步骤条区域 -->
  <!-- 数字0那页：activeIndex 减 0 -->
  <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性 "></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
</el-steps>

<!-- tab 区域标签页 -->
<el-form :model="addForm" :rules ="addFormRules" ref="addFormRef" label-width="100px" label-position="top" >
    <!-- 标签页 -->
 <el-tabs :tab-position="'left'"  v-model="activeIndex"
  :before-leave="beforeTabLeave" @tab-click ="tabClicked">
    <el-tab-pane label="基本信息" name="0">
        <!-- 渲染表单的item项 -->
      <!-- 级联选择器 -->
        <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name" > </el-input>
        </el-form-item>

        <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" type="number"> </el-input>
        </el-form-item>

        <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" > </el-input>
        </el-form-item>

        <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" > </el-input>
        </el-form-item>

         <!-- options绑定数据源   props配对象 -->
        <el-form-item label="商品分类" prop=" goods_cat" >
               <!-- 级联选择器 -->
             <el-cascader
              v-model="addForm.goods_cat"
              :options=" catelist"
              :props="cateProps" expand-trigger= 'hover'
               @change="handleChange">
    </el-cascader>
        </el-form-item>

    </el-tab-pane>

    <el-tab-pane label="商品参数" name="1">
        <el-form-item :label="item.attr_name" v-for="item in  manyTableData" :key="item.attr_id">
            <!-- 复选框 -->
             <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
             </el-checkbox-group>
       </el-form-item>
    </el-tab-pane>

    <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in onlyTableData " :key="item.attr_id">
             <el-input v-model="item.attr_vals" ></el-input>
          </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="3">
        <!-- action表示图片要上传到的后台api地址 -->
    <el-upload  :action="uploadURL" :on-preview="handlePreview"
     :on-remove="handleRemove"  list-type="picture" :headers="headersObj" :on-success="handleSuccess">
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">
        <!-- 富文本编辑器组件 -->
        <quill-editor v-model="addForm.goods_introduce">
        </quill-editor>
        <!-- 添加按钮 -->
         <el-button type="primary"  class="editorbtn" @click="addEditor">添加商品</el-button>

    </el-tab-pane>
  </el-tabs>
</el-form>

</el-card>
<!-- 图片预览对话框 -->
<el-dialog
  title="图片预览" :visible.sync="previewVisible" width="50%">
  <img :src="previewPath" alt="" class="previewImg">
</el-dialog>

    </div>
</template>

<script>
import _ from 'lodash'

export default {
  data () {
    return {
      // 激活联动效果  绑定activeIndex
      activeIndex: '0',
      //   添加是商品的表单对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,

        // 商品所属的分类
        goods_cat: [],
        // 图片数组
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      //   表单规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]

      },
      //   商品分类列表
      catelist: [],
      cateProps: {
        //   看到的是哪个属性
        label: 'cat_name',
        // 选择的是谁的值
        value: 'cat_id',
        // 实现父子节点嵌套
        children: 'children'
      },
      //   动态参数列表数据
      manyTableData: [],
      //   静态参数列表数据
      onlyTableData: [],
      //   图片上传到的地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      //   图片上传的headers请求头，权限的token
      headersObj: { Authorization: window.sessionStorage.getItem('token') },
      //   存储图片真实的地址
      previewPath: ' ',
      previewVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.catelist = res.data
      console.log(this.catelist)
    },
    //  进入1板块
    // 级联选择器选中，会触发的函数
    handleChange () {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 切换商品，可以编辑  oldActiveName要离开的标签    activeName要进入的标签
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 进入商品参数板块
    async tabClicked () {
      // 进入访问的动态参数面板
    //   console.log(this.cateId)
    // 判断商品的页面
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        // console.log(1111)
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }
        console.log(res.data)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length ===
           0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态参数列表失败')
        }
        console.log(res.data)
        this.onlyTableData = res.data
      }
    },
    // 点击预览效果
    handlePreview (file) {
    //   console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 点击移除效果
    handleRemove (file) {
    //   console.log(file)
      //   1.获取图片的临时路径
      const filePath = file.response.data.tmp_path

      //   2.在pics中找到图片对应的索引值
      //   x表示每一项
      const i = this.addForm.pics.findIndex(x =>
        x.pic === filePath)
      //   3.调用splics方法，把图片从pics中移除
      this.addForm.pics.splice(i, 1)
    //   console.log(this.addForm)
    },
    // 图片上传成功的事件
    handleSuccess (response) {
    //   console.log(response)
      // 1.拼接得到的图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2.将图片信息对象，push到pic的数组中
      this.addForm.pics.push(picInfo)
    //   console.log(this.addForm)
    },
    addEditor () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请输入表单必填项！')
        }
        // console.log(this.addForm)
        // 发起请求保存文件

        // 处理goods_cat现将数组变字符串
        // lodash深拷贝， cloneDeep(obj),因为联机关联了addForm.goods_cat数组，这里要字符串，
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')

        //    处理 attrs 的动态和静态属性  上传后才可以拿到属性
        // 动态属性
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })

        // 静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        // 发起请求
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          this.$message.error('添加商品失败')
        }

        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }

  },

  computed: {
    //   计算this.addForm.goods_cat[2]   =   id  装换
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }

  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
    margin: 0px 5px 0px 0px !important;
}
.previewImg {
    width: 100%;
}
.editorbtn {
    margin: 20px;
}

</style>
