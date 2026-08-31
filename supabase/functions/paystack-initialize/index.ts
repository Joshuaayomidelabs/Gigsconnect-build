import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");

    if (!supabaseUrl || !supabaseKey || !paystackSecret) {
      console.error("Missing configuration");
      return new Response(JSON.stringify({ error: "Configuration error" }), { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      });
    }

    const { user_id, plan_id } = await req.json();

    if (!user_id || !plan_id) {
      return new Response(JSON.stringify({ error: "user_id and plan_id are required" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Fetch user's email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(user_id);
    if (userError || !userData?.user?.email) {
       console.error("User fetch error:", userError);
       return new Response(JSON.stringify({ error: "User not found or missing email" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      });
    }
    const email = userData.user.email;

    // 2. Fetch plan price
    const { data: planData, error: planError } = await supabase
      .from("subscription_plans")
      .select("price_naira")
      .eq("id", plan_id)
      .single();

    if (planError || !planData) {
      console.error("Plan fetch error:", planError);
      return new Response(JSON.stringify({ error: "Plan not found" }), { 
        status: 400, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      });
    }

    // Paystack expects amount in smallest currency unit (kobo)
    const amountKobo = planData.price_naira * 100;

    // 3. Initialize Paystack Transaction
    const origin = req.headers.get("origin") || Deno.env.get("VITE_APP_URL") || "https://gigsconnect.africa";
    const callback_url = `${origin}/pricing`;

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        amount: amountKobo,
        callback_url: callback_url,
        metadata: {
          user_id,
          plan_id
        }
      })
    });

    const result = await response.json();

    if (!response.ok || !result.status) {
       console.error("Paystack initialization failed:", result);
       return new Response(JSON.stringify({ error: "Failed to initialize payment", details: result }), { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      });
    }

    // 4. Return the authorization URL to the client
    return new Response(JSON.stringify({ authorization_url: result.data.authorization_url }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error in paystack-initialize:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
