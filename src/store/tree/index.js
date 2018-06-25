import actions from './actions'

export default {
  state: {
    tree: {},
    activeTree: {},
    availTreeType: [],
  },
  getters: {
    tree: (state) => state.tree.data,
    activeTree: (state) => state.activeTree.data,
    availTreeType: (state) => state.availTreeType,
  },
  mutations: {
    setTreeList (state, json) {
      state.tree = json
    },
    setActiveTreeList (state, json) {
      state.activeTree = json
    },
    setAvailTreeType (state, json) {
      state.availTreeType = json
    },
  },
  actions,
}
