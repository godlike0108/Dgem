import actions from './actions'

export default {
  state: {
    tree: {},
    treePrice: {},
    activeTree: {},
    availTreeType: [],
  },
  getters: {
    tree: (state) => state.tree,
    activeTree: (state) => state.activeTree.data,
    availTreeType: (state) => state.availTreeType,
    treePrice: (state) => state.treePrice,
  },
  mutations: {
    setTreeList (state, json) {
      state.tree = json
    },
    setTreePrice (state, json) {
      state.treePrice = json
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
