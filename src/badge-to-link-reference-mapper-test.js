import {assert} from 'chai';
import any from '@travi/any';
import assertIsValidMdastNode from 'mdast-util-assert';
import map from './badge-to-link-reference-mapper';

suite('badge-details to link-reference mapper', () => {
  test('that that a link reference is produced from the badge details', () => {
    const name = any.word();
    const altText = any.sentence();

    const linkReference = map([name, {text: altText}]);

    assertIsValidMdastNode(linkReference);
    assert.deepEqual(
      linkReference,
      {
        type: 'linkReference',
        label: `${name}-link`,
        identifier: `${name}-link`,
        referenceType: 'full',
        children: [{type: 'imageReference', label: `${name}-badge`, identifier: `${name}-badge`, alt: altText}]
      }
    );
  });
});
