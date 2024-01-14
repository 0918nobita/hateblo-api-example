import { Buffer } from 'node:buffer';

const endpoint =
  'https://blog.hatena.ne.jp/u0918_nobita/0918nobita.hateblo.jp/atom';

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

console.log(await res.text());
