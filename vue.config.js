const debug = process.env.NODE_ENV !== "production";

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "assets",
  devServer: {
    open: true,
    inline: true,
    hot: true,
    host: "0.0.0.0", // 允许外部ip访问
    port: 8080, // 端口
    https: false, // 启用https
    proxy: {
      "/api": {
        target: "http://localhost:8089/api",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/"
        }
      }
    }
  },
  configureWebpack: config => {
    if (debug) {
      // 开发环境配置
      config.devtool = "source-map";
    }
  }
};
