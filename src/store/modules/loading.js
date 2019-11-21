const state = {
  loadingList: [],
  isLoading: true
}

const mutations = {
  // 开启loading
  PUSH_LOADING (states, playload) {
    states.loadingList.push({
      text: playload || '加载中..'
    })
  },
  // 递归删除loading
  SHIFT_LOADING (states) {
    states.loadingList.shift()
  }
}
const getters = {
  isLoading (states) {
    return states.loadingList.length > 0
  },
  loadingText (states) {
    return states.loadingList.length > 0 ? states.loadingList[0].text : null
  }
}
const actions = {
  /**
   * 开启loading
   * @param state
   * @param playload
   */
  openLoading (state, playload) {
    state.commit('PUSH_LOADING', playload)
  },

  /**
   * 关闭loading
   * @param state
   */
  closeLoading (state) {
    state.commit('SHIFT_LOADING')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
