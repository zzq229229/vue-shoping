<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }" @click.native="clearStorage">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="openCateInfo">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表数据 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: green"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="scot" slot-scope="scope">
          <el-tag v-show="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-show="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-show="scope.row.cat_level === 2" type="warning">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="openEditCateInfo(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cateQueryInfo.pagenum"
        :page-sizes="[2, 5, 8, 10]"
        :page-size="5"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="cateListTotal">
      </el-pagination>
      <!-- 添加分类的对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addVisible"
        width="50%"
        @close="resetAddForm"
      >
        <el-form label-width="80px" :model="addForm" ref="addFormRefs" :rules="addFormRules">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              v-model="selectKeys"
              :options="paraentCateList"
              :props="cascaderProps"
              clearable
              @change="cascaderChange">
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑分类对话框 -->
      <el-dialog
        title="修改分类名称"
        :visible.sync="editInfoVisible"
        width="50%"
        @close="resetEditForm"
      >
        <el-form label-width="80px" :model="editForm" ref="editFormRefs" :rules="addFormRules">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editInfoVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateQueryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      paraentCateList: [],
      cateListTotal: 0,
      addVisible: false,
      editInfoVisible: false,
      addForm: {
        // 父级分类的id，没有父级为0
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      editForm: {
        id: '',
        cat_name: ''
      },
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 绑定的式cat_id
      selectKeys: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'scot'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    clearStorage () {
      window.sessionStorage.setItem('activePath', '')
      this.$router.go(0)
    },
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.cateQueryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.cateList = res.data.result
      this.cateListTotal = res.data.total
    },
    editCateInfo () {},
    handleCurrentChange (newPage) {
      this.cateQueryInfo.pagenum = newPage
      this.getCateList()
    },
    handleSizeChange (newSize) {
      this.cateQueryInfo.pagesize = newSize
      this.getCateList()
    },
    resetAddForm () {
      this.$refs.addFormRefs.resetFields()
      this.selectKeys = []
      this.addForm = {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      }
    },
    resetEditForm () {
      this.$refs.editFormRefs.resetFields()
    },
    openCateInfo () {
      this.addVisible = true
      this.getParentCateList()
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.paraentCateList = res.data
    },
    cascaderChange () {
      if (this.selectKeys.length !== 0) {
        this.addForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addForm.cat_level = this.selectKeys.length
      } else {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
    },
    addCate () {
      this.$refs.addFormRefs.validate(async (valid) => {
        if (!valid) return this.$message.error('提交信息有误')
        const { data: res } = await this.$http.post('categories', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addVisible = false
      })
    },
    deleteCate (id) {
      this.$confirm('此操作将永久删除该分类信息, 是否继续?', '删除分类', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
        const { data: res } = await this.$http.delete('categories/' + id)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getCateList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    openEditCateInfo (row) {
      this.editInfoVisible = true
      this.editForm.cat_name = row.cat_name
      this.editForm.id = row.cat_id
    },
    editCate () {
      this.$refs.editFormRefs.validate(async (valid) => {
        if (!valid) return this.$message.error('提交信息有误')
        const { data: res } = await this.$http.put('categories/' + this.editForm.id, {
          cat_name: this.editForm.cat_name
        })
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.getCateList()
        this.editInfoVisible = false
      })
    }
  }
}
</script>

<style lang="less" scope>
.treeTable {
  margin-top: 10px;
}
</style>
