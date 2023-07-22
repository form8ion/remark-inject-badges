export default function (reference, existingNodes) {
  return !existingNodes.some(node => node.identifier === reference.identifier);
}
