import axios from "axios";
import Router from "../router";

axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = localStorage.getItem("token");
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  res => {
    return res;
  },
  error => {
    if (error.response.status === 403 || error.response.status === 401) {
      localStorage.clear();
      Router.replace({ path: "/login" });
    } else {
      if (localStorage.getItem("token")) {
        localStorage.clear();
      }
      let url = document.location.toString();
      let arr = url.split("//");
      let last = arr[1].substring(arr[1].indexOf("/"));
      if (last !== "/login") {
        localStorage.setItem("last", last);
      }
      Router.push({ name: "login" });
    }

    setTimeout(() => {
      this.$Notice.error({
        title: "请先登录",
        content:
          "您没有访问该页面的权限，或许是因为您的用户身份与该页面不一致，请重新登录，系统会自动跳转到相应页面。",
        duration: 5
      });
    }, 1500);
    return Promise.reject(error);
  }
);
