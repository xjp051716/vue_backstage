<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <div style="margin-top: 15px;">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              placeholder="请输入内容"
              v-model="queryStr"
              clearable
              @clear="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true"
              >添加用户</el-button
            >
          </el-col>
        </el-row>
      </div>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="uname"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              v-model="scope.row"
              @click="showEditDialog(scope.row.uid)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.uid)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 对话框主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">
          取 消
        </el-button>
        <el-button type="primary" @click="addUser">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.uname" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">
          取 消
        </el-button>
        <el-button type="primary" @click="editUserInfo">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkUsername = (rule, value, callback) => {
      var unameRegExp = /^[a-zA-Z][a-zA-Z\d]{4,11}$/
      if (!unameRegExp.test(value)) callback(new Error('用户名首位字符为字母，长度为5-12个字符!'))
      callback()
    }
    var checkPassword = (rule, value, callback) => {
      var upwdRegExp = /^[a-zA-Z][a-zA-Z\d]{5,14}$/
      if (!upwdRegExp.test(value)) callback(new Error('密码首位字符为字母，长度为6-15个字符!'))
      callback()
    }
    var checkEmail = (rule, value, callback) => {
      var emailRegExp = /^\w+@\w+\.\w+(\.cn)?$/
      if (!emailRegExp.test(value)) callback(new Error('邮箱格式不正确!'))
      callback()
    }
    var checkPhone = (rule, value, callback) => {
      var phoneRegExp = /^1[3-9]\d{9}$/
      if (!phoneRegExp.test(value)) callback(new Error('手机号格式不正确!'))
      callback()
    }
    return {
      // 当前页码
      pagenum: 1,
      // 当前页面数量
      pagesize: 2,
      userList: [],
      total: 0,
      // 模糊查询的参数
      queryStr: '',
      // 添加用户对话框的显示隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        phone: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: checkUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      // 修改用户对话框的显示隐藏
      editDialogVisible: false,
      // 查询到的编辑用户信息
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.axios
        .get(
          `/users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&queryStr=${this.queryStr}`
        )
        .then(res => {
          res.data.info.arr.forEach(item => {
            item.mg_state === 1
              ? (item.mg_state = true)
              : (item.mg_state = false)
          })
          this.userList = res.data.info.arr
          this.total = res.data.info.total
          // console.log(this.userList)
        })
    },
    // 监听pagesize 改变的事件
    handleSizeChange(newSize) {
      this.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.pagenum = newPage
      this.getUserList()
    },
    // 监听switch开关的状态
    userStateChanged(userInfo) {
      let type
      userInfo.mg_state === true ? (type = 1) : (type = 0)
      this.axios.put(`users/${userInfo.uid}/state/${type}`).then(res => {
        if (res.data.code !== '200') {
          userInfo.mg_state = !userInfo.mg_state
          this.$message.error('更新用户状态失败！')
        }
        this.$message.success('更新状态成功')
      })
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        this.axios
          .post('/addUser', this.qs.stringify(this.addForm))
          .then(res => {
            if (res.data.code !== '200') {
              this.$message.error('添加用户失败！')
            }
            this.$message.success('添加用户成功！')
            // 隐藏添加用户对话框
            this.addDialogVisible = false
            this.getUserList()
          })
      })
    },
    // 显示编辑用户的对话框
    showEditDialog(uid) {
      this.axios.get('/editUserInfo?uid=' + uid).then(res => {
        res = res.data.info[0]
        this.editForm = res
      })
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        // 验证通过
        this.axios
          .put('/updateUserInfo', this.qs.stringify(this.editForm))
          .then(res => {
            if (res.data.code !== '200') return this.$message.error('更新用户信息失败！')
            // 关闭对话框
            this.editDialogVisible = false
            // 重新获取刷新用户列表
            this.getUserList()
            // 提示修改成功
            this.$message.success('更新用户信息成功！')
          })
      })
    },
    // 显示编辑用户的对话框
    removeUserById(uid) {
      // 弹窗确认是否删除该用户
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios.delete('/users/' + uid).then(res => {
            if (res.data.code !== '200') return this.$message.error('删除用户失败！')
            this.$message.success('删除成功!')
            this.getUserList()
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    }
  }
}
</script>

<style></style>
