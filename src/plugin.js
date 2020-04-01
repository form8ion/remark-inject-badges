import getZoneMutator from './zone-mutator';
import zone from '../thirdparty-wrappers/mdast-zone';

export default function (badges) {
  return function transformer(node) {
    if (badges) {
      Object.entries(badges).forEach(([groupName, group]) => {
        zone(node, `${groupName}-badges`, getZoneMutator(group));

        Object.entries(group).forEach(([badgeName, badgeDetails]) => {
          if (badgeDetails.link) {
            node.children.push({type: 'definition', label: `${badgeName}-link`, url: badgeDetails.link});
          }

          node.children.push({type: 'definition', label: `${badgeName}-badge`, url: badgeDetails.img});
        });
      });
    }
  };
}
