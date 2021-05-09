/******************** Schema: node with maximum outdegree two *********************/
module.exports = {
  adjL: {
	root: 'A',
	nodes: {
	  A: {
		id: 'A',
		connectedNodes: [
		  { id: 'B' },
		]
	  },
	  B: {
		id: 'B',
		connectedNodes: [
		  { id: 'C' },
		]
	  },
	  C: {
		id: 'C',
		connectedNodes: [
		  { id: 'D' },
		  { id: 'E' },
		]
	  },
	  D: {
		id: 'D',
		connectedNodes: [
		  { id: 'F'}
		]
	  },
	  E: {
		id: 'E',
		connectedNodes: [
		  { id: 'G' },
		  { id: 'H' },
		]
	  },
	  F: {
		id: 'F',
		connectedNodes: [
		  { id: 'I' },
		  { id: 'J' },
		]
	  },
	  G: {
		id: 'G',
		connectedNodes: [
		  { id: 'K' },
		  { id: 'L' },
		  { id: 'E' },
		  { id: 'C' },
		]
	  },
	  H: {
		id: 'H',
		connectedNodes: [
		  { id: 'M' },
		  { id: 'N' },
		]
	  },
	  I: {
		id: 'I',
		connectedNodes: [
		  { id: 'O' },
		  { id: 'P' },
		]
	  },
	  J: {
		id: 'J',
		connectedNodes: [
		  { id: 'Q' },
		]
	  },
	  K: {
		id: 'K',
		connectedNodes: [
		  { id: 'R' },
		  { id: 'S' },
		]
	  },
	  L: {
		id: 'L',
		connectedNodes: [
		  { id: 'E' },
		]
	  },
	  M: {
		id: 'M',
		connectedNodes: []
	  },
	  N: {
		id: 'N',
		connectedNodes: []
	  },
	  O: {
		id: 'O',
		connectedNodes: [
		  { id: 'T' },
		]
	  },
	  P: {
		id: 'P',
		connectedNodes: [
		  { id: 'U' },
		  { id: 'W' },
		]
	  },
	  Q: {
		id: 'Q',
		connectedNodes: []
	  },
	  R: {
		id: 'R',
		connectedNodes: [
		  { id: 'V' },
		  { id: 'X' },
		]
	  },
	  S: {
		id: 'S',
		connectedNodes: []
	  },
	  T: {
		id: 'T',
		connectedNodes: [
		  { id: 'Y' },
		]
	  },
	  U: {
		id: 'U',
		connectedNodes: []
	  },
	  V: {
		id: 'V',
		connectedNodes: []
	  },
	  W: {
		id: 'W',
		connectedNodes: []
	  },
	  X: {
		id: 'X',
		connectedNodes: [
		  { id: 'Z' },
		  { id: 'K' },
		]
	  },
	  Y: {
		id: 'Y',
		connectedNodes: []
	  },
	  Z: {
		id: 'Z',
		connectedNodes: [
		  { id: 'C' },
		  { id: 'E' },
		]
	  },
	}
  }
}
