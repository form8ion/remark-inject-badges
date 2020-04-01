import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';
import * as badgeToLinkReferenceMapper from './badge-to-link-reference-mapper';
import mutateZone from './zone-mutator';

suite('zone mutator', () => {
  let sandbox;
  const start = any.simpleObject();
  const end = any.simpleObject();
  const detailsOfBadges = any.simpleObject();
  const detailsOfBadgesEntries = Object.entries(detailsOfBadges);
  const linkReferences = detailsOfBadgesEntries.map(() => any.simpleObject());
  const linkReferencesSeparatedByNewLines = linkReferences.reduce(
    (acc, reference) => acc.concat({type: 'text', value: '\n'}, reference),
    []
  );

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(badgeToLinkReferenceMapper, 'default');

    detailsOfBadgesEntries.forEach((entry, index) => {
      badgeToLinkReferenceMapper.default.withArgs(entry).returns(linkReferences[index]);
    });
  });

  teardown(() => sandbox.restore());

  test('that the badges are added to the empty zone', () => {
    assert.deepEqual(
      mutateZone(detailsOfBadges)(start, [], end),
      [start, {type: 'paragraph', children: linkReferencesSeparatedByNewLines.slice(1)}, end]
    );
  });

  test('that the badges are appended to the existing list', () => {
    const existingLinkReferences = detailsOfBadgesEntries.map(() => any.simpleObject());

    assert.deepEqual(
      mutateZone(detailsOfBadges)(start, [{type: 'paragraph', children: existingLinkReferences}], end),
      [
        start,
        {
          type: 'paragraph',
          children: [
            ...existingLinkReferences,
            ...linkReferencesSeparatedByNewLines
          ]
        },
        end
      ]
    );
  });
});
