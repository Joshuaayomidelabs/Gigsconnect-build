const fs = require('fs');
let content = fs.readFileSync('src/services/subscriptionService.ts', 'utf-8');

// Replace the RLS error handling block
const oldBlock = `      // If we get an RLS error, it means the database needs an INSERT policy for subscriptions.
      // We gracefully return a fallback Starter subscription in memory so the app continues to work.
      if (createErr) {
        if (createErr.code === '42501') {
          console.warn('RLS policy prevents inserting subscriptions. Returning in-memory Starter subscription.');
          
          // Update the profile for backward compatibility even if subscription insert fails
          await supabase
            .from('profiles')
            .update({ subscription_plan: starterPlan.name.toLowerCase() === 'starter' ? 'free' : starterPlan.name.toLowerCase() })
            .eq('id', actualUserId);
            
          return {
            id: \`temp-\${Date.now()}\`,
            user_id: actualUserId,
            plan_id: starterPlan.id,
            plan_name: starterPlan.name,
            status: 'active',
            billing_cycle: 'monthly',
            payment_status: 'free',
            start_date: new Date().toISOString(),
            auto_renew: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            plan: starterPlan
          } as Subscription;
        }
        throw createErr;
      }`;

const newBlock = `      if (createErr) {
        console.error('Subscription insert error:', createErr);
        throw new Error('Unable to create your subscription at this time. Please try again later.');
      }`;

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
  fs.writeFileSync('src/services/subscriptionService.ts', content, 'utf-8');
  console.log('Successfully replaced RLS block');
} else {
  console.log('Could not find old block');
}
