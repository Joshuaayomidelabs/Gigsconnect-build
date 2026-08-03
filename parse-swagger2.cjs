const https = require('https');

https.get(process.env.VITE_SUPABASE_URL + '/rest/v1/', {
  headers: { 'apikey': process.env.VITE_SUPABASE_ANON_KEY }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const data = JSON.parse(body);
    console.log(Object.keys(data));
    console.log(Object.keys(data.components || {}));
    if (data.components && data.components.schemas) {
       console.log(JSON.stringify(data.components.schemas.subscriptions, null, 2));
    } else {
       console.log(JSON.stringify(data.definitions?.subscriptions, null, 2));
    }
  });
});
