<template>
  <div>
    <Row>
      <div class="button">
        <Button type="success" class="refresh_button" @click="refresh"
          >刷新</Button
        >
      </div>
    </Row>
    <Row>
      <Table
        size="large"
        no-data-text="成绩暂未公布"
        stripe
        border
        :loading="loadingTable"
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
    </Row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "gradeList",
  data() {
    return {
      loadingTable: false,
      columns: [
        {
          title: "课程号",
          key: "courseId",
          align: "center",
          width: "120"
        },
        {
          title: "课程名",
          key: "courseName",
          align: "center",
          width: "200",
          tooltip: true
        },
        {
          title: "教师姓名",
          key: "name",
          align: "center",
          tooltip: true
        },
        {
          title: "学分",
          key: "credit",
          align: "center",
          width: "80"
        },
        {
          title: "平时成绩",
          key: "usual",
          align: "center",
          width: "120"
        },
        {
          title: "考试成绩",
          key: "examination",
          align: "center",
          width: "120"
        },
        {
          title: "总成绩",
          key: "grade",
          align: "center",
          width: "100"
        },
        {
          title: "成绩占比",
          key: "proportion",
          align: "center",
          width: "120"
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
      this.loadingTable = true;
      this.pageCurrent = 1;
      this.nowData = [];
      this.numberOfArr = 0;
      this.data = [];
      axios({
        url: "/api/student/grade",
        method: "get"
      })
        .then(res => {
          if (res.data.code == 200) {
            res.data.data.forEach(item => {
              item.proportion = item.proportion.toString().concat("%");
              this.data.push(item);
            });
            this.numberOfArr = this.data.length;
            this.$Message.success(index);
            this.loadingTable = false;
          } else {
            this.$Message.error(res.data.message);
            this.loadingTable = false;
          }
        })
        .catch(err => {
          console.error(err);
          this.$Message.error("请检查网络连接！");
          this.loadingTable = false;
        });
    },
    refresh() {
      this.init("刷新成功!");
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
@import "gradeList";
</style>
