import {When} from '@cucumber/cucumber';
import {remark} from 'remark';
// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import remarkInjectBadges from '@form8ion/remark-inject-badges';

When('a node is processed', async function () {
  remark()
    .use(remarkInjectBadges, this.badges)
    .process(this.existingDocumentContent, (err, file) => {
      if (err) throw err;

      this.resultingContent = `${file}`;
    });
});
