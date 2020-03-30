import mapBadgeDetailsToLinkReference from './badge-to-link-reference-mapper';

export default function (detailsOfBadges) {
  const linkReferences = Object.entries(detailsOfBadges).map(mapBadgeDetailsToLinkReference);

  return (start, nodes, end) => ([start, {type: 'paragraph', children: linkReferences}, end]);
}
