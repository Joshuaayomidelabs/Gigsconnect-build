import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let recordId: string | null = null;
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  try {
    const payload = await req.json();
    const record = payload.record || payload; // Support wrapped or flat payload
    
    if (!record || !record.id || !record.file_path) {
      return new Response(JSON.stringify({ error: "Invalid payload: Missing id or file_path" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { id, file_path } = record;
    recordId = id; // Store for error handling fallback

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Starting processing job for video ${id} with file_path ${file_path}`);

    // Update status to processing
    const { error: updateStartError } = await supabase
      .from("videos")
      .update({ status: "processing" })
      .eq("id", id);

    if (updateStartError) {
      throw new Error(`Failed to update status to processing: ${updateStartError.message}`);
    }

    console.log(`Video ${id} marked as processing in the database`);

    // Fetch worker URL from environment variable, fallback to logging if not yet set
    const workerServiceUrl = Deno.env.get("WORKER_SERVICE_URL");
    
    if (!workerServiceUrl) {
      console.warn("WORKER_SERVICE_URL is missing. Please set it in your Supabase project's environment variables.");
      throw new Error("Worker service configuration is missing");
    }

    console.log(`Dispatching FFmpeg processing job to worker service: ${workerServiceUrl}`);
    
    // Call the external worker node/service
    const workerResponse = await fetch(workerServiceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Pass the service role key so the worker can securely authenticate back to Supabase
        "Authorization": `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        id,
        file_path,
      }),
    });

    if (!workerResponse.ok) {
      const errorText = await workerResponse.text();
      throw new Error(`Worker service failed to accept job: ${workerResponse.status} ${errorText}`);
    }

    console.log(`Job successfully dispatched to worker service`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Video processing job for ${id} dispatched successfully.` 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error dispatching video job:", error);

    // Provide reliable fallback error state
    if (recordId && supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase
          .from("videos")
          .update({ status: "failed" })
          .eq("id", recordId);
        
        console.log(`Video ${recordId} automatically marked as failed due to dispatch error.`);
      } catch (fallbackError) {
        console.error("Could not update video status to failed:", fallbackError);
      }
    }

    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Internal server error" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
