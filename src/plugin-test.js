import sinon from 'sinon';
import {assert} from 'chai';
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
    const contributionBadges = any.simpleObject();
    const mutateZone = () => undefined;
    const transformer = plugin({contribution: contributionBadges});
    zoneMutator.default.withArgs(contributionBadges).returns(mutateZone);

    transformer(node);

    assert.calledWith(zone.default, node, 'contribution-badges', mutateZone);
  });
});
