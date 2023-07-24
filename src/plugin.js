import {zone} from 'mdast-zone';

import getZoneMutator from './zone-mutator.js';

function matchingLinkDefinitionDoesNotAlreadyExist(node, linkLabel) {
  return !node.children.some(child => child.label === linkLabel);
}

function matchingImageDefinitionDoesNotAlreadyExist(node, badgeLabel) {
  return !node.children.some(child => child.label === badgeLabel);
}

function injectOrUpdateLinkDefinition([badgeName, badgeDetails], node) {
  const linkLabel = `${badgeName}-link`;

  if (badgeDetails.link) {
    if (matchingLinkDefinitionDoesNotAlreadyExist(node, linkLabel)) {
      node.children.push({type: 'definition', label: linkLabel, url: badgeDetails.link});
    } else {
      const existingNode = node.children.find(child => child.label === linkLabel);
      existingNode.url = badgeDetails.link;
    }
  }
}

function injectOrUpdateImageDefinition([badgeName, badgeDetails], node) {
  const badgeLabel = `${badgeName}-badge`;

  if (matchingImageDefinitionDoesNotAlreadyExist(node, badgeLabel)) {
    node.children.push({
      type: 'definition',
      label: badgeLabel,
      url: badgeDetails.img
    });
  } else {
    const existingNode = node.children.find(child => child.label === badgeLabel);
    existingNode.url = badgeDetails.img;
  }
}

export default function (badges) {
  return function transformer(node) {
    if (badges) {
      Object.entries(badges).forEach(([groupName, group]) => {
        zone(node, `${groupName}-badges`, getZoneMutator(group));

        Object.entries(group).forEach(badge => {
          injectOrUpdateLinkDefinition(badge, node);
          injectOrUpdateImageDefinition(badge, node);
        });
      });
    }
  };
}
