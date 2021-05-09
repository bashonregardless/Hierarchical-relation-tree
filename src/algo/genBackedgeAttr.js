/* This code has been extracted from file flow-algo.js. 
 * It is used to make back edge.
 */

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
