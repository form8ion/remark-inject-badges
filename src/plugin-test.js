import sinon from 'sinon';
import {assert} from 'chai';
import zip from 'lodash.zip';
import any from '@travi/any';
import * as zone from '../thirdparty-wrappers/mdast-zone';
import * as zoneMutator from './zone-mutator';
import plugin from './plugin';

suite('plugin', () => {
  let sandbox, node;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(zone, 'default');
    sandbox.stub(zoneMutator, 'default');

    node = {...any.simpleObject(), children: []};
  });

  teardown(() => sandbox.restore());

  test('that the badges are injected into the appropriate zones', () => {
    const badgeGroupNames = any.listOf(any.word);
    const badgeGroups = badgeGroupNames.map(() => any.objectWithKeys(
      any.listOf(any.word),
      {factory: () => ({link: any.url(), img: any.url()})}
    ));
    const zoneMutators = badgeGroupNames.map(() => () => undefined);
    const transformer = plugin(Object.fromEntries(zip(badgeGroupNames, badgeGroups)));
    zip(badgeGroups, zoneMutators).forEach(([group, mutator]) => {
      zoneMutator.default.withArgs(group).returns(mutator);
    });
    const flattenedBadgeDetails = Object.values(badgeGroups).reduce((acc, badgeGroup) => ({...acc, ...badgeGroup}), {});

    transformer(node);

    assert.callCount(zoneMutator.default, badgeGroupNames.length);
    zip(badgeGroupNames, zoneMutators).forEach(([groupName, mutator]) => {
      assert.calledWith(zone.default, node, `${groupName}-badges`, mutator);
    });
    Object.entries(flattenedBadgeDetails).forEach(([badgeName, badgeDetails]) => {
      const linkDefinition = node.children.find(child => `${badgeName}-link` === child.label);
      const imgDefinition = node.children.find(child => `${badgeName}-badge` === child.label);

      assert.equal(linkDefinition.url, badgeDetails.link);
      assert.equal(linkDefinition.type, 'definition');
      assert.equal(imgDefinition.url, badgeDetails.img);
      assert.equal(imgDefinition.type, 'definition');
    });
  });

  test('that link references are not added when a link is not included in the badge details', () => {
    const badgeGroupNames = any.listOf(any.word);
    const badgeGroups = badgeGroupNames.map(() => any.objectWithKeys(
      any.listOf(any.word),
      {factory: () => ({img: any.url()})}
    ));
    const zoneMutators = badgeGroupNames.map(() => () => undefined);
    const transformer = plugin(Object.fromEntries(zip(badgeGroupNames, badgeGroups)));
    zip(badgeGroups, zoneMutators).forEach(([group, mutator]) => {
      zoneMutator.default.withArgs(group).returns(mutator);
    });
    const flattenedBadgeDetails = Object.values(badgeGroups).reduce((acc, badgeGroup) => ({...acc, ...badgeGroup}), {});

    transformer(node);

    assert.callCount(zoneMutator.default, badgeGroupNames.length);
    zip(badgeGroupNames, zoneMutators).forEach(([groupName, mutator]) => {
      assert.calledWith(zone.default, node, `${groupName}-badges`, mutator);
    });
    Object.entries(flattenedBadgeDetails).forEach(([badgeName, badgeDetails]) => {
      const linkDefinition = node.children.find(child => `${badgeName}-link` === child.label);
      const imgDefinition = node.children.find(child => `${badgeName}-badge` === child.label);

      assert.isUndefined(linkDefinition);
      assert.equal(imgDefinition.url, badgeDetails.img);
      assert.equal(imgDefinition.type, 'definition');
    });
  });

  test('that no injection happens if no badges are provided', () => {
    const transformer = plugin();

    transformer(node);
  });
});
