import {EOL} from 'os';
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
    {factory: () => ({link: any.url(), img: any.url(), text: any.word()})}
  ));
  this.badges = Object.fromEntries(zip(this.badgeGroupNames, badgeGroups));
});

Given('badges already exist in the document', async function () {
  const badgeGroups = this.badgeGroupNames.map(() => any.objectWithKeys(
    any.listOf(any.word),
    {factory: () => ({link: any.url(), img: any.url(), text: any.word()})}
  ));
  this.existingBadges = Object.fromEntries(zip(this.badgeGroupNames, badgeGroups));
  this.existingDocumentContent = `# project-name

${this.badgeGroupNames.map(groupName => `
<!--${groupName}-badges start -->

${Object.entries(this.existingBadges[groupName])
    .map(([badgeKey, badge]) => `[![${badge.text}][${badgeKey}-badge]][${badgeKey}-link]
`)}
<!--${groupName}-badges end -->
`).join(EOL)}

${this.badgeGroupNames.map(groupName => Object.entries(this.existingBadges[groupName]).map(([badgeKey, badge]) => `

[${badgeKey}-link]: ${badge.link}

[${badgeKey}-badge]: ${badge.img}
`).join(EOL))}
`;
});

Given('the provided badges already exist in the document', async function () {
  this.existingDocumentContent = `# project-name

${this.badgeGroupNames.map(groupName => `
<!--${groupName}-badges start -->
${Object.entries(this.badges[groupName])
  .map(([badgeKey, badge]) => `[![${badge.text}][${badgeKey}-badge]][${badgeKey}-link]
`)}
<!--${groupName}-badges end -->
`).join(EOL)}

${this.badgeGroupNames.map(groupName => Object.entries(this.badges[groupName]).map(([badgeKey, badge]) => `

[${badgeKey}-link]: ${badge.link}

[${badgeKey}-badge]: ${badge.img}
`).join(EOL))}
`;
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
        .filter(node => 'linkReference' === node.type)
        .forEach((node, index) => {
          const badge = Object.entries(this.badges[groupName])[index];
          assert.equal(node.identifier, `${badge[0]}-link`);
        })
    });
  });
});

Then('the additional badges were injected', async function () {
  const readmeTree = parse(this.resultingContent);

  this.badgeGroupNames.forEach(groupName => {
    zone(readmeTree, `${groupName}-badges`, (start, nodes, end) => {
      const badgesInDocument = nodes[0].children.filter(node => 'linkReference' === node.type);
      const existingBadges = Object.entries(this.existingBadges[groupName]);
      const providedBadges = Object.entries(this.badges[groupName]);
      const mergedBadges = [...existingBadges, ...providedBadges];

      assert.equal(badgesInDocument.length, mergedBadges.length);
      badgesInDocument.forEach((node, index) => {
        const badge = mergedBadges[index];
        // console.log({badge, node})
        assert.equal(node.identifier, `${badge[0]}-link`);
      });
    });
  });
});

Then('no additional badges were injected', async function () {
  const readmeTree = parse(this.resultingContent);

  this.badgeGroupNames.forEach(groupName => {
    zone(readmeTree, `${groupName}-badges`, (start, nodes, end) => {
      const badgesInDocument = nodes[0].children.filter(node => 'linkReference' === node.type);
      const providedBadges = Object.entries(this.badges[groupName]);

      assert.equal(badgesInDocument.length, providedBadges.length);
      badgesInDocument.forEach((node, index) => {
        const badge = providedBadges[index];
        assert.equal(node.identifier, `${badge[0]}-link`);
      });
    });
  });
});
