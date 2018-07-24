import actions from './actions'

export default {
  state: {
    tree: {},
    treePrice: {},
    activeTree: {},
    availTreeType: [],
    allTreeCandidate: [],
  },
  getters: {
    tree: (state) => state.tree,
    activeTree: (state) => state.activeTree.data,
    availTreeType: (state) => state.availTreeType,
    treePrice: (state) => state.treePrice,
    allTreeCandidate: (state) => state.allTreeCandidate,
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
    setTreeCandidate (state, json) {
      state.allTreeCandidate = json
    },
  },
  actions,
}
