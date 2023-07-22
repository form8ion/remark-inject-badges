import {describe, it, expect, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';
import zip from 'lodash.zip';

import referenceDoesNotExistInNodeList from './existence-in-node-list-identifier.js';
import filterDuplicateReferences from './duplicate-filter.js';

vi.mock('./existence-in-node-list-identifier.js');

describe('duplicate reference filter', () => {
  it('should filter the provided references to those that dont already exist in the provided node list', () => {
    const references = any.listOf(any.simpleObject);
    const existingNodes = any.listOf(any.simpleObject);
    const referencesFilterResults = references.map(() => any.boolean());
    const filteredReferences = references.filter((_, index) => referencesFilterResults[index]);
    zip(references, referencesFilterResults).forEach(([reference, filterResult]) => {
      when(referenceDoesNotExistInNodeList).calledWith(reference, existingNodes).mockReturnValue(filterResult);
    });

    expect(filterDuplicateReferences(references, existingNodes)).toEqual(filteredReferences);
  });
});
