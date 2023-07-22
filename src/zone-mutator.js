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

export default function (detailsOfBadges) {
  const references = Object.entries(detailsOfBadges)
    .map(mapBadgeDetailsToReference);

  return (start, [node], end) => ([
    start,
    zoneAlreadyContainsListOfBadges(node)
      ? {
        ...node,
        children: [
          ...node.children,
          {type: 'text', value: '\n'},
          ...filterDuplicateReferences(references, node.children)
            .reduce(injectNewlinesBetweenNodes, [])
            .slice(0, -1)
        ]
      }
      : {
        type: 'paragraph',
        children: references
          .reduce(injectNewlinesBetweenNodes, [])
          .slice(0, -1)
      },
    end
  ]);
}
