# vue-cli3-template
基于 Vue-cli3 搭建的前端开发项目模板，已在 vue.config.js 文件中配置好 webpack，仅供参考，开箱即用，欢迎大家围观指教！

## Webpack
- [x] Babel
- [x] Router
- [x] Vuex
- [x] Pre-Processors
- [x] Linter
- [x] Less
- [x] Axios
- [x] postcss-px2rem rem适配
- [x] ✨webpack-bundle-analyzer 文件结构可视化，找出导致体积过大的原因
- [x] ✨DllPlugin  业务代码和第三方库区分打包
- [x] ✨UglifyJsPlugin 删除冗余代码
- [x] ✨compression-webpack-plugin 开启 Gizp 压缩

## 初始化项目
```
yarn install
```

### 启动项目
```
yarn run serve
```

### 项目构建打包
```
yarn run build

# 项目构建打包且查看文件结构可视化
npm run build --report
```


### 检测 Lints
```
yarn run lint
```

### MIT
@梁凤波
