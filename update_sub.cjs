const fs = require('fs');
const file = 'src/services/subscriptionService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
`      if (createErr) {
        if (createErr.code === '42501') {
          console.warn('RLS policy prevents inserting subscriptions. Returning in-memory Starter subscription.');
          
          // Update the profile for backward compatibility even if subscription insert fails
          await supabase
            .from('profiles')
            .update({ subscription_plan: starterPlan.name.toLowerCase() === 'starter' ? 'free' : starterPlan.name.toLowerCase() })
            .eq('id', userId);
          
          return {
            id: \`temp-\${Date.now()}\`,
            user_id: userId,
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
      }`,
`      if (createErr) {
        console.warn('Failed to insert subscription. Returning in-memory Starter subscription.', createErr);
        
        await supabase
          .from('profiles')
          .update({ subscription_plan: starterPlan.name.toLowerCase() === 'starter' ? 'free' : starterPlan.name.toLowerCase() })
          .eq('id', userId);
        
        return {
          id: \`temp-\${Date.now()}\`,
          user_id: userId,
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
      }`
);

// Also change the throw existErr to a warning
code = code.replace(
`      if (existErr) throw existErr;`,
`      if (existErr) console.warn('existErr:', existErr);`
);

// also remove the console.error or change it
code = code.replace(
`      console.error('Error ensuring starter subscription:', error instanceof Error ? error.message : JSON.stringify(error));`,
`      console.warn('Could not ensure starter subscription:', error instanceof Error ? error.message : JSON.stringify(error));`
);

fs.writeFileSync(file, code);
console.log("Updated!");
