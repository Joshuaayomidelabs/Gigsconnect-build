const https = require('https');
const fs = require('fs');

https.get('https://mobbin.com/sites/sections/3b22a460-2e8d-4605-b883-34b199ae5c8d?fullpage=true&utm_source=copy_link&utm_medium=link&utm_campaign=section_sharing', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync('mobbin.html', data);
    console.log('Saved to mobbin.html');
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
