import articles from '@api/articles'

const state = {}

const mutations = {}

const actions = {
  /**
   * 获取文章列表
   */
  async getArticleList ({ state, commit }, params) {
    const r = await articles.list(params)
    return r
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
