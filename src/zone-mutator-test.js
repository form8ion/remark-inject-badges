import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';
import * as badgeToLinkReferenceMapper from './badge-to-link-reference-mapper';
import mutateZone from './zone-mutator';

suite('zone mutator', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(badgeToLinkReferenceMapper, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the badges are added to the empty zone', () => {
    const start = any.simpleObject();
    const end = any.simpleObject();
    const nodes = any.listOf(any.simpleObject);
    const detailsOfBadges = any.simpleObject();
    const detailsOfBadgesEntries = Object.entries(detailsOfBadges);
    const linkReferences = detailsOfBadgesEntries.map(() => any.simpleObject());
    detailsOfBadgesEntries.forEach((entry, index) => {
      badgeToLinkReferenceMapper.default.withArgs(entry).returns(linkReferences[index]);
    });

    assert.deepEqual(
      mutateZone(detailsOfBadges)(start, nodes, end),
      [start, {type: 'paragraph', children: linkReferences}, end]
    );
  });
});
