import {EOL} from 'os';
import {Given} from '@cucumber/cucumber';
import any from '@travi/any';

Given('badge zones exist', async function () {
  this.badgeGroupNames = any.listOf(any.word);
  // this.badgeGroupNames = [any.word()];
  this.existingDocumentContent = `# project-name

${this.badgeGroupNames.map(groupName => `
<!--${groupName}-badges start -->
<!--${groupName}-badges end -->
`).join(EOL)}
`;
});
