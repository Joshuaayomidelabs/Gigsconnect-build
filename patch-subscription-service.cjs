const fs = require('fs');

let content = fs.readFileSync('src/services/subscriptionService.ts', 'utf-8');

const target = `      // Get the actual authenticated user from Supabase to ensure accurate RLS evaluation
      const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser();
      
      if (authErr || !authUser) {
        console.warn('Cannot ensure starter subscription: no authenticated supabase user found.');
        return null;
      }
      
      const actualUserId = authUser.id;`;

const replacement = `      const actualUserId = userId;`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/services/subscriptionService.ts', content, 'utf-8');
  console.log('Successfully patched subscriptionService.ts');
} else {
  console.log('Target string not found. Content is:');
  console.log(content);
}
