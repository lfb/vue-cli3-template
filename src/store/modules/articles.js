import articles from '@api/articles';

const state = {
  list: [],
};

const mutations = {
  SET_LIST(states, data) {
    const s = states;
    s.list = data;
  },
};

const actions = {
  /**
   * 获取文章列表
   */
  async getArticleList({ commit }, params) {
    const r = await articles.list(params);
    commit('SET_LIST', r);
    return r;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
