import { Buffer } from 'node:buffer';
import { XMLParser } from 'fast-xml-parser';

const endpoint =
  'https://blog.hatena.ne.jp/u0918_nobita/0918nobita.hateblo.jp/atom/entry';

const username = process.env['HATENA_ID'];
const password = process.env['HATENA_API_KEY'];

const res = await fetch(endpoint, {
  headers: {
    Authorization:
      'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
    'Content-Type': 'application/xml',
  },
});

if (!res.ok) {
  console.error('Failed to fetch');
  console.error(res);
  process.exit(1);
}

const xmlText = await res.text();

const xmlParser = new XMLParser();
const parsedXml = xmlParser.parse(xmlText);

console.log('title:', parsedXml.feed.title);
console.log('entries:');

for (const entry of parsedXml.feed.entry) {
  console.log(entry.title);
}
