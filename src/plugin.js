import getZoneMutator from './zone-mutator';
import zone from '../thirdparty-wrappers/mdast-zone';

export default function (badges) {
  return function transformer(node) {
    zone(node, 'contribution-badges', getZoneMutator(badges.contribution));
  };
}
