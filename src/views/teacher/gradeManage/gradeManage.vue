<template>
  <div>
    <Row>
      <div>
        <div id="className">《{{ this.$route.query.name }}》学生成绩管理</div>

        <div class="button">
          <Button type="success" class="refresh_button" @click="refresh"
            >刷新</Button
          >
          <Button type="warning" class="refresh_button" @click="back"
            >返回</Button
          >
        </div>
      </div>
    </Row>
    <Row>
      <Table
        size="large"
        no-data-text="当前课程还未有学生加入"
        stripe
        border
        :loading="tableLoading"
        height="650"
        :columns="columns"
        :data="data"
      ></Table>
      <Page
        :total="numberOfArr"
        :page-size="10"
        @on-change="changePage"
        :current="pageCurrent"
        style="text-align: center"
        show-total
        show-elevator
      />
      <Modal v-model="modal_delete" width="550">
        <p slot="header" style="color:#ff6600;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>删除确认</span>
        </p>
        <div style="text-align:center;font-size: 16px;">
          <img
            alt="图片读取失败"
            src="../../../assets/img/error.png"
            width="100"
          />
          <br /><br />
          <p>
            在进行此操作后，学生&nbsp;<span id="student-name"></span
            >&nbsp;将会被删除
          </p>
          <p>您确定要删除么</p>
        </div>
        <div slot="footer">
          <Button type="error" size="large" @click="deletion">删除</Button>
        </div>
      </Modal>
      <Modal v-model="modelChange" width="500">
        <div>姓名:{{ stuName }}</div>
        <div>
          平时成绩:
          <InputNumber
            :min="0"
            :max="100"
            v-model="updateGrade[0]"
          ></InputNumber>
        </div>
        <div>
          考试成绩:
          <InputNumber
            :min="0"
            :max="100"
            v-model="updateGrade[1]"
          ></InputNumber>
        </div>
        <Divider />
        <div>
          平时成绩占比:
          <InputNumber
            :max="100"
            v-model="updateGrade[2]"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
          ></InputNumber>
        </div>
        <div slot="footer">
          <Button type="error" size="large" @click="pushGrade">更新</Button>
        </div>
      </Modal>
    </Row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "gradeManage",
  data() {
    return {
      tableLoading: true,
      numberOfArr: 0,
      pageCurrent: 1,
      modal_delete: false,
      deleteNumber: 0,
      updateNumber: 0,
      modelChange: false,
      updateGrade: [],
      proportion: 0,
      stuName: "",
      columns: [
        {
          title: "学号",
          key: "userId",
          align: "center",
          width: "120"
        },
        {
          title: "姓名",
          key: "name",
          align: "center",
          width: "250",
          tooltip: true
        },
        {
          title: "学院",
          key: "department",
          align: "center",
          tooltip: true
        },
        {
          title: "邮箱",
          key: "email",
          align: "center",
          tooltip: true
        },
        {
          title: "平时成绩",
          key: "usual",
          align: "center",
          width: "110"
        },
        {
          title: "考试成绩",
          key: "examination",
          align: "center",
          width: "110"
        },
        {
          title: "总评成绩",
          key: "grade",
          align: "center",
          width: "110"
        },
        {
          title: "操作",
          key: "operation",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info"
                  },
                  style: {
                    marginRight: "5px",
                    height: "30px",
                    fontSize: "15px",
                    borderColor: "white"
                  },
                  on: {
                    click: () => {
                      this.changeGrade(params.index);
                    }
                  }
                },
                "成绩修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary"
                  },
                  style: {
                    height: "30px",
                    backgroundColor: "#FF7F50",
                    borderColor: "white",
                    fontSize: "15px"
                  },
                  on: {
                    click: () => {
                      this.deleteStudent(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      data: []
    };
  },
  mounted() {
    this.init("初始化成功!");
  },
  methods: {
    init(message) {
      this.tableLoading = true;
      this.pageCurrent = 1;
      this.nowData = [];
      this.numberOfArr = 0;
      this.data = [];
      axios({
        url: "/api/teacher/studentList?id=" + this.$route.query.id,
        method: "get"
      })
        .then(res => {
          if (res.data.code == 200) {
            res.data.data.gradeResList.forEach(item => {
              if (item.grade == null) item.grade = "暂未评分";
              if (item.usual == null) item.usual = "暂未评分";
              if (item.examination == null) item.examination = "暂未评分";
              this.data.push(item);
            });
            this.proportion = res.data.data.proportion;
            this.numberOfArr = this.data.length;
            this.$Message.success(message);
            this.tableLoading = false;
          } else {
            this.$Message.error(res.data.message);
            this.tableLoading = false;
          }
        })
        .catch(err => {
          console.error(err);
          this.$Message.error("请检查网络连接！");
          this.tableLoading = false;
        });
    },
    refresh() {
      this.init("刷新成功!");
    },
    changePage(index) {
      let _start = (index - 1) * 10;
      //需要显示结束数据的index
      let _end = index * 10;
      //截取需要显示的数据
      this.nowData = this.data.slice(_start, _end);
      //储存当前页
      this.pageCurrent = index;
    },
    deleteStudent(index) {
      this.modal_delete = true;
      this.deleteNumber = index;
      this.$nextTick(() => {
        document.querySelector("#student-name").innerHTML = this.data[
          this.deleteNumber
        ].name;
      });
    },
    deletion() {
      axios({
        url: "/api/teacher/studentDel",
        method: "post",
        data: {
          userId: this.data[this.deleteNumber].userId,
          courseId: this.$route.query.id
        }
      })
        .then(res => {
          if (res.data.code == 200) {
            this.$Message.success("删除成功!");
            this.init("刷新成功!");
            this.modal_delete = false;
          } else {
            this.$Message.error(res.data.message);
            this.modal_delete = false;
          }
        })
        .catch(() => {
          this.$Message.error("删除失败，请检查网络连接!");
          this.modal_delete = false;
        });
    },
    back() {
      this.$router.push("courseManage");
    },
    changeGrade(index) {
      this.stuName = this.data[index].name;
      this.updateNumber = index;
      this.updateGrade = [
        typeof this.data[index].usual === "string" ? 0 : this.data[index].usual,
        typeof this.data[index].examination === "string"
          ? 0
          : this.data[index].examination,
        this.proportion
      ];
      this.modelChange = true;
    },
    pushGrade() {
      axios({
        url: "/api/teacher/studentUpdate",
        method: "post",
        data: {
          userId: this.data[this.updateNumber].userId,
          courseId: this.$route.query.id,
          usual: this.updateGrade[0],
          examination: this.updateGrade[1],
          proportion: this.updateGrade[2]
        }
      })
        .then(res => {
          if (res.data.code == 200) {
            this.$Message.success("修改成功!");
            this.init("刷新成功!");
            this.modelChange = false;
          } else {
            this.$Message.error(res.data.message);
            this.modelChange = false;
          }
        })
        .catch(() => {
          this.$Message.error("修改失败，请检查网络连接!");
          this.modal_delete = false;
        });
    }
  }
};
</script>

<style scoped lang="scss">
@import "gradeManage";
</style>
