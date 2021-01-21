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
          <Button type="error" size="large" long @click="del">删除</Button>
        </div>
      </Modal>
      <Modal v-model="modal_info" title="课程详情" width="1500">
        <Form :label-width="100" :model="updatedCourse_info">
          <FormItem label="课程号">
            <label>
              <Input v-model="updatedCourse_info.id" placeholder="例:1(必填)" />
            </label>
          </FormItem>
          <FormItem label="课程名">
            <label>
              <Input
                v-model="updatedCourse_info.name"
                placeholder="例:数据库原理(1)(必填)"
              />
            </label>
          </FormItem>
          <FormItem label="教师号">
            <InputNumber
              v-model="updatedCourse_info.teacherId"
              :min="1"
              placeholder="例:1(必填)"
            ></InputNumber>
          </FormItem>
          <FormItem label="教师名">
            <label>
              <Input
                v-model="updatedCourse_info.teacherName"
                placeholder="(必填)"
              />
            </label>
          </FormItem>
          <FormItem label="学分">
            <InputNumber
              v-model="updatedCourse_info.credit"
              :min="0"
            ></InputNumber>
          </FormItem>
          <FormItem label="上课地点">
            <label>
              <Input
                v-model="updatedCourse_info.address"
                placeholder="例:A315(必填)"
              />
            </label>
          </FormItem>
          <FormItem label="上课时间">
            <label>
              <Input
                v-model="updatedCourse_info.courseTime"
                placeholder="例:二:2-4;五:7-8;"
              />
            </label>
          </FormItem>
          <FormItem label="选课容量">
            <InputNumber
              v-model="updatedCourse_info.capacity"
              :min="1"
            ></InputNumber>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="info" size="large" @click="cancel_model_info"
            >取消
          </Button>
          <Button
            type="warning"
            size="large"
            v-if="disable_imple"
            @click="disable_imple = false"
            >修改</Button
          >
          <Button
            type="success"
            size="large"
            :loading="loading_change"
            v-if="!disable_imple"
            @click="save"
            >保存</Button
          >
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
          align: "center",
          tooltip: true
        },
        {
          title: "课程名",
          key: "name",
          align: "center",
          width: "200",
          tooltip: true
        },
        {
          title: "学分",
          key: "credit",
          align: "center",
          tooltip: true
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
          align: "center",
          tooltip: true
        },
        {
          title: "选课人数",
          key: "electionNum",
          align: "center",
          tooltip: true
        },
        {
          title: "操作",
          key: "operation",
          align: "center",
          width: 250,
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
              )
            ]);
          }
        }
      ],
      data: [],
      numberOfArr: 0,
      pageCurrent: 1,
      nowData: []
    };
  },
  mounted() {
    this.init("初始化成功!");
  },
  methods: {
    init(index) {
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
            this.$Message.success(index);
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
            this.$Message.error(res.data.Message);
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
            this.$Message.error(res.data.Message);
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
      axios({
        url: "/user/conferenceInfo?id=" + this.data[index].id,
        method: "get"
      })
        .then(res => {
          if (res.data.code == 200) {
            this.updatedCourse_info.addressKey = res.data.data.addressKey;
            this.updatedCourse_info.areasize = res.data.data.areasize;
            this.updatedCourse_info.building = res.data.data.building;
            this.updatedCourse_info.hasspeaker = res.data.data.hasspeaker;
            this.updatedCourse_info.haswater = res.data.data.haswater;
            this.updatedCourse_info.id = res.data.data.id;
            this.updatedCourse_info.isAble = res.data.data.isAble;
            this.updatedCourse_info.ismultifunc = res.data.data.ismultifunc;
            this.updatedCourse_info.maintaincost = res.data.data.maintaincost;
            this.updatedCourse_info.microphonecondition =
              res.data.data.microphonecondition;
            this.updatedCourse_info.name = res.data.data.name;
            this.updatedCourse_info.otherdevicecondition =
              res.data.data.otherdevicecondition;
            this.updatedCourse_info.phone = res.data.data.phone;
            this.updatedCourse_info.picture = res.data.data.picture;
            this.updatedCourse_info.roomfunction = res.data.data.roomfunction;
            this.updatedCourse_info.screensize = res.data.data.screensize;
            this.updatedCourse_info.seatnumber = res.data.data.seatnumber;
            this.updatedCourse_info.seatsize = res.data.data.seatsize;
            this.updatedCourse_info.studentAble = res.data.data.studentAble;
            this.updatedCourse_info.teacherAble = res.data.data.teacherAble;
            this.updatedCourse_info.studentDays = res.data.data.studentdays;
            this.updatedCourse_info.sameTeacherDays =
              res.data.data.sameteacherdays;
            this.updatedCourse_info.diffTeacherDays =
              res.data.data.diffteacherdays;
          } else {
            this.$Message.error(res.data.Message);
            this.modal_info = false;
          }
        })
        .catch(() => {
          this.$Message.error("加载失败，请检查网络连接!");
          this.modal_info = false;
        });
    },
    cancel_model_info() {
      this.modal_info = false;
      this.disable_imple = true;
    },
    save() {
      this.loading_change = true;
      if (
        this.updatedCourse_info.name &&
        this.updatedCourse_info.building &&
        this.updatedCourse_info.phone &&
        this.updatedCourse_info.addressKey &&
        this.updatedCourse_info.areasize &&
        this.updatedCourse_info.seatnumber &&
        this.updatedCourse_info.maintaincost
      ) {
        axios({
          url: "/manager/update",
          method: "post",
          data: {
            id: this.updatedCourse_info.id,
            name: this.updatedCourse_info.name,
            building: this.updatedCourse_info.building,
            phone: this.updatedCourse_info.phone,
            addressKey: this.updatedCourse_info.addressKey,
            studentAble: this.updatedCourse_info.studentAble,
            teacherAble: this.updatedCourse_info.teacherAble,
            isAble: this.updatedCourse_info.isAble,
            areasize: this.updatedCourse_info.areasize,
            seatnumber: this.updatedCourse_info.seatnumber,
            seatsize: this.updatedCourse_info.seatsize,
            screensize: this.updatedCourse_info.screensize,
            maintaincost: this.updatedCourse_info.maintaincost,
            roomfunction: this.updatedCourse_info.roomfunction,
            ismultifunc: this.updatedCourse_info.ismultifunc,
            hasspeaker: this.updatedCourse_info.hasspeaker,
            haswater: this.updatedCourse_info.haswater,
            microphonecondition: this.updatedCourse_info.microphonecondition,
            otherdevicecondition: this.updatedCourse_info.otherdevicecondition,
            picture: this.updatedCourse_info.picture,
            studentdays: this.updatedCourse_info.studentDays,
            sameteacherdays: this.updatedCourse_info.sameTeacherDays,
            diffteacherdays: this.updatedCourse_info.diffTeacherDays
          }
        }).then(res => {
          if (res.data.code == 200) {
            this.$Message.success("信息更新成功");
            this.init("刷新成功");

            this.disable_imple = true;
            this.loading_change = false;
            this.modal_info = false;
          } else {
            this.$Message.error(res.data.Message);

            this.disable_imple = true;
            this.loading_change = false;
            this.modal_info = false;
          }
        });
      } else {
        this.$Message.error("请完整填写有关字段");
        this.loading = false;
        this.$nextTick(() => {
          this.modal_info = true;
        });
        this.disable_imple = true;
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
    }
  }
};
</script>

<style scoped lang="scss">
@import "courseManage";
</style>
