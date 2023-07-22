import mapBadgeDetailsToReference from './references/badge-to-reference-mapper.js';

function zoneAlreadyContainsListOfBadges(node) {
  return node && 'paragraph' === node.type;
}

export default function (detailsOfBadges) {
  const references = Object.entries(detailsOfBadges)
    .map(mapBadgeDetailsToReference)
    .reduce((acc, reference) => acc.concat(reference, {type: 'text', value: '\n'}), [])
    .slice(0, -1);

  return (start, nodes, end) => {
    const node = nodes[0];

    return [
      start,
      zoneAlreadyContainsListOfBadges(node)
        ? {...node, children: [...node.children, {type: 'text', value: '\n'}, ...references]}
        : {type: 'paragraph', children: references},
      end
    ];
  };
}
