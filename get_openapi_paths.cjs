const https = require('https');
https.get(process.env.VITE_SUPABASE_URL + '/rest/v1/', {
  headers: { 'apikey': process.env.VITE_SUPABASE_ANON_KEY }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const data = JSON.parse(body);
    console.log('paths:', data.paths ? Object.keys(data.paths).filter(p => p.startsWith('/rpc/')) : 'no paths');
    console.log('keys:', Object.keys(data));
  });
});
