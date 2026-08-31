import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import crypto from "node:crypto";

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");

    if (!supabaseUrl || !supabaseKey || !paystackSecret) {
      console.error("Missing configuration");
      return new Response("Configuration error", { status: 500 });
    }

    // 1. Verify the request signature
    const signature = req.headers.get("x-paystack-signature");
    if (!signature) {
      return new Response("Missing signature", { status: 401 });
    }

    const bodyText = await req.text();

    const hash = crypto.createHmac("sha512", paystackSecret)
                       .update(bodyText)
                       .digest("hex");

    if (hash !== signature) {
      console.error("Invalid signature");
      return new Response("Invalid signature", { status: 401 });
    }

    // 2. Parse the verified payload
    const event = JSON.parse(bodyText);

    // 3. Handle charge.success
    if (event.event === "charge.success") {
      const { metadata, reference } = event.data;
      const { user_id, plan_id } = metadata || {};

      if (!user_id || !plan_id) {
        console.error("Missing metadata for charge.success:", reference);
        return new Response("Missing metadata", { status: 400 });
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Fetch plan name + duration to compute end_date and satisfy the
      // plan_name constraint on `subscriptions` (fallback to monthly)
      const { data: planData, error: planError } = await supabase
        .from('subscription_plans')
        .select('name, duration')
        .eq('id', plan_id)
        .single();

      if (planError || !planData) {
        console.error(`Failed to fetch plan for plan_id ${plan_id}:`, planError);
        return new Response("Plan not found", { status: 400 });
      }

      // plan_name is required by an existing check constraint on the
      // subscriptions table (see subscriptionService.ts comment) — must
      // always be set on insert/update or the write is rejected.
      const planName = (planData.name || 'starter').toLowerCase();
      const duration = planData.duration || 'monthly';

      const startDate = new Date();
      const endDate = new Date(startDate);
      if (duration === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      // 4. Update the user's subscription
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
             plan_name: planName,
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
             plan_name: planName,
             status: "active",
             payment_status: "paid",
             billing_cycle: duration,
             start_date: startDate.toISOString(),
             end_date: endDate.toISOString(),
             auto_renew: true
          });
        subError = error;
      }

      if (subError) {
        console.error("Error inserting subscription:", subError);
        return new Response("Database error", { status: 500 });
      }

      // Update the user's profile to reflect their active plan visually in the app
      // (uses the real plan name fetched from subscription_plans rather than a
      // hardcoded id → name mapping, so it stays correct if plans are added/reordered)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ subscription_plan: planName })
        .eq('id', user_id);

      if (profileError) {
        console.error("Warning: Could not update profile subscription_plan field:", profileError);
      }
    }

    // Paystack expects a 200 response to acknowledge receipt
    return new Response("Webhook processed", { status: 200 });

  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Internal server error", { status: 500 });
  }
});
