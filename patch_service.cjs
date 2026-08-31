const fs = require('fs');
const path = 'src/services/subscriptionService.ts';
let code = fs.readFileSync(path, 'utf8');

const originalSubData = `      // Create new starter subscription payload (without the 'pro' workaround)
      const newSubData = {
        user_id: actualUserId,
        plan_id: starterPlan.id,
        plan_name: 'pro', // Bypass legacy check constraint
        status: 'active',
        billing_cycle: 'monthly',
        payment_status: 'free',
        start_date: new Date().toISOString(),
      };`;

const newSubData = `      // Create new starter subscription payload
      const newSubData = {
        user_id: actualUserId,
        plan_id: starterPlan.id,
        plan_name: 'free',
        status: 'active',
        billing_cycle: 'monthly',
        payment_status: 'free',
        start_date: new Date().toISOString(),
      };`;

code = code.replace(originalSubData, newSubData);

const originalProfileUpdate = `      // Update the profile for backward compatibility to consistently use 'starter'
      await supabase
        .from('profiles')
        .update({ subscription_plan: 'starter' })
        .eq('id', actualUserId);`;

const newProfileUpdate = `      // Update the profile to use 'free' to satisfy the constraint
      await supabase
        .from('profiles')
        .update({ subscription_plan: 'free' })
        .eq('id', actualUserId);`;

code = code.replace(originalProfileUpdate, newProfileUpdate);

fs.writeFileSync(path, code, 'utf8');
