const fs = require('fs');
let content = fs.readFileSync('src/services/subscriptionService.ts', 'utf-8');

const target = `      // Create new starter subscription payload (without the 'pro' workaround)
      const newSubData = {
        user_id: actualUserId,
        plan_id: starterPlan.id,
        plan_name: starterPlan.name, // Will be 'Starter'
        status: 'active',
        billing_cycle: 'monthly',
        payment_status: 'free',
        start_date: new Date().toISOString(),
      };

      console.log(\`[Subscription Flow] Verified Authenticated User ID: \${actualUserId}. Attempting to insert Starter subscription.\`);
      
      // We must insert without .select() because the restrictive RLS SELECT policy
      // on the subscriptions table blocks the RETURNING clause and causes a 42501 error.
      const { error: createErr } = await supabase
        .from('subscriptions')
        .insert(newSubData);
      
      if (createErr) {
        console.error('Subscription insert error:', createErr);
        throw new Error('Unable to create your subscription at this time. Please try again later.');
      }

      // Update the profile for backward compatibility
      await supabase
        .from('profiles')
        .update({ subscription_plan: 'free' })
        .eq('id', actualUserId);`;

const replacement = `      // Create new starter subscription payload (without the 'pro' workaround)
      const newSubData = {
        user_id: actualUserId,
        plan_id: starterPlan.id,
        plan_name: 'starter', // Consistent lowercase plan_name for the database
        status: 'active',
        billing_cycle: 'monthly',
        payment_status: 'free',
        start_date: new Date().toISOString(),
      };

      console.log(\`[Subscription Flow] Verified Authenticated User ID: \${actualUserId}. Attempting to insert Starter subscription.\`);
      
      // We must insert without .select() because the restrictive RLS SELECT policy
      // on the subscriptions table blocks the RETURNING clause and causes a 42501 error.
      const { error: createErr } = await supabase
        .from('subscriptions')
        .insert(newSubData);
      
      if (createErr) {
        console.error('Subscription insert error:', createErr);
        throw new Error('Unable to create your subscription at this time. Please try again later.');
      }

      // Update the profile for backward compatibility to consistently use 'starter'
      await supabase
        .from('profiles')
        .update({ subscription_plan: 'starter' })
        .eq('id', actualUserId);`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/services/subscriptionService.ts', content, 'utf-8');
  console.log('Successfully patched subscriptionService.ts');
} else {
  console.log('Target string not found in subscriptionService.ts. Content is:');
  console.log(content);
}
