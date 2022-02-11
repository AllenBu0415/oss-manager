# oss-manager

基于阿里云 OSS SDK开发的文件上传助手,将打包后的资源文件上传至 OSS 做 CDN 分发

### 安装

```shell
npm install -D oss-manager
```

### 使用

```javascript
// vue.config.js

const ossManager = require("oss-manager")

module.exports = {
  publicPath: 'OSS 访问路径',
  assetsDir: "静态文件打包位置",
  configureWebpack: {
    plugins: [new ossManager({
      accessKeyId: '阿里云 accessKeyId',
      accessKeySecret: "阿里云 accessKeySecret",
      region: "阿里云 region",
      bucket: "阿里云 bucket",
      customPath: "自定义的路径，非必填",
      timeout: "超时时间，默认为60000ms，非必填",
      folderPath: 'assets/**/**.*'  // 静态文件位置，和筛选
    })]
  }
}


```
