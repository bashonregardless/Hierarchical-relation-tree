'use strict'

/* Adjacency Lists:
 * The way a graph is specified is adjacency lists.
 *
 * It is a bunch of lists for each node,
 * for each node, a list tells the nodes that vertex is connected to.
 *
 * In other words, the nodes that can be reached in one step via an edge.
 */

/* Edge Classification :-
 *
 * Tree Edge: Visit new vertex via edge.
 *
 * Forward Edge: Node -> Decendant
 *
 * Back Edge: Node -> Ancestor
 */

/* Change file name to
 * data-max-od-2.js or data-many-nodes.js
 * to work with data other than the default.
 */
const state = require('../../test-data/data.js');
const POSITION_GENERATOR = require('./position-generator');

var GRAPH_EXPLORER = Object.create(
  require('./position-generator')
);

const ownProp = Object.prototype.hasOwnProperty;

GRAPH_EXPLORER.setup = function setup () {
  this.exploredNodes = {};
  this.processingNodesQueue = [];
  this.backEdgeNodes = new Set();

  this.positionGeneratorSetup(state.adjL.root);
  this.buildGraph();
  this.index = 0;
  //this.getOrder({ id: state.adjL.root })({ id: state.adjL.root });
  //this.generateBackEdgePath();

  console.log(JSON.stringify({
	rootId: state.adjL.root,
	nodeLookup: this.exploredNodes,
	nodes: this.nodes,
	adjL: state.adjL,
	minX: this.minX,
	maxX: this.maxX,
	maxY: this.maxY
  }));
}

GRAPH_EXPLORER.newProcessedNode = function newProcessedNode(
  nodeAttributes
) {
  for (let nodeAttributeKey in nodeAttributes) {
	if (ownProp.call(nodeAttributes, nodeAttributeKey)) {
	  this[nodeAttributeKey] = nodeAttributes[nodeAttributeKey];
	}
  }
}

GRAPH_EXPLORER.updateProcessingQueue = function updateProcessingQueue(
  processingNode
) {
  const { connectedNodes } = state.adjL.nodes[processingNode.id];
  const { length: outdegree } = connectedNodes;

  if (outdegree === 0) {
	return;
  }

  function processConnectedNodes(
	currNode,
	idx
  ) {
	const {
	  id: currNodeId
	} = currNode;

	/* if node hasn't been processed yet, push it to processing queue */
	if (!ownProp.call(this.exploredNodes, currNodeId)) {
	  this.insertLeafNode(processingNode.id, currNodeId);

	  this.processingNodesQueue.push({
		...state.adjL.nodes[currNodeId],
		forwardEdges: [],
		backEdges: [],
		parent: processingNode.id,
		depth: processingNode.depth + 1,
	  });

	  // add discovered forward edge
	  processingNode.forwardEdges.push({
		id: currNodeId
	  });
	}
	// else a back edge is discovered
	else {
	  processingNode.backEdges.push({
		id: currNodeId
	  });
	  this.backEdgeNodes.add(processingNode.id);
	}
  }

  connectedNodes.forEach(processConnectedNodes, this);
}

GRAPH_EXPLORER.buildGraph = function buildGraph() {
  if (state.adjL.root) {
	this.processingNodesQueue.push({ 
	  ...state.adjL.nodes[state.adjL.root],
	  forwardEdges: [],
	  backEdges: [],
	  parent: null,
	  depth: 1,
	});
  }

  while (this.processingNodesQueue.length) {
	const processingNode = this.processingNodesQueue.shift();

	this.updateProcessingQueue(processingNode);

	const {
	  connectedNodes,
	  ...processedNodeAttributes
	} = processingNode,
	  { id } = processedNodeAttributes;

	/* once node has been explored, add it to exploredQueue */
	this.exploredNodes[id] = new this.newProcessedNode(processedNodeAttributes);

	if (ownProp.call(this.tempPosStorage, id)) {
	  this.exploredNodes[id].position = this.tempPosStorage[id];
	  delete this.tempPosStorage[id];
	}
  }
}

GRAPH_EXPLORER.updateExploredNodes = function updateExlporedNodes(newPosition, connectedNodeId) {
	this.exploredNodes[connectedNodeId].position = newPosition;
}

GRAPH_EXPLORER.setup();
