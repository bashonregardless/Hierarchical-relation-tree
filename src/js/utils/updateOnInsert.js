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

import POSITION_GENERATOR from './positionGenerator.js';

export default function(adjL) {
  var GRAPH_EXPLORER = Object.create(POSITION_GENERATOR);

  const ownProp = Object.prototype.hasOwnProperty;

  GRAPH_EXPLORER.setup = function setup (adjL) {
	this.exploredNodes = {};
	this.processingNodesQueue = [];
	this.backEdgeNodes = new Set();

	this.adjL = adjL;
	this.positionGeneratorSetup(this.adjL.root);
	this.buildGraph();
	this.index = 0;
	this.getOrder({ id: this.adjL.root })({ id: this.adjL.root });
	this.generateBackEdgePath();

	return {
	  rootId: this.adjL.root,
	  nodeLookup: this.exploredNodes,
	  adjL: this.adjL,
	  nodes: this.nodes,
	  minX: this.minX,
	  maxX: this.maxX,
	  maxY: this.maxY
	};
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
	const { connectedNodes } = this.adjL.nodes[processingNode.id];
	const { length: outdegree } = connectedNodes;

	if (outdegree === 0) {
	  return;
	}

	function processConnectedNodes(
	  currNode,
	  idx
	) {
	  const { id: currNodeId } = currNode;

	  /* if node hasn't been processed yet, push it to processing queue */
	  if (!ownProp.call(this.exploredNodes, currNodeId)) {
		this.insertLeafNode(processingNode.id, currNodeId);

		this.processingNodesQueue.push({
		  ...this.adjL.nodes[currNodeId],
		  forwardEdges: [],
		  backEdges: [],
		  parent: processingNode.id,
		  depth: processingNode.depth + 1,
		});

		// add discovered forward edge
		processingNode.forwardEdges.push({ id: currNodeId });
	  }
	  // else a back edge is discovered
	  else {
		processingNode.backEdges.push({ id: currNodeId });
		this.backEdgeNodes.add(processingNode.id);
	  }
	}

	connectedNodes.forEach(processConnectedNodes, this);
  }

  GRAPH_EXPLORER.buildGraph = function buildGraph() {
	if (this.adjL.root) {
	  this.processingNodesQueue.push({ 
		...this.adjL.nodes[this.adjL.root],
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

  /* ASSUMPTION:
   * In n-ary tree if the index of subtree branch is less than floor(treeEdgeCount / 2),
   * where treeEdgeCount is total number of tree edges of connected ancestor node.
   * the query node is said to lie in the left half subtrees of connected ancestor node.
   * else,
   * it is said to lie in the right half subtrees of connected ancestor node.
   *

   * Q. Find out if a node lies is in the right half subtrees or the left half subtrees
   * of connected ancestor node ?
   * Suppose the answer is left half subtrees of connected ancestor node,
   * then the back edge will emanate from left side of query node and trace a path from this
   * direction to connected ancestor node.
   */

  GRAPH_EXPLORER.getOrder = function getOrder(
	parent
  ) {
	return function order(value = {}, branchIdx) {
	  const { [value.id]: cur = {} } = this.exploredNodes,
		{
		  forwardEdges: curForwardEdges = [],
		  index: curIndex
		} = cur;

	  if (!curForwardEdges.length) {
		this.exploredNodes[value.id].index = curIndex || ++this.index;
	  }

	  curForwardEdges.forEach(this.getOrder(value), this);

	  // A node with only one child gets same index value as its descendant,
	  // since they both have same x coordinates.
	  if (this.exploredNodes[parent.id].forwardEdges.length === 1) {
		this.exploredNodes[parent.id].index = curIndex;
	  } else {
		if (branchIdx === Math.floor(this.exploredNodes[parent.id].forwardEdges.length / 2) - 1)
		  this.exploredNodes[parent.id].index = this.exploredNodes[parent.id].index || ++this.index;
	  }
	}.bind(this);
  }

  GRAPH_EXPLORER.generateBackEdgePath = function generateBackEdgePath() {
	function getDirection(ancestorId, descendantId) {
	  const {
		[descendantId]: descendant = {},
		[ancestorId]: ancestor = {}
	  } = this.exploredNodes,
		{ index: descendantIndex } = descendant,
		{ index: ancestorIndex } = ancestor;

	  return (
		(ancestorId === descendantId) ||
		(ancestorIndex === descendantIndex)
	  )
		? 'middle'
		: descendantIndex < ancestorIndex 
		? 'left'
		: 'right';
	}

	function generateAttributes(
	  descendantId, 
	  ancestorId, 
	  descendantDepth
	) {
	  const {
		forwardEdges: ancestorForwardEdges = [],
		position: ancestorPosition = {}
	  } = this.exploredNodes[ancestorId],
		{ length: ancestorForwardEdgesCount } = ancestorForwardEdges,
		// get direction
		direction = getDirection.apply(this, [ancestorId, descendantId]);

	  if (
		this.exploredNodes[descendantId].position.x !== ancestorPosition.x ||
		direction !== 'middle'
	  ) {
		// extreme branch can be either the leftmost branch of current node if
		// direction is left or,
		// it is rightmost branch of current node if direction is right
		let extremeBranch = direction === 'left'
		  ? ancestorForwardEdges[0]
		  : ancestorForwardEdges[ancestorForwardEdgesCount - 1]

		// follow extreme branch of current node until current node has
		// children and its depth is less than decendant depth
		while (
		  this.exploredNodes[extremeBranch.id].forwardEdges.length &&
		  this.exploredNodes[extremeBranch.id].depth < descendantDepth
		) {
		  const {
			forwardEdges: extremeBranchForwardEdges = []
		  } = this.exploredNodes[extremeBranch.id],
			{ length: extremeBranchForwardEdgesCount } = extremeBranchForwardEdges;

		  extremeBranch = direction === 'left'
			? extremeBranchForwardEdges[0]
			: extremeBranchForwardEdges[extremeBranchForwardEdgesCount - 1]
		}
		return [direction, this.exploredNodes[extremeBranch.id].position.x];
	  }
	  return [direction, 'middle'];
	}

	function generatePathAttributes(descendantId) {
	  function pathFoo(branch = {}, branchIndex) {
		const {
		  backEdges = {},
		  depth: descendantDepth
		} = this.exploredNodes[descendantId],
		  // get direction and calculate horizontal distance
		  [direction, horizontalDistance] = generateAttributes.apply(
			this,
			[
			  descendantId,
			  branch.id,
			  descendantDepth
			]
		  );

		// add direction and horizontalDistance properties to backedge of node
		backEdges[branchIndex].direction = direction;
		backEdges[branchIndex].horizontalDistance = horizontalDistance;
	  }
	  this.exploredNodes[descendantId].backEdges.forEach(pathFoo, this);
	}

	this.backEdgeNodes.forEach(generatePathAttributes, this);
  }

  GRAPH_EXPLORER.updateExploredNodes = function updateExlporedNodes(newPosition, connectedNodeId) {
	this.exploredNodes[connectedNodeId].position = newPosition;
  }

  return GRAPH_EXPLORER.setup(adjL);
};

