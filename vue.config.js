module.exports = {
  publicPath: "./",
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
        target: "http://localhost:8088",
        changeOrigin: true
      }
    }
  }
};
