import Proto from '../utils/helpers/proto.js';
import Component from '../lib/component.js';
import store from '../store/index.js';
import { DIMENSION } from '../utils/constants.js';

var Cell = function(props = {}) {
  var obj = {
	store,
	element: document.querySelector('#root'),
	subscribeEvent: 'insertLeaf',

	calSVGWidth () {
	  const { minX: min, maxX: max } = store.state;
	  return DIMENSION.chartXMargin + Math.abs(min) + max;
	},

	calSVGHeight () {
	  return DIMENSION.chartYMargin + store.state.maxY;
	},

	insertNode () {
	  var nodesHTML = '';
	  function drawNode (currNode) {
		const { id } = currNode;
		const { position, connectedNodes } = currNode;
		const { x, y } = position;
		var htmlStr = `
		  <foreignObject
			id="item-${id}"
			data-nodeid="${id}"
			x="${x}"
			y="${y}"
			width="300"
			height="200"
		  >
			<div class="cell">${id}</div>
		  </foreignObject>
		`
		nodesHTML += htmlStr;
		connectedNodes.forEach(drawNode);
	  }
	  drawNode(store.state.nodes);
	  return nodesHTML;
	},
	render() {
	  /**
	   * React to state changes and render the component's HTML
	   *
	   * @returns {void}
	   */
	  this.element.innerHTML = `
		  <svg viewBox="-${(this.calSVGWidth() / 2) - (DIMENSION.nodeWidth / 2)} 0 ${this.calSVGWidth()} ${this.calSVGHeight()}"
			width=100vw
			height=100vh
			class="chart-svg"
			preserveAspectRatio="xMinYMin meet"
		  >
			<g id="node-group">
			  ${ this.insertNode() }
			</g>
		  </svg>`;
	},
  }
  return Proto.create(
	Component.init.call(obj)
  )
}

export default Cell;
