import fetch from './fetch';

export default {
  // 获取文章列表
  list(params) {
    return fetch.get('/article', params);
  },
};
