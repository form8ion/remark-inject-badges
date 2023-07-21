import {describe, expect, it} from 'vitest';
import any from '@travi/any';
import {assert as assertIsValidMdastNode} from 'mdast-util-assert';

import map from './badge-to-link-reference-mapper.js';

describe('badge-details to link-reference mapper', () => {
  const name = any.word();
  const altText = any.sentence();

  it('should produce a link reference from the badge details', () => {
    const linkReference = map([name, {text: altText, link: any.url()}]);

    assertIsValidMdastNode(linkReference);
    expect(linkReference).toEqual({
      type: 'linkReference',
      label: `${name}-link`,
      identifier: `${name}-link`,
      referenceType: 'full',
      children: [{
        type: 'imageReference',
        label: `${name}-badge`,
        identifier: `${name}-badge`,
        alt: altText
      }]
    });
  });

  it('should produce an image reference if no link is provided in the badge details', () => {
    const imageReference = map([name, {text: altText}]);

    assertIsValidMdastNode(imageReference);
    expect(imageReference).toEqual({
      type: 'imageReference',
      label: `${name}-badge`,
      identifier: `${name}-badge`,
      alt: altText
    });
  });
});
