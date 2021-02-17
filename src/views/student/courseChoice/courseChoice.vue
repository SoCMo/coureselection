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
        no-data-text="当前没有可供选择的课程"
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
  name: "courseManage",
  data() {
    return {
      loadingTable: false,
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
            let include = this.chosen.includes(params.row.id);
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: include ? "warning" : "info",
                    disable: this.chosen.includes(params.row.id)
                  },
                  style: {
                    height: "30px",
                    borderColor: "white",
                    fontSize: "15px"
                  },
                  on: {
                    click: () => {
                      if (include) {
                        this.drop(params.row.id);
                      } else {
                        this.choose(params.row.id);
                      }
                    }
                  }
                },
                include ? "退课" : "选课"
              )
            ]);
          }
        }
      ],
      data: [],
      numberOfArr: 0,
      pageCurrent: 1,
      nowData: [],
      chosen: []
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
      this.chosen = [];
      axios({
        url: "/api/student/list",
        method: "get"
      })
        .then(res => {
          if (res.data.code == 200) {
            res.data.data.courseVoList.forEach(item => {
              this.data.push(item);
            });
            res.data.data.chosenList.forEach(item => {
              this.chosen.push(item);
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
    },
    choose(index) {
      this.loadingTable = true;
      axios({
        url: "/api/student/choice?id=" + index,
        method: "get"
      })
        .then(res => {
          if (res.data.code == 200) {
            this.$Message.success("选课成功!");
            this.chosen.push(index);
            let dataIndex = this.data.findIndex(item => {
              return item.id === index;
            });
            this.data[dataIndex].electionNum += 1;
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
    drop(index) {
      this.loadingTable = true;
      axios({
        url: "/api/student/dropping?id=" + index,
        method: "get"
      })
        .then(res => {
          if (res.data.code == 200) {
            this.$Message.success("退课成功!");
            let chosenIndex = this.chosen.indexOf(index);
            this.chosen.splice(chosenIndex, 1);
            let dataIndex = this.data.findIndex(item => {
              return item.id === index;
            });
            this.data[dataIndex].electionNum -= 1;
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
    }
  }
};
</script>

<style scoped lang="scss">
@import "courseChoice";
</style>
