const https = require('https');
https.get(process.env.VITE_SUPABASE_URL + '/rest/v1/', {
  headers: { 
    'apikey': process.env.VITE_SUPABASE_ANON_KEY,
    'Accept': 'application/openapi+json'
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      if (data.paths) {
        console.log('paths:', Object.keys(data.paths).filter(p => p.startsWith('/rpc/')));
      } else {
        console.log('keys:', Object.keys(data));
      }
    } catch(e) { console.log(e); }
  });
});
