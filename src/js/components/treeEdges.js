/* NOMENCLATURE:
 * node<ATTRIBUTE_NAME>: These named attributes belong to node from which edge emanates.
 * connectedNode<ATTRIBUTE_NAME>: These named attributes belong to node on which edge is incident.
 */

import Proto from '../utils/helpers/proto.js';

import Component from '../lib/component.js';
import store from '../store/index.js';
import { DIMENSION } from '../utils/constants.js';
import { deriveEdgeDimension } from '../utils/deriveDimensions.js';

var TreeEdgeConnection = function (props = {}) {
  var obj = {
	store,
	element: props.element,
	subscribeEvent: 'reposition insertLeaf',
	node: props.node,
	connection: props.connection,
	edgeNumber: props.index,
	treeEdgeCount: props.treeEdgesCount,

	getPathShape (
	  nodeId,
	  connectedNodeId,
	) {
	  const {
		edgeNumber
	  } = this;

	  const {
		treeEdgeCount,
	  } = this;

	  // Get DOM nodes reference
	  const nodeForeignObject = document.querySelector(`#item-${nodeId}`),
		connectedNodeForeignObject = document.querySelector(`#item-${connectedNodeId}`),
		nodeContainerDiv = document.querySelector(`#item-${nodeId} > div`);

	  // Get svg node attributes
	  const {
		x: nodeX,
		y: nodeY,
	  } = nodeForeignObject.getBBox(),
		{
		  x: connectedNodeX,
		  y: connectedNodeY,
		} = connectedNodeForeignObject.getBBox(),
		// Get node client attributes
		{ clientHeight : nodeDivClientHeight } = nodeContainerDiv;

	  let [
		nodeXPathM,
		nodeDivBottomPos,
		reqVerticalHeight,
		pathH,
		incidentNodeV
	  ] = deriveEdgeDimension(
		{
		  treeEdgeCount,
		  edgeNumber,
		},
		{
		  nodeX,
		  nodeY,
		  nodeDivClientHeight,
		},
		{
		  connectedNodeX,
		  connectedNodeY
		}
	  );

	  return `
	  M ${nodeXPathM},${nodeDivBottomPos}
	  v ${reqVerticalHeight}
	  m 0,0
	  H ${pathH}
	  m 0,0
	  V ${incidentNodeV}
	`;
	},

	getPath() {
	  const { id: nodeId } = this.node,
		{ id: connectedNodeId } = this.connection;

	  const pathShape = this.getPathShape(
		nodeId,
		connectedNodeId,
	  );

	  return `
	  <path
		id="connection-${nodeId}-${connectedNodeId}"
		stroke='#000000'
		strokeWidth='2'
		marker-end="url(#marker-treeEdge-${nodeId}-${connectedNodeId})"
		d="${pathShape}"
	  />
	`
	},

	render() {
	  let self = this;

	  self.element.innerHTML = this.getPath();
	}
  }

  return Proto.create(
	Component.init.call(obj));
};

export default TreeEdgeConnection;

