'use strict'

import { DIMENSION } from './constants';

export function getNodeXPathM(
  treeEdgeCount,
  edgeNumber
) {
  // if odd number of total edges
  const width = DIMENSION.nodeWidth;
  if (treeEdgeCount & 1)
    return width * (edgeNumber + 1) / (treeEdgeCount + 1)
  else {
    if (edgeNumber < treeEdgeCount / 2)
      return width * (edgeNumber + 1) / (treeEdgeCount + 2)
    else
      return width * (edgeNumber + 2) / (treeEdgeCount + 2)
  }
}

export function getLabelX(
  nodeX,
  connectedNodeX,
  edgeNumber,
  nodeXPathM,
  treeEdgeCount
) {
  if (treeEdgeCount & 1) {
    // if tree edge count is odd implies there is only one edge emanating from
    // ancestor to descendant as per specification
    return nodeX + (DIMENSION.nodeWidth / 2);
  } else {
    // if tree edge count is even then there are two edge emanating from
    // ancestor to descendant as per specification
    if (edgeNumber < Math.floor(treeEdgeCount / 2)) {
      // this is an edge incident on child rendered on left of parent
      const edgeHorizontalLength = nodeXPathM - (connectedNodeX + (DIMENSION.nodeWidth / 2)),
        edgeStartX = connectedNodeX + (DIMENSION.nodeWidth / 2);
      return edgeStartX + (edgeHorizontalLength / 3);
    } else {
      // this is an edge incident on child rendered on right of parent
      const edgeHorizontalLength = (connectedNodeX + (DIMENSION.nodeWidth / 2)) - nodeXPathM,
        edgeStartX = nodeXPathM;
      return edgeStartX + (edgeHorizontalLength / 3);
    }
  }
}

