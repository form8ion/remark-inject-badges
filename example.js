// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import fs from 'fs';
import remark from 'remark';
import injectBadges from './lib/index.cjs';

// remark-usage-ignore-next
stubbedFs();

// #### Execute

remark()
  .use(
    injectBadges,
    {
      contribution: {
        text: 'alt-text for the badge image',
        link: 'url for badge link',
        img: 'badge image url'
      }
    }
  )
  .process(
    `# project-name

<!--status-badges start -->
<!--status-badges end -->

<!--consumer-badges start -->
<!--consumer-badges end -->

<!--contribution-badges start -->
<!--contribution-badges end -->
`,
    (err, file) => {
      fs.writeFileSync(`${process.cwd()}/README.md`, file.contents);
    }
  );

// remark-usage-ignore-next
stubbedFs.restore();
