import {expect, describe, it} from 'vitest';
import any from '@travi/any';

import referenceDoesNotExistInNodeList from './existence-in-node-list-identifier.js';

describe('existing reference in node-list identifier', () => {
  const referenceIdentifier = any.word();
  const reference = {...any.simpleObject(), identifier: referenceIdentifier};

  it('should return `true` when the provided reference does not exist in the provided node list', () => {
    expect(referenceDoesNotExistInNodeList(reference, any.listOf(any.simpleObject))).toBe(true);
  });

  it('should return `false` when the provided reference exists in the provided node list', () => {
    const nodeListWithExistingReference = [
      ...any.listOf(any.simpleObject),
      {...any.simpleObject(), identifier: referenceIdentifier},
      ...any.listOf(any.simpleObject)
    ];

    expect(referenceDoesNotExistInNodeList(reference, nodeListWithExistingReference)).toBe(false);
  });
});
