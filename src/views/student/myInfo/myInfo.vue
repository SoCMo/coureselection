I<template>
  <div class="wrapper">
    <div class="content">
          <Form
            :model="person_info"
            :label-width="80"
            style="width: 500px;text-align: center"
            size="large"
          >
            <FormItem label="姓名:">
              <label>
                <Input v-model="person_info.name" readonly />
              </label>
            </FormItem>
            <br />
            <FormItem label="学/工号:">
              <label>
                <Input v-model="person_info.userId" readonly />
              </label>
            </FormItem>
            <br />
            <FormItem label="手机:">
              <label>
                <Input v-model="person_info.mobilePhone" :disabled="disable_impl" />
              </label>
            </FormItem>
            <br />
            <FormItem label="部门:">
              <label>
                <Input v-model="person_info.department" readonly />
              </label>
            </FormItem>
            <br />
            <FormItem label="邮箱:">
              <label>
                <Input v-model="person_info.email" :disabled="disable_impl" />
              </label>
            </FormItem>
            <div style="text-align: center;">
              <Button
                type="primary"
                size="large"
                style="margin-left: 45px"
                v-if="disable_impl"
                @click="disable_impl = !disable_impl"
                >修改</Button
              >
              <Button
                size="large"
                style="margin-left: 45px"
                v-if="!disable_impl"
                @click="cancel"
                >取消</Button
              >
              <Button
                type="success"
                size="large"
                style="margin-left: 45px"
                :loading="loading"
                v-if="!disable_impl"
                @click="updatePersonInfo"
                >保存</Button
              >
            </div>
          </Form>
      <br />
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "managerInfo",
  data() {
    return {
      disable_impl: true,
      loading: false,
      person_info: {},
      department_info: {}
    };
  },
  mounted() {
    this.initPerson("获取个人信息成功！");
    this.initDepartment("获取部门信息成功！");
  },
  methods: {
    initPerson(index) {
      let id = localStorage.getItem("userid");
      axios({
        url: "/api/user/info?userId=" + id,
        method: "get"
      })
        .then(res => {
          if (res.data.code === 200) {
            this.person_info = res.data.data;
            if (index !== "") {
              this.$Message.success(index);
            }
          } else {
            this.$Message.error("初始化失败！");
          }
        })
        .catch(() => {
          this.$Message.error("请检查网络连接!");
        });
    },
    initDepartment(index) {
      axios({
        url: "/api/user/departmentInfo",
        method: "get"
      })
        .then(res => {
          if (res.data.code === 200) {
            this.department_info = res.data.data;
            if (index !== "") {
              this.$Message.success(index);
            }
          } else {
            this.$Message.error("初始化失败！");
          }
        })
        .catch(() => {
          this.$Message.error("请检查网络连接!");
        });
    },
    updatePersonInfo() {
      this.loading = true;
      axios({
        url: "/api/user/userInfoUpdate",
        method: "post",
        data: {
          userId: this.person_info.userId,
          email: this.person_info.email,
          phone: this.person_info.mobilePhone
        }
      })
        .then(res => {
          if (res.data.code === 200) {
            this.initPerson("更新成功！");
            this.disable_impl = true;
            this.loading = false;
          } else {
            this.$Message.error(res.data.message);
            this.initPerson("");
            this.disable_impl = true;
            this.loading = false;
          }
        })
        .catch(() => {
          this.$Message.error("个人信息更新失败，请检查网络连接！");
          this.initPerson("");
          this.disable_impl = true;
          this.loading = false;
        });
    },
    cancel() {
      this.disable_impl = true;
      this.initPerson("");
    }
  }
};
</script>

<style scoped lang="scss">
@import "myInfo";
</style>

<style scoped lang="scss">
.wrapper {
  margin-top: 0px;
  margin-left: 0px;
  width: 100%;
}
.ivu-form-item-label {
  font-size: 24px;
}

.ivu-tabs-tabpane {
  margin-top: calc(10vh - 0px);
  padding-left: calc(25vw);
}
</style>
