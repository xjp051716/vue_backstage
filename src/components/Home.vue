<template>
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <!-- 侧边栏菜单 -->
      <el-menu
        class="el-menu-vertical-demo"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#409bff"
        :unique-opened="true"
        :collapse="isCollapse"
        :collapse-transition="false"
        :router="true"
        :default-active="$route.path"
      >
        <!-- 一级菜单 -->
        <el-submenu
          :index="item.id + ''"
          v-for="(item, index) in menuList"
          :key="index"
        >
          <!-- 一级菜单模板区 -->
          <template slot="title">
            <!-- 图标 -->
            <i :class="item.icon"></i>
            <!-- 文本 -->
            <span>{{ item.authName }}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
            :index="'/' + item.id"
            v-for="(item, index) in item.children"
            :key="index"
          >
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{ item.childName }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 顶部区域 -->
      <el-header>
        <div @click="toggleCollapse" class="toggle-button">
          <img src="../assets/hamburger.png" alt="" width="30px" height="30px">
        </div>
        <div>
          <img src="../assets/logo2.png" alt="" />
          <span>小公举零食商城管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 右侧主体内容 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="less" scoped>
.el-header {
  background-color: #ffffff;
  color: #fb7299;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 5px;
    }
  }
}
.el-aside {
  background-color: #304156;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #e9eef3;
}
.home-container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
</style>

<script>
export default {
  data() {
    return {
      menuList: [
        {
          id: 1,
          authName: '分类管理',
          icon: 'iconfont icon-tijikongjian',
          children: [
            {
              id: 'categories',
              childName: '商品分类'
            }
          ]
        },
        {
          id: 2,
          authName: '商品管理',
          icon: 'iconfont icon-shangpin',
          children: [
            {
              id: 'products',
              childName: '商品列表'
            }
          ]
        },
        {
          id: 3,
          authName: '订单管理',
          icon: 'iconfont icon-danju',
          children: [
            {
              id: 'orders',
              childName: '订单列表'
            }
          ]
        },
        {
          id: 4,
          authName: '用户管理',
          icon: 'iconfont icon-user',
          children: [
            {
              id: 'users',
              childName: '用户列表',
              icon: 'iconfont icon-users'
            }
          ]
        },
        {
          id: 5,
          authName: '数据统计',
          icon: 'iconfont icon-baobiao',
          children: [
            {
              id: 5.1,
              childName: '销量统计'
            }
          ]
        }
      ],
      // 是否折叠
      isCollapse: false
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 点击按钮切换侧栏折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>
