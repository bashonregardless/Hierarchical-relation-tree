'use strict'

import { DIMENSION } from './constants';
import { getNodeXPathM, getLabelX } from './getNodeXPathM.js';

function getVh(treeEdgeCount, edgeNumber) {
  const unit = DIMENSION.treeEdgeVerticalHeightUnit;
  // odd case
  if (treeEdgeCount & 1) {
	const flrMid = Math.floor(treeEdgeCount / 2);
	if (edgeNumber < flrMid) {
	  const gap = flrMid - edgeNumber;
	  return unit * gap;
	} else {
	  const gap = edgeNumber - flrMid;
	  return unit * gap;
	}
  }
  else { // even case
	const flrMid = treeEdgeCount / 2;
	if (edgeNumber < flrMid) {
	  const gap = ((flrMid) - 1) - edgeNumber;
	  return unit * gap;
	} else {
	  const gap = edgeNumber - flrMid;
	  return unit * gap;
	}
  }
}

export function deriveEdgeDimension(
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
) {
  const nodeDivBottomPos = nodeDivClientHeight + nodeY;

  const nodeXPathM = nodeX + getNodeXPathM(
	treeEdgeCount,
	edgeNumber
  ),
	reqVerticalHeight = ((connectedNodeY - nodeDivBottomPos) / 2)
	- getVh(treeEdgeCount, edgeNumber);

  const pathH = connectedNodeX + (DIMENSION.nodeWidth / 2),
	incidentNodeV = connectedNodeY;

  return [
	nodeXPathM,
	nodeDivBottomPos,
	reqVerticalHeight,
	pathH,
	incidentNodeV
  ];
}
