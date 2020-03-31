import sinon from 'sinon';
import {assert} from 'chai';
import zip from 'lodash.zip';
import any from '@travi/any';
import * as zone from '../thirdparty-wrappers/mdast-zone';
import * as zoneMutator from './zone-mutator';
import plugin from './plugin';

suite('plugin', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(zone, 'default');
    sandbox.stub(zoneMutator, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the badges are injected into the appropriate zones', () => {
    const node = any.simpleObject();
    const badgeGroupNames = any.listOf(any.word);
    const badgeGroups = badgeGroupNames.map(() => any.simpleObject());
    const zoneMutators = badgeGroupNames.map(() => () => undefined);
    const transformer = plugin(Object.fromEntries(zip(badgeGroupNames, badgeGroups)));
    zip(badgeGroups, zoneMutators).forEach(([group, mutator]) => {
      zoneMutator.default.withArgs(group).returns(mutator);
    });

    transformer(node);

    assert.callCount(zoneMutator.default, badgeGroupNames.length);
    zip(badgeGroupNames, zoneMutators).forEach(([groupName, mutator]) => {
      assert.calledWith(zone.default, node, `${groupName}-badges`, mutator);
    });
  });
});
