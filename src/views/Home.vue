<template>
  <div class="container">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="22">
            <h2>XXX后台管理系统</h2>
          </el-col>
          <el-col :span="2">
            <el-button @click="logOut" type="warning" class="logout-btn"
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
          <!-- collapse-transition  没有生效 -->
          <el-menu
            :default-active="activeIndex"
            :collapse-transition="false"
            class="el-menu-vertical"
            router
            unique-opened
            :collapse="isCollapse"
          >
            <el-submenu
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
      sessionStorage.removeItem("token");
      this.$router.push("/login");
      this.$message.warning("退出登陆！");
    },
    async getAsideList() {
      const { data: res } = await this.axios.get("menus");
      this.menuList = res.data;
      console.log(this.menuList);
    },
    setActiveIndex(path) {
      sessionStorage.setItem("active", path);
    },
    getActiveIndex() {
      const active = sessionStorage.getItem("active");
      this.activeIndex = active ? active : "users";
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
      color: #333;
      line-height: 60px;
      h2 {
        font-size: 26px;
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
        height: 20px;
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
      line-height: 160px;
    }
  }
}
</style>
