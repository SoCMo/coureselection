<template>
  <div class="login">
    <div class="filter">
      <div class="SysTitle">
        学生选课管理系统
        <div class="login-box">
          <label>
            <Input
              v-model="UserId"
              style="margin-bottom: 10px"
              size="large"
              prefix="md-person"
              placeholder="学/工号"
            />
            <Input
              v-model="Password"
              password
              type="password"
              style="margin-bottom: 7px"
              prefix="md-lock"
              size="large"
              placeholder="密码"
              v-on:keyup.enter.native="login"
            />
            <ButtonGroup size="large">
              <div style="display: flex;">
                <Button
                  size="large"
                  type="primary"
                  :loading="loading"
                  @click="login"
                >
                  登录
                </Button>
              </div>
            </ButtonGroup>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "login",
  data() {
    return {
      UserId: "",
      Password: "",
      loading: false
    };
  },
  mounted() {
    let token = localStorage.getItem("token");
    if (token) {
      let lst = localStorage.getItem("last");
      if (lst != null && lst !== "/login") {
        this.$router.push(localStorage.getItem("last"));
        localStorage.removeItem("last");
      } else this.$router.push(localStorage.getItem("mainPage"));
    }
  },
  methods: {
    login() {
      this.loading = true;
      axios({
        url: "api/login",
        method: "post",
        data: {
          userId: this.UserId,
          password: this.Password
        }
      })
        .then(res => {
          if (res.data.code === 200) {
            this.loading = false;
            //登陆成功直接进入普通用户界面
            this.$Message.success("登录成功！");
            localStorage.setItem("token", res.data.data.token);
            localStorage.setItem("userid", res.data.data.userId);
            localStorage.setItem("username", res.data.data.name);
            localStorage.setItem("identity", res.data.data.identity);
            localStorage.setItem(
              "mainPage",
              this.getMainPage(res.data.data.identity)
            );
            if (localStorage.getItem("last")) {
              let lst = localStorage.getItem("last");
              if (lst === "/login") {
                this.$router.push(localStorage.getItem("mainPage"));
              } else {
                this.$router.push(localStorage.getItem("last"));
                localStorage.removeItem("last");
              }
            } else this.$router.push(localStorage.getItem("mainPage"));
          } else {
            this.$Message.error(res.data.message);
            this.loading = false;
          }
        })
        .catch(err => {
          console.error(err);
          this.$Message.error("登录失败，请检查网络连接！");
          this.loading = false;
        });
    },
    getMainPage(identity) {
      if (identity.indexOf("教师") !== -1) {
        return "/teacher";
      } else if (identity.indexOf("学生") !== -1) {
        return "/student";
      } else if (identity.indexOf("管理员") !== -1) {
        return "/admin";
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "login";
</style>

<style lang="scss">
.login-box {
  .ivu-input {
    background-color: transparent;
    color: #f8f8f9ab;
  }
}
</style>
