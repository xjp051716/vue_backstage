<template>
  <div class="login_container">
    <div class="title">
      <p>小公举零食商城</p>
      <p>管理系统</p>
    </div>
    <!-- 登陆盒子 -->
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/avatar/00da335a266f21a80120ba3858f56a.jpg" alt="" />
      </div>
      <!-- 登陆表单区域 -->
      <el-form
        ref="loginFormRef"
        status-icon
        :model="loginForm"
        :rules="loginFormRules"
        label-width="50px"
        class="login_form"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            :type="ispwd"
          >
            <i
              slot="suffix"
              class="iconfont icon-showpassword eye"
              @click="showpassword"
            ></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.title {
  color: #fff;
  padding-top: 120px;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
}
.eye {
  margin-right: 5px;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  width: 90px;
  height: 90px;
  border: 1px solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.login_form {
  position: absolute;
  bottom: 15px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>

<script>
export default {
  data() {
    return {
      ispwd: 'password',
      // 登陆表单数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登陆名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登陆表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    showpassword() {
      if (this.ispwd === 'password') this.ispwd = 'text'
      else this.ispwd = 'password'
    },
    login() {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) return
        // const { data: res } = await this.axios.post('/login', this.loginForm)
        this.axios.post('/adminLogin', this.qs.stringify(this.loginForm)).then(res => {
          res = res.data
          if (res.code !== 200) return this.$message.error('登录失败')
          this.$message.success('登录成功')
          window.sessionStorage.setItem('token', res.info.token)
          this.$router.push('/home')
        })
      })
    }
  }
}
</script>
