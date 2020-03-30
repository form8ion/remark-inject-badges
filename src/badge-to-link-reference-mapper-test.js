import {assert} from 'chai';
import any from '@travi/any';
import map from './badge-to-link-reference-mapper';

suite('badge-details to link-reference mapper', () => {
  test('that that a link reference is produced from the badge details', () => {
    const name = any.word();
    const altText = any.sentence();

    assert.deepEqual(
      map([name, {text: altText}]),
      {
        type: 'linkReference',
        label: `${name}-link`,
        children: [{type: 'imageReference', label: `${name}-badge`, alt: altText}]
      }
    );
  });
});
