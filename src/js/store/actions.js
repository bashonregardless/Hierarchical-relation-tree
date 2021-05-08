export default {
  addItem(context, payload) {
	context.commit('addItem', payload);
  },
  clearItem(context, payload) {
	context.commit('clearItem', payload);
  },
  updateEdge(context, payload) {
	context.commit('updateEdge', payload);
  },
  insertLeaf(context, payload) {
	context.commit('insertLeaf', payload);
  },
  reposition(context, payload) {
	context.commit('reposition', payload);
  }
};
