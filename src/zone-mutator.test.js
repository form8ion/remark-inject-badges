import {afterEach, beforeEach, vi, describe, it, expect} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import mapBadgeToLinkReference from './references/badge-to-reference-mapper.js';
import filterDuplicateReferences from './references/duplicate-filter.js';
import mutateZone from './zone-mutator.js';

vi.mock('./references/badge-to-reference-mapper.js');
vi.mock('./references/duplicate-filter.js');

describe('zone mutator', () => {
  const start = any.simpleObject();
  const end = any.simpleObject();
  const detailsOfBadges = any.simpleObject();
  const detailsOfBadgesEntries = Object.entries(detailsOfBadges);
  const references = detailsOfBadgesEntries.map(() => any.simpleObject());

  beforeEach(() => {
    detailsOfBadgesEntries.forEach((entry, index) => {
      when(mapBadgeToLinkReference)
        .calledWith(entry, index, detailsOfBadgesEntries)
        .mockReturnValue(references[index]);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should add the badges to the empty zone', () => {
    const referencesSeparatedByNewLines = references.reduce(
      (acc, reference) => acc.concat({type: 'text', value: '\n'}, reference),
      []
    );

    expect(mutateZone(detailsOfBadges)(start, [], end)).toEqual([
      start,
      {type: 'paragraph', children: referencesSeparatedByNewLines.slice(1)},
      end
    ]);
  });

  it('should append the badges to the existing list', () => {
    const existingReferences = detailsOfBadgesEntries.map(() => any.simpleObject());
    const filteredReferences = any.listOf(any.simpleObject);
    const referencesSeparatedByNewLines = filteredReferences.reduce(
      (acc, reference) => acc.concat({type: 'text', value: '\n'}, reference),
      []
    );
    when(filterDuplicateReferences)
      .calledWith(references, existingReferences)
      .mockReturnValue(filteredReferences);

    expect(mutateZone(detailsOfBadges)(start, [{type: 'paragraph', children: existingReferences}], end)).toEqual([
      start,
      {
        type: 'paragraph',
        children: [
          ...existingReferences,
          ...referencesSeparatedByNewLines
        ]
      },
      end
    ]);
  });
});
