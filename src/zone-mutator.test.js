import {afterEach, beforeEach, vi, describe, it, expect} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import mapBadgeToLinkReference from './badge-to-link-reference-mapper.js';
import mutateZone from './zone-mutator.js';

vi.mock('./badge-to-link-reference-mapper.js');

describe('zone mutator', () => {
  const start = any.simpleObject();
  const end = any.simpleObject();
  const detailsOfBadges = any.simpleObject();
  const detailsOfBadgesEntries = Object.entries(detailsOfBadges);
  const linkReferences = detailsOfBadgesEntries.map(() => any.simpleObject());
  const linkReferencesSeparatedByNewLines = linkReferences.reduce(
    (acc, reference) => acc.concat({type: 'text', value: '\n'}, reference),
    []
  );

  beforeEach(() => {
    detailsOfBadgesEntries.forEach((entry, index) => {
      when(mapBadgeToLinkReference)
        .calledWith(entry, index, detailsOfBadgesEntries)
        .mockReturnValue(linkReferences[index]);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should add the badges to the empty zone', () => {
    expect(mutateZone(detailsOfBadges)(start, [], end)).toEqual([
      start,
      {type: 'paragraph', children: linkReferencesSeparatedByNewLines.slice(1)},
      end
    ]);
  });

  it('should append the badges to the existing list', () => {
    const existingLinkReferences = detailsOfBadgesEntries.map(() => any.simpleObject());

    expect(mutateZone(detailsOfBadges)(start, [{type: 'paragraph', children: existingLinkReferences}], end)).toEqual([
      start,
      {
        type: 'paragraph',
        children: [
          ...existingLinkReferences,
          ...linkReferencesSeparatedByNewLines
        ]
      },
      end
    ]);
  });
});
