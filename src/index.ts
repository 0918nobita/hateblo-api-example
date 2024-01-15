import { Buffer } from 'node:buffer';
import { writeFile } from 'node:fs/promises';
import { XMLParser } from 'fast-xml-parser';
import { z } from 'zod';

const hatenaId = process.env['HATENA_ID'];
const domain = process.env['HATENA_DOMAIN'];
const endpoint = `https://blog.hatena.ne.jp/${hatenaId}/${domain}/atom/entry`;
const hatenaApiKey = process.env['HATENA_API_KEY'];

const res = await fetch(endpoint, {
  headers: {
    Authorization:
      'Basic ' + Buffer.from(`${hatenaId}:${hatenaApiKey}`).toString('base64'),
    'Content-Type': 'application/xml',
  },
});

if (!res.ok) {
  console.error('Failed to fetch');
  console.error(res);
  process.exit(1);
}

const xmlText = await res.text();

await writeFile('response.xml', xmlText, 'utf-8');

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  ignoreDeclaration: true,
});
const parsedXml = xmlParser.parse(xmlText);

await writeFile('response.json', JSON.stringify(parsedXml), 'utf-8');

const pageSchema = z.object({
  feed: z.object({
    title: z.string(),
    link: z.array(
      z.object({
        '@_rel': z.string(),
        '@_href': z.string(),
      }),
    ),
    entry: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        'app:control': z.object({
          'app:draft': z.union([z.literal('yes'), z.literal('no')]),
        }),
      }),
    ),
  }),
});

const page = pageSchema.safeParse(parsedXml);

if (!page.success) {
  console.error('Failed to validate');
  console.error(page.error);
  process.exit(1);
}

console.log('title:', page.data.feed.title);

console.log('entries:');
for (const entry of page.data.feed.entry) {
  console.log(
    `  ${entry['app:control']['app:draft'] === 'yes' ? '[draft] ' : ''}${entry.title}`,
  );
}

const nextPage = page.data.feed.link.find((link) => link['@_rel'] === 'next');

console.log({ nextPage });
