<template>
  <div class="layout">
    <Layout style="height: 100vh;">
      <Sider :width="250">
        <div class="layout-logo-left">
          <img alt="图标读取失败" src="../../assets/img/font.png" />
        </div>
        <Menu :active-name="activeName" width="251px" @on-select="push">
          <MenuItem name="courseChoice">
            <Icon type="ios-add-circle-outline" />
            <span>选课管理</span>
          </MenuItem>
          <MenuItem name="gradeList">
            <Icon type="ios-create-outline"></Icon>
            <span>我的课程</span>
          </MenuItem>
          <MenuItem name="myInfo">
            <Icon type="ios-person"></Icon>
            <span>个人信息</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header
          :style="{
            background: '#fff',
            height: '80px',
            boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'
          }"
          class="layout-header-bar"
        >
          <div class="layout-header-title" id="layout-header-title"></div>
          <div class="select">
            <Avatar style="background-color: #87d068" icon="ios-person" />
            <Dropdown>
              <a href="javascript:void(0)" class="name">
                {{ this.UserName }}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <Dropdown placement="left-start" v-if="identity.show">
                  <DropdownItem>
                    选择身份
                    <Icon type="ios-arrow-forward"></Icon>
                  </DropdownItem>
                  <DropdownMenu slot="list">
                    <DropdownItem
                      v-if="this.identity.student"
                      @click.native="$router.push('/student')"
                      >学生</DropdownItem
                    >
                    <DropdownItem
                      v-if="this.identity.teacher"
                      @click.native="$router.push('/teacher')"
                      >教师</DropdownItem
                    >
                    <DropdownItem
                      v-if="this.identity.admin"
                      @click.native="$router.push('/admin')"
                      >管理员
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <DropdownItem @click.native="$router.push('myInfo')">
                  我的信息
                </DropdownItem>
                <DropdownItem divided @click.native="logout">登出</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Header>
        <Content
          :style="{ margin: '20px', background: '#fff', minHeight: '220px' }"
          style="height:100vh; overflow-y: scroll"
        >
          <!--          <Scroll :height="contentHeight">-->
          <router-view></router-view>
          <!--          </Scroll>-->
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
export default {
  name: "student",
  data() {
    return {
      contentHeight: 450,
      isCollapsed: false,
      activeName: "",
      UserName: "",
      identityString: "",
      identity: {
        student: false,
        teacher: false,
        admin: false
      }
    };
  },
  watch: {
    $route() {
      this.$nextTick(() => {
        this.initMenuActive();
      });
    }
  },
  mounted() {
    this.contentHeight = document.body.offsetHeight - 130;
    this.initMenuActive();
    this.initIdentity();
  },
  methods: {
    initMenuActive() {
      this.activeName = this.$route.name;
      this.$nextTick(() => {
        document.querySelector(
          "#layout-header-title"
        ).innerHTML = document.querySelector(
          ".ivu-menu-item-selected span"
        ).innerHTML;
      });
      this.UserName = localStorage.getItem("username");
    },
    push(pageName) {
      this.$router.push(pageName);
    },
    initIdentity() {
      this.identityString = localStorage.getItem("identity");
      if (!this.identityString) {
        this.$router.push("/login");
        localStorage.clear();
      } else {
        if (this.identityString.indexOf("学生") !== -1) {
          this.identity.student = true;
        }
        if (this.identityString.indexOf("教师") !== -1) {
          this.identity.teacher = true;
        }
        if (this.identityString.indexOf("管理员") !== -1) {
          this.identity.admin = true;
        }
      }
    },
    logout() {
      this.$router.push("/login");
      localStorage.clear();
    }
  }
};
</script>

<style lang="scss">
@import "../group";
</style>
<style scoped>
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}

.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
</style>
