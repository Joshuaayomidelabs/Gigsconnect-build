const https = require('https');
https.get(process.env.VITE_SUPABASE_URL + '/rest/v1/', {
  headers: { 'apikey': process.env.VITE_SUPABASE_ANON_KEY }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(body.substring(0, 500)));
});
