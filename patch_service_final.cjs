const fs = require('fs');
const path = 'src/services/subscriptionService.ts';
let code = fs.readFileSync(path, 'utf8');

const originalSubData = `      // Create new starter subscription payload
      const newSubData = {
        user_id: actualUserId,
        plan_id: starterPlan.id,
        plan_name: 'free',
        status: 'active',
        billing_cycle: 'monthly',
        payment_status: 'free',
        start_date: new Date().toISOString(),
      };`;

const newSubData = `      // Create new starter subscription payload
      const newSubData = {
        user_id: actualUserId,
        plan_id: starterPlan.id,
        plan_name: 'starter',
        status: 'active',
        billing_cycle: 'monthly',
        payment_status: 'free',
        start_date: new Date().toISOString(),
      };`;

code = code.replace(originalSubData, newSubData);

fs.writeFileSync(path, code, 'utf8');
