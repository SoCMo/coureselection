<template>
  <div>
    <Row>
      <div class="button">
        <Button type="success" class="refresh_button" @click="refresh"
          >刷新</Button
        >
        <Button type="primary" @click="modal_create = !modal_create">
          创建课程
        </Button>
        <Modal
          v-model="modal_create"
          title="创建课程"
          :loading="loading"
          width="1000"
          ok-text="提交"
          @on-ok="createCourse"
        >
          <Form :label-width="100" :model="course_info">
            <FormItem label="课程名">
              <label>
                <Input
                  v-model="course_info.name"
                  placeholder="例:数据库原理(1)(必填)"
                />
              </label>
            </FormItem>
            <FormItem label="学分">
              <InputNumber v-model="course_info.credit" :min="1"></InputNumber>
            </FormItem>
            <FormItem label="上课地点">
              <label>
                <Input
                  v-model="course_info.address"
                  placeholder="例A315(必填)"
                />
              </label>
            </FormItem>
            <FormItem label="上课时间">
              <label>
                <Input
                  v-model="course_info.courseTime"
                  placeholder="例:二:2-4;五:7-8(请按格式填写)"
                />
              </label>
            </FormItem>
            <FormItem label="选课容量">
              <InputNumber
                v-model="course_info.capacity"
                :min="1"
              ></InputNumber>
            </FormItem>
          </Form>
        </Modal>
      </div>
    </Row>
    <Row>
      <Table
        size="large"
        no-data-text="您当前没有可供管理的课程"
        stripe
        border
        :loading="loading2"
        height="650"
        :columns="columns"
        :data="data"
      ></Table>
      <Page
        :total="numberOfArr"
        :page-size="10"
        @on-change="changepage"
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
            在进行此操作后，课程&nbsp;<span id="course-name"></span
            >&nbsp;将会被删除
          </p>
          <p>您确定要删除么</p>
        </div>
        <div slot="footer">
          <Button type="error" size="large" @click="del">删除</Button>
        </div>
      </Modal>
      <Modal
        v-model="modal_info"
        title="课程详情"
        width="800"
        @on-cancel="cancel_model_info"
      >
        <Form :label-width="100" :model="updatedCourse_info">
          <Row>
            <Col span="10">
              <FormItem label="课程号">
                <label>
                  <Input v-model="updatedCourse_info.id" disabled />
                </label>
              </FormItem>
              <FormItem label="课程名">
                <label>
                  <Input v-model="updatedCourse_info.name" disabled />
                </label>
              </FormItem>
              <FormItem label="教师号">
                <Input v-model="updatedCourse_info.teacherId" disabled />
              </FormItem>
              <FormItem label="教师名">
                <label>
                  <Input v-model="updatedCourse_info.teacherName" disabled />
                </label>
              </FormItem>
              <FormItem label="学分">
                <InputNumber
                  v-model="updatedCourse_info.credit"
                  :min="0"
                  :disabled="disable_imple"
                ></InputNumber>
              </FormItem>
              <FormItem label="上课地点">
                <label>
                  <Input
                    v-model="updatedCourse_info.address"
                    placeholder="例:A315(必填)"
                    :disabled="disable_imple"
                  />
                </label>
              </FormItem>
              <FormItem label="选课容量">
                <InputNumber
                  v-model="updatedCourse_info.capacity"
                  :min="1"
                  :disabled="disable_imple"
                ></InputNumber>
              </FormItem>
            </Col>
            <Col span="14">
              <FormItem label="上课时间:">
                <Button type="success" @click="addTime" v-show="!disable_imple"
                  >添加<Icon type="md-add"
                /></Button>
              </FormItem>
              <div v-for="(item, i) in timeData" class="courseTime" :key="i">
                <Icon
                  type="md-close"
                  v-show="!disable_imple"
                  @click="deleteTime(i)"
                  :color="color[i]"
                  @mouseover.native="deleteOver(i)"
                  @mouseout.native="deleteOut(i)"
                />
                周
                <label>
                  <Select
                    v-model="item.weekday"
                    style="width:50px"
                    :disabled="disable_imple"
                  >
                    <Option
                      v-for="num in weekTime"
                      :value="num.value"
                      :key="num.value"
                      >{{ num.label }}</Option
                    >
                  </Select>
                </label>
                <label>
                  第
                  <Select
                    v-model="item.beginTime"
                    style="width:50px"
                    :disabled="disable_imple"
                  >
                    <Option v-for="num in 13" :value="num" :key="num">{{
                      num
                    }}</Option>
                  </Select>
                  节
                  <span>至</span>
                  第
                  <Select
                    v-model="item.endTime"
                    style="width:50px"
                    :disabled="disable_imple"
                  >
                    <Option v-for="num in 13" :value="num" :key="num">{{
                      num
                    }}</Option>
                  </Select>
                  节
                </label>
                <label v-if="item.endTime < item.beginTime">
                  <Icon type="ios-sad" />
                  错误
                </label>
              </div>
            </Col>
          </Row>
        </Form>
        <div slot="footer">
          <Button
              type="warning"
              size="large"
              v-if="disable_imple"
              @click="disable_imple = false"
          >修改
          </Button>
          <Button
              v-if="!disable_imple"
              :loading="loading_change"
              size="large"
              type="success"
              @click="save"
          >保存
          </Button>
          <Button
              v-if="!disable_imple"
              :loading="loading_change"
              size="large"
              type="warning"
              @click="
              modal_info = false;
              disable_imple = true;
            "
          >取消
          </Button>
        </div>
      </Modal>
    </Row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "courseManage",
  data() {
    return {
      loading: false,
      loading2: false,
      loading_change: false,
      loading_upload: false,
      modal_create: false,
      modal_delete: false,
      modal_info: false,
      disable_imple: true,
      color: [],
      weekTime: [
        {
          value: "一",
          label: "一"
        },
        {
          value: "二",
          label: "二"
        },
        {
          value: "三",
          label: "三"
        },
        {
          value: "四",
          label: "四"
        },
        {
          value: "五",
          label: "五"
        },
        {
          value: "六",
          label: "六"
        },
        {
          value: "七",
          label: "日"
        }
      ],
      course_info: {
        id: 0,
        name: "",
        teacherId: 0,
        teacherName: "",
        credit: 0,
        address: "",
        courseTime: "",
        capacity: 0,
        electionNum: 0
      },
      updatedCourse_info: {
        id: 0,
        name: "",
        teacherId: 0,
        teacherName: "",
        credit: 0,
        address: "",
        courseTime: "",
        capacity: 0,
        electionNum: 0
      },
      deleteNumber: 0,
      columns: [
        {
          title: "课程号",
          key: "id",
          align: "center"
        },
        {
          title: "课程名",
          key: "name",
          align: "center",
          width: "250",
          tooltip: true
        },
        {
          title: "学分",
          key: "credit",
          align: "center",
          width: "50"
        },
        {
          title: "上课时间",
          key: "courseTime",
          align: "center",
          width: "200",
          tooltip: true
        },
        {
          title: "上课地点",
          key: "address",
          align: "center",
          tooltip: true
        },
        {
          title: "容量",
          key: "capacity",
          align: "center"
        },
        {
          title: "选课人数",
          key: "electionNum",
          align: "center"
        },
        {
          title: "操作",
          key: "operation",
          align: "center",
          width: 300,
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
                      this.getCourse_info(params.index);
                    }
                  }
                },
                "管理"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary"
                  },
                  style: {
                    marginRight: "5px",
                    height: "30px",
                    backgroundColor: "#FF7F50",
                    borderColor: "white",
                    fontSize: "15px"
                  },
                  on: {
                    click: () => {
                      this.deleteCourse(params.index);
                    }
                  }
                },
                "删除"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary"
                  },
                  style: {
                    height: "30px",
                    backgroundColor: "#FF8C00",
                    borderColor: "white",
                    fontSize: "15px"
                  },
                  on: {
                    click: () => {
                      console.info(params);
                      this.$router.push({
                        name: "gradeManage",
                        query: { id: params.row.id, name: params.row.name }
                      });
                    }
                  }
                },
                "学生成绩"
              )
            ]);
          }
        }
      ],
      data: [],
      timeData: [],
      numberOfArr: 0,
      pageCurrent: 1,
      nowData: []
    };
  },
  mounted() {
    this.init("初始化成功!");
  },
  methods: {
    init(message) {
      this.loading2 = true;
      this.pageCurrent = 1;
      this.nowData = [];
      this.numberOfArr = 0;
      this.data = [];
      axios({
        url: "/api/teacher/list",
        method: "get"
      })
        .then(res => {
          if (res.data.code == 200) {
            res.data.data.forEach(item => {
              this.data.push(item);
            });
            this.numberOfArr = this.data.length;
            this.$Message.success(message);
            this.loading2 = false;
          } else {
            this.$Message.error(res.data.message);
            this.loading2 = false;
          }
        })
        .catch(err => {
          console.error(err);
          this.$Message.error("请检查网络连接！");
          this.loading2 = false;
        });
    },
    createCourse() {
      this.loading = true;
      if (
        this.course_info.name &&
        this.course_info.credit &&
        this.course_info.address &&
        this.course_info.courseTime &&
        this.course_info.capacity
      ) {
        axios({
          url: "/api/teacher/creation",
          method: "post",
          data: {
            name: this.course_info.name,
            credit: this.course_info.credit,
            address: this.course_info.address,
            courseTime: this.course_info.courseTime,
            capacity: this.course_info.capacity
          }
        }).then(res => {
          if (res.data.code == 200) {
            this.$Message.success("创建成功");
            this.init("刷新成功");
            this.loading = false;
          } else {
            this.$Message.error(res.data.message);
            this.loading = false;
          }
        });
      } else {
        this.$Message.info("请完整填写有关字段");
        this.loading = false;
        this.$nextTick(() => {
          this.modal_create = true;
        });
      }
    },
    refresh() {
      this.init("刷新成功!");
    },
    deleteCourse(index) {
      this.modal_delete = true;
      this.deleteNumber = index;
      this.$nextTick(() => {
        document.querySelector("#course-name").innerHTML = this.data[
          this.deleteNumber
        ].name;
      });
    },
    del() {
      axios({
        url: "/api/teacher/deletion?id=" + this.data[this.deleteNumber].id,
        method: "get"
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
    getCourse_info(index) {
      this.modal_info = true;
      this.updatedCourse_info = JSON.parse(JSON.stringify(this.data[index]));
      this.timeData = [];
      this.color = [];
      let dayArray = this.updatedCourse_info.courseTime.split(";");
      for (let day of dayArray) {
        if (day === "" || day == null) continue;
        let item = {};
        item.weekday = day.charAt(1);
        let onTheDay = day.split(":")[1];
        item.beginTime = parseInt(onTheDay.split("-")[0]);
        item.endTime = parseInt(onTheDay.split("-")[1]);
        this.timeData.push(item);
        this.color.push("#000000");
      }
    },
    cancel_model_info() {
      this.modal_info = false;
      this.disable_imple = true;
    },
    save() {
      this.loading_change = true;
      if (!this.saveTime()) {
        this.loading_change = false;
        return;
      }
      if (
          this.updatedCourse_info.id &&
          this.updatedCourse_info.credit &&
          this.updatedCourse_info.address &&
          this.updatedCourse_info.courseTime &&
          this.updatedCourse_info.capacity
      ) {
        axios({
          url: "/api/teacher/update",
          method: "post",
          data: {
            id: this.updatedCourse_info.id,
            credit: this.updatedCourse_info.credit,
            address: this.updatedCourse_info.address,
            courseTime: this.updatedCourse_info.courseTime,
            capacity: this.updatedCourse_info.capacity
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.init("刷新成功");
            this.$Message.success("信息更新成功");
            this.disable_imple = true;
            this.loading_change = false;
            this.modal_info = false;
          } else {
            this.$Message.error(res.data.message);
            this.loading_change = false;
          }
        });
      } else {
        this.$Message.error("请完整填写有关字段");
        this.loading = false;
        this.$nextTick(() => {
          this.modal_info = true;
        });
        this.disable_imple = false;
        this.loading_change = false;
        this.modal_info = false;
      }
    },
    changepage(index) {
      let _start = (index - 1) * 10;
      //需要显示结束数据的index
      let _end = index * 10;
      //截取需要显示的数据
      this.nowData = this.data.slice(_start, _end);
      //储存当前页
      this.pageCurrent = index;
    },
    addTime() {
      let item = {
        weekday: "一",
        beginTime: 1,
        endTime: 1
      };
      this.timeData.push(item);
      this.color.push("#000000");
    },
    saveTime() {
      this.updatedCourse_info.courseTime = "";
      for (let day of this.timeData) {
        if (day.beginTime > day.endTime) {
          this.$Message.error("时间格式错误！");
          return false;
        }
        this.updatedCourse_info.courseTime = this.updatedCourse_info.courseTime.concat(
            "周",
            day.weekday,
            ":",
            day.beginTime,
            "-",
            day.endTime,
            ";"
        );
      }
      return true;
    },
    deleteTime(index) {
      this.timeData.splice(index, 1);
      this.color.splice(index, 1);
    },
    deleteOver(i) {
      this.$set(this.color, i, "#FF0000");
    },
    deleteOut(i) {
      this.$set(this.color, i, "#000000");
    }
  }
};
</script>

<style scoped lang="scss">
@import "courseManage";
</style>
