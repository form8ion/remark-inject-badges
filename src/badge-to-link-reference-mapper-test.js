import {assert} from 'chai';
import any from '@travi/any';
import assertIsValidMdastNode from 'mdast-util-assert';
import map from './badge-to-link-reference-mapper';

suite('badge-details to link-reference mapper', () => {
  const name = any.word();
  const altText = any.sentence();

  test('that that a link reference is produced from the badge details', () => {
    const linkReference = map([name, {text: altText, link: any.url()}]);

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

  test('that an image reference is produced if no link is provided in the badge details', () => {
    const imageReference = map([name, {text: altText}]);

    assertIsValidMdastNode(imageReference);
    assert.deepEqual(
      imageReference,
      {type: 'imageReference', label: `${name}-badge`, identifier: `${name}-badge`, alt: altText}
    );
  });
});
