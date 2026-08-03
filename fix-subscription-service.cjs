const fs = require('fs');
let content = fs.readFileSync('src/services/subscriptionService.ts', 'utf-8');

// Use regex to replace the function body
content = content.replace(/async ensureStarterSubscription\(userId: string\): Promise<Subscription \| null> \{[\s\S]*?try \{/, \`async ensureStarterSubscription(userId: string): Promise<Subscription | null> {
    try {
      // VERY IMPORTANT: Get the actual authenticated user from Supabase to prevent RLS errors.
      const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !authUser) {
        console.warn('Cannot ensure starter subscription: no authenticated supabase user found.');
        return null;
      }
      const actualUserId = authUser.id;
\`);

content = content.replace(/getCurrentSubscription\(userId\)/g, "getCurrentSubscription(actualUserId)");
content = content.replace(/\.eq\('user_id', userId\)/g, ".eq('user_id', actualUserId)");

fs.writeFileSync('src/services/subscriptionService.ts', content, 'utf-8');
