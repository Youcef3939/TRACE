const fs = require('fs');
const path = process.argv[2];
const lines = fs.readFileSync(path, 'utf8').split('\n').filter(Boolean);
for (const line of lines) {
  const e = JSON.parse(line);
  if (e.stage === 'extract' && e.status === 'done') {
    console.log('EXTRACT:', e.data.claims.length, 'claims found');
    e.data.claims.forEach((c, i) => console.log('  [' + i + ']', c.text));
  } else if (e.stage === 'assess' && e.status === 'done') {
    console.log('ASSESS claim', e.claimIndex, '->', e.data.assessment.label);
    console.log('  reasoning:', e.data.assessment.reasoningChain.slice(0, 400));
  } else if (e.stage === 'complete') {
    console.log('COMPLETE. totalClaimsFound=', e.data.totalClaimsFound, 'capped=', e.data.claimsCapped, 'capNotice=', e.data.capNotice);
  } else {
    console.log(e.stage, e.status || '', e.error || '');
  }
}
