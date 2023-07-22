import referenceDoesNotExistInNodeList from './existence-in-node-list-identifier.js';

export default function (references, existingNodes) {
  return references.filter(reference => referenceDoesNotExistInNodeList(reference, existingNodes));
}
