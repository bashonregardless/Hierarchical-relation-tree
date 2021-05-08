import updateOnInsert from '../utils/updateOnInsert.js';

export default {
  addItem(state, payload) {
	state.items.push(payload);

	return state;
  },

  clearItem(state, payload) {
	state.items.splice(payload.index, 1);

	return state;
  },

  updateEdge(state, payload = {}) {
	console.log(state.nodeLookup);
	return {
	  ...state,
	  nodeLookup: {
		...state.nodeLookup,
		[payload.nodeId]: {
		  ...state.nodeLookup[payload.nodeId],
		  position: {
			...state.nodeLookup[payload.nodeId].position,
			x: payload.posX,
			y: payload.posY,
		  }
		}
	  }
	}
  },

  insertLeaf(state, payload) {
	var newState = {
	  ...state,
	  adjL: {
		...state.adjL,
		nodes: {
		  ...state.adjL.nodes,
		  [payload.parentId]: {
			...state.adjL.nodes[payload.parentId],
			connectedNodes: [
			  ...state.adjL.nodes[payload.parentId].connectedNodes,
			  payload.newNode
			]
		  },
		  [payload.newNode.id]: payload.newNode
		}
	  }
	}
	return updateOnInsert(state.adjL);
  },

  reposition(state, payload) {
	return updateOnInsert(state.adjL);
  }
};
