import Vue from "vue";
import VueRouter from "vue-router";
import error404 from "../views/error404/error404";
import login from "../group/login/login";
import student from "@/group/student/student";

import myInfo from "@/views/student/myInfo/myInfo";
import teacher from "@/group/teacher/teacher";
import courseManage from "@/views/teacher/courseManage/courseManage";
import courseChoice from "@/views/student/courseChoice/courseChoice";
import gradeManage from "@/views/teacher/gradeManage/gradeManage";
import gradeList from "@/views/student/gradeList/gradeList";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    name: "error404",
    component: error404
  },
  {
    path: "/",
    redirect: { name: "login" }
  },
  {
    path: "/login",
    name: "login",
    component: login
  },
  {
    path: "/student",
    component: student,
    redirect: { name: "courseChoice" },
    children: [
      {
        path: "myInfo",
        component: myInfo,
        name: "myInfo"
      },
      {
        path: "courseChoice",
        component: courseChoice,
        name: "courseChoice"
      },
      {
        path: "gradeList",
        component: gradeList,
        name: "gradeList"
      }
    ]
  },
  {
    path: "/teacher",
    component: teacher,
    redirect: { name: "teacher_myInfo" },
    children: [
      {
        path: "gradeManage",
        component: gradeManage,
        name: "gradeManage"
      },
      {
        path: "teacher_myInfo",
        component: myInfo,
        name: "teacher_myInfo"
      },
      {
        path: "courseManage",
        component: courseManage,
        name: "courseManage"
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
