import { searchWeb } from '@/lib/tavily';

async function main() {
  const r = await searchWeb('humans only use 10 percent of their brains myth', 'advanced', 2);
  console.log(JSON.stringify(r.results, null, 2));
}

main().catch(e => console.error('ERROR', e));
