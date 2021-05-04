<template>
  <div class="container">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="23">
            <h2>XXX后台管理系统</h2>
          </el-col>
          <el-col :span="1">
            <el-button
              @click="logOut"
              size="mini"
              type="info"
              class="logout-btn"
              >退出</el-button
            >
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse ? '60px' : '200px'">
          <div class="isCollapse" @click="changeCollapse">
            <span>| | |</span>
          </div>
          <!-- 自定义颜色 -->
          <!-- background-color="#fff"
            text-color="#ccc"
            active-text-color="#409EFF" -->
          <el-menu
            :default-active="activeIndex"
            :collapse-transition="false"
            class="el-menu-vertical"
            router
            unique-opened
            :collapse="isCollapse"
          >
            <el-submenu
              :show-timeout="100"
              :hide-timeout="100"
              :index="item.path"
              v-for="item of menuList"
              :key="item.id"
            >
              <template slot="title">
                <i :class="icons[item.path]"></i>
                <span slot="title">{{ item.authName }}</span>
              </template>
              <el-menu-item
                :index="i.path"
                v-for="i of item.children"
                :key="i.id"
                @click="setActiveIndex(i.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span slot="title">{{ i.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      activeIndex: "",
      isCollapse: false,
      icons: {
        users: "fa fa-user",
        rights: "fa fa-unlock-alt",
        goods: "fa fa-shopping-cart",
        orders: "fa fa-calendar",
        reports: "fa fa-bar-chart",
      },
    };
  },
  created() {
    this.getAsideList();
  },
  mounted() {
    this.getActiveIndex();
  },
  methods: {
    logOut() {
      sessionStorage.clear();
      this.$router.push("/login");
      this.$message.warning("退出登陆！");
    },
    async getAsideList() {
      const { data: res } = await this.axios.get("menus");
      // 结局路由问题
      res.data.forEach((item) => {
        item.path = "/" + item.path;
        item.children.forEach((i) => {
          i.path = "/" + i.path;
        });
      });
      this.menuList = res.data;
      console.log(this.menuList);
    },
    setActiveIndex(path) {
      sessionStorage.setItem("active", path);
    },
    getActiveIndex() {
      const active = sessionStorage.getItem("active");
      this.activeIndex = active;
    },
    changeCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      background-color: #b3c0d1;
      height: 44px !important;
      color: #333;
      line-height: 44px;
      h2 {
        font-size: 22px;
      }
    }
    .el-aside {
      // 禁止用户选中菜单栏文字
      user-select: none;
      background-color: #d3dce6;
      color: #333;
      line-height: 200px;
      .fa {
        margin-right: 10px;
      }
      .isCollapse {
        height: 2%;
        line-height: 20px;
        text-align: center;
        cursor: pointer;
        background-color: #ccc;
        span {
          color: #947373;
          font-weight: bold;
        }
      }
    }
    .el-main {
      background-color: #e9eef3;
      color: #333;
      //   line-height: 160px;
    }
    .el-menu-vertical {
      height: 98%;
    }
  }
}
</style>
