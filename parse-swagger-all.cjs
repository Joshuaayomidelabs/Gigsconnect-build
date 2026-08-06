const https = require('https');
https.get(process.env.VITE_SUPABASE_URL + '/rest/v1/', {
  headers: { 'apikey': process.env.VITE_SUPABASE_ANON_KEY }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const data = JSON.parse(body);
    console.log(JSON.stringify(data.definitions?.messages, null, 2));
    console.log(JSON.stringify(data.definitions?.conversations, null, 2));
    console.log(JSON.stringify(data.definitions?.conversation_participants, null, 2));
  });
});
