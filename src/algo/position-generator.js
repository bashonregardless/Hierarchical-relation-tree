'use strict'

var POSITION_GENERATOR = {};

POSITION_GENERATOR.positionGeneratorSetup = function positionGeneratorSetup (
  rootId
) {
  this.boxWidth = 300;
  this.boxHeight = 300;

  if (rootId) {
	this.nodes = {
	  id: rootId,
	  position: {
		x: 0,
		y: 20,
	  },
	  connectedNodes: [],
	}
	this.tempPosStorage = { [rootId]: {} };
	this.tempPosStorage[rootId] = { x: 0, y: 20 }
  }

  this.minX = 0;
  this.maxX = 0;
  this.maxY = 0;
}

POSITION_GENERATOR.insertLeafNode = function insertLeafNode (
  processingNodeId, id
) {
  function insertNode (curr) {
	if (curr.id === processingNodeId) {
	  curr.connectedNodes.push({
		id,
		position: {},
		connectedNodes: [],
	  });
	  return;
	}
	curr.connectedNodes.forEach(insertNode);
  }
  insertNode(this.nodes);

  this.reposition(this.nodes);
}

POSITION_GENERATOR.getLeafCount = function getLeafCount (node = {}) {
  if (node.connectedNodes.length == 0) return 1;
  else return node.connectedNodes.map(this.getLeafCount, this)
	.reduce(function (totalLeafCount, currNodeLeafCount) {
	  return totalLeafCount + currNodeLeafCount;
	})
}

POSITION_GENERATOR.reposition = function reposition (node = {}) {
  var leafCount = this.getLeafCount(node),
	left = node.position.x - this.boxWidth * (leafCount - 1) / 2;

  node.connectedNodes.forEach(function (connectedNode) {
	var shift = this.boxWidth * this.getLeafCount(connectedNode);
	left += shift;
	const updatedX = left - (shift + this.boxWidth) / 2,
	  updatedY = node.position.y + this.boxHeight;
	connectedNode.position = {
	  x: updatedX,
	  y: updatedY
	};

	(Object.prototype.hasOwnProperty.call(this.exploredNodes, connectedNode.id)) ?
	  this.updateExploredNodes(connectedNode.position, connectedNode.id)
	  :
	  this.tempPosStorage[connectedNode.id] = connectedNode.position;

	this.minX = (updatedX < this.minX) ? updatedX : this.minX;
	this.maxX = (updatedX > this.maxX) ? updatedX : this.maxX;
	this.maxY = (updatedY > this.maxY) ? updatedY : this.maxY;

	this.reposition(connectedNode);
  }, this);
}

POSITION_GENERATOR.repositionAfterInsert = function repositionAfterInsert (parentId, id) {
  var leafCount = this.getLeafCount(node),
	left = node.position.x - this.boxWidth * (leafCount - 1) / 2;

  node.connectedNodes.forEach(function (connectedNode) {
	var shift = this.boxWidth * this.getLeafCount(connectedNode);
	left += shift;
	const updatedX = left - (shift + this.boxWidth) / 2,
	  updatedY = node.position.y + this.boxHeight;
	connectedNode.position = {
	  x: updatedX,
	  y: updatedY
	};

	(Object.prototype.hasOwnProperty.call(this.exploredNodes, connectedNode.id)) ?
	  this.updateExploredNodes(connectedNode.position, connectedNode.id)
	  :
	  this.tempPosStorage[connectedNode.id] = connectedNode.position;

	this.minX = (updatedX < this.minX) ? updatedX : this.minX;
	this.maxX = (updatedX > this.maxX) ? updatedX : this.maxX;
	this.maxY = (updatedY > this.maxY) ? updatedY : this.maxY;

	this.reposition(connectedNode);
  }, this);

}

module.exports = POSITION_GENERATOR;
