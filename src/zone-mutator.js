import mapBadgeDetailsToLinkReference from './badge-to-link-reference-mapper';

function zoneAlreadyContainsListOfBadges(node) {
  return node && 'paragraph' === node.type;
}

export default function (detailsOfBadges) {
  const linkReferences = Object.entries(detailsOfBadges).map(mapBadgeDetailsToLinkReference);

  return (start, nodes, end) => {
    const node = nodes[0];
    if (zoneAlreadyContainsListOfBadges(node)) node.children.concat(linkReferences);

    return [
      start,
      zoneAlreadyContainsListOfBadges(node)
        ? {...node, children: [...node.children, ...linkReferences]}
        : {type: 'paragraph', children: linkReferences},
      end
    ];
  };
}
