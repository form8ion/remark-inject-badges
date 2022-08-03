import parse from 'mdast-util-from-markdown';
import zone from 'mdast-zone';
import {assert} from 'chai';

import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import zip from 'lodash.zip';

Given('no badges are provided for injection', async function () {
  this.badges = null;
});

Given('badges are provided for injection', async function () {
  const badgeGroups = this.badgeGroupNames.map(() => any.objectWithKeys(
    any.listOf(any.word),
    {factory: () => ({link: any.url(), img: any.url()})}
  ));
  this.badges = Object.fromEntries(zip(this.badgeGroupNames, badgeGroups));
});

Then('no badges were injected', async function () {
  const readmeTree = parse(this.resultingContent);

  this.badgeGroupNames.forEach(groupName => {
    zone(readmeTree, `${groupName}-badges`, (start, nodes, end) => {
      assert.equal(nodes.length, 0, `There should be no badges in the ${groupName} zone`);
    });
  });
});

Then('the provided badges were injected', async function () {
  const readmeTree = parse(this.resultingContent);

  this.badgeGroupNames.forEach(groupName => {
    zone(readmeTree, `${groupName}-badges`, (start, nodes, end) => {
      nodes[0].children
        .filter(node => 'linkReference' == node.type)
        .forEach((node, index) => {
          const badge = Object.entries(this.badges[groupName])[index];
          assert.equal(node.identifier, `${badge[0]}-link`);
        })
    });
  });
});
