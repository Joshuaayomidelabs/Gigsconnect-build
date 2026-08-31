const fs = require('fs');
const path = 'supabase/functions/paystack-webhook/index.ts';
let code = fs.readFileSync(path, 'utf8');

const insertBlock = `      const { error: subError } = await supabase
        .from("subscriptions")
        .insert({
           user_id,
           plan_id,
           status: "active",
           payment_status: "paid",
           billing_cycle: duration,
           start_date: startDate.toISOString(),
           end_date: endDate.toISOString(),
           auto_renew: true
        });`;

const updateBlock = `      // Find existing active subscription to update, or upsert if schema allows
      const { data: currentSub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user_id)
        .eq("status", "active")
        .limit(1)
        .single();

      let subError;
      if (currentSub) {
        const { error } = await supabase
          .from("subscriptions")
          .update({
             plan_id,
             payment_status: "paid",
             billing_cycle: duration,
             start_date: startDate.toISOString(),
             end_date: endDate.toISOString(),
             auto_renew: true,
             updated_at: new Date().toISOString()
          })
          .eq("id", currentSub.id);
        subError = error;
      } else {
        const { error } = await supabase
          .from("subscriptions")
          .insert({
             user_id,
             plan_id,
             status: "active",
             payment_status: "paid",
             billing_cycle: duration,
             start_date: startDate.toISOString(),
             end_date: endDate.toISOString(),
             auto_renew: true
          });
        subError = error;
      }`;

code = code.replace(insertBlock, updateBlock);
fs.writeFileSync(path, code, 'utf8');
