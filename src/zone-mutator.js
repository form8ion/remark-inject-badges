import mapBadgeDetailsToReference from './references/badge-to-reference-mapper.js';
import filterDuplicateReferences from './references/duplicate-filter.js';

function zoneAlreadyContainsListOfBadges(node) {
  return node && 'paragraph' === node.type;
}

function injectNewlinesBetweenNodes(acc, reference) {
  return acc.concat(reference, {
    type: 'text',
    value: '\n'
  });
}

function injectIntoExistingList(node, references) {
  const filteredAdditionalReferences = filterDuplicateReferences(references, node.children);

  return {
    ...node,
    children: [
      ...node.children,
      ...filteredAdditionalReferences.length
        ? [
          {type: 'text', value: '\n'},
          ...filteredAdditionalReferences
            .reduce(injectNewlinesBetweenNodes, [])
            .slice(0, -1)
        ]
        : []
    ]
  };
}

function injectIntoNewList(references) {
  return {
    type: 'paragraph',
    children: references
      .reduce(injectNewlinesBetweenNodes, [])
      .slice(0, -1)
  };
}

export default function (detailsOfBadges) {
  const references = Object.entries(detailsOfBadges).map(mapBadgeDetailsToReference);

  return (start, [node], end) => ([
    start,
    zoneAlreadyContainsListOfBadges(node)
      ? injectIntoExistingList(node, references)
      : injectIntoNewList(references),
    end
  ]);
}
