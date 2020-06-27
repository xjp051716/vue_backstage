<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            {{scope.row}}
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="role_name"></el-table-column>
        <el-table-column label="角色描述" prop="role_desc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" v-model="scope.row" @click="showEditDialog(scope.row.role_id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.role_id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 对话框主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名" prop="role_name">
          <el-input v-model="addForm.role_name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="role_desc">
          <el-input v-model="addForm.role_desc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">
          取 消
        </el-button>
        <el-button type="primary" @click="addRole">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <!-- 修改角色的对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名" prop="role_name">
          <el-input v-model="editForm.role_name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="role_desc">
          <el-input v-model="editForm.role_desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">
          取 消
        </el-button>
        <el-button type="primary" @click="editRoleInfo">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      // 添加角色对话框的显示隐藏
      addDialogVisible: false,
      // 添加角色的表单数据
      addForm: {
        role_name: '',
        role_desc: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        role_name: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        role_desc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 修改用户对话框的显示隐藏
      editDialogVisible: false,
      // 查询到的编辑用户信息
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        role_name: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        role_desc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取所有角色的列表
    getRoleList() {
      this.axios.get('/roles').then(res => {
        if (res.data.code !== '200') return this.$message.error('获取角色列表失败！')
        this.roleList = res.data.info
        // console.log(this.roleList)
      })
    },
    // 监听添加角色对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新角色
    addRole() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        this.axios
          .post('/addRole', this.qs.stringify(this.addForm))
          .then(res => {
            if (res.data.code !== '200') {
              this.$message.error('添加角色失败！')
            }
            this.$message.success('添加角色成功！')
            // 隐藏添加用户对话框
            this.addDialogVisible = false
            this.getRoleList()
          })
      })
    },
    // 显示编辑角色的对话框
    showEditDialog(roleId) {
      this.axios.get('/editRoleInfo?role_id=' + roleId).then(res => {
        res = res.data.info[0]
        this.editForm = res
      })
      this.editDialogVisible = true
    },
    // 监听修改角色对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改角色信息并提交
    editRoleInfo() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        // 验证通过
        this.axios
          .put('/updateRoleInfo', this.qs.stringify(this.editForm))
          .then(res => {
            if (res.data.code !== '200') return this.$message.error('更新角色信息失败！')
            // 关闭对话框
            this.editDialogVisible = false
            // 重新获取刷新用户列表
            this.getRoleList()
            // 提示修改成功
            this.$message.success('更新角色信息成功！')
          })
      })
    },
    // 显示删除用户的对话框
    removeRoleById(roleId) {
      // 弹窗确认是否删除该用户
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios.delete('/role/' + roleId).then(res => {
            if (res.data.code !== '200') return this.$message.error('删除角色失败！')
            this.$message.success('删除成功!')
            this.getRoleList()
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    }
  }
}
</script>

<style>

</style>
