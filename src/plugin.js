import getZoneMutator from './zone-mutator';
import zone from '../thirdparty-wrappers/mdast-zone';

export default function (badges) {
  return function transformer(node) {
    Object.entries(badges).forEach(([groupName, group]) => {
      zone(node, `${groupName}-badges`, getZoneMutator(group));
    });
  };
}
