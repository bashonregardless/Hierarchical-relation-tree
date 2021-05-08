import store from './store/index.js'; 

// import components
import Cell from './components/cell.js';
import TreeEdges from './components/treeEdges.js';

// Instantiate components
const cell = Cell();

// Initial renders
cell.render();

const chartSvg = document.querySelector('.chart-svg');
const treeEdgesGroup= document.createElementNS("http://www.w3.org/2000/svg", 'g');
chartSvg.appendChild(treeEdgesGroup);
treeEdgesGroup.setAttribute('class', 'treeEdge-connections');

Object.values(store.state.nodeLookup).forEach(
  function renderTreeEdges(node) {
	const treeEdgesCount = node.forwardEdges.length;
	node.forwardEdges.forEach(
	  function renderEdges(connection, index) {
		const pathEl= document.createElementNS("http://www.w3.org/2000/svg", 'g');
		treeEdgesGroup.appendChild(pathEl);
		pathEl.setAttribute('class', `treeEdge-${node.id}-${connection.id}`);
		const treeEdges = Object.create(
		  TreeEdges({ element: pathEl, node, connection, index, treeEdgesCount })
		);
		treeEdges.render();
	  });
  });
