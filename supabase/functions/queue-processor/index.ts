import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_RETRIES = 3;
const BATCH_SIZE = 5;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const workerServiceUrl = Deno.env.get("WORKER_SERVICE_URL");

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
    return new Response(JSON.stringify({ error: "Configuration error" }), { 
      status: 500, 
      headers: { "Content-Type": "application/json", ...corsHeaders } 
    });
  }

  if (!workerServiceUrl) {
    console.error("Missing WORKER_SERVICE_URL environment variable");
    return new Response(JSON.stringify({ error: "Configuration error" }), { 
      status: 500, 
      headers: { "Content-Type": "application/json", ...corsHeaders } 
    });
  }

  // Create a Supabase client with the Service Role Key securely
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log("Checking for pending video processing jobs...");

    // 1. Fetch pending jobs from the queue limit to BATCH_SIZE
    const { data: pendingJobs, error: fetchError } = await supabase
      .from("video_processing_queue")
      .select("id, video_id, file_path, retries")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(BATCH_SIZE);

    if (fetchError) {
      throw new Error(`Failed to fetch pending jobs: ${fetchError.message}`);
    }

    if (!pendingJobs || pendingJobs.length === 0) {
      console.log("No pending jobs found.");
      return new Response(JSON.stringify({ success: true, message: "No pending jobs found", processed: 0 }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`Found ${pendingJobs.length} pending jobs to process.`);
    let processedCount = 0;

    // 2. Process each job
    for (const job of pendingJobs) {
      console.log(`Attempting to lock and process job ${job.id} for video ${job.video_id}`);

      // 3. Lock job: atomically update status to "processing" where status is still "pending"
      const { data: lockedJob, error: lockError } = await supabase
        .from("video_processing_queue")
        .update({ status: "processing" })
        .eq("id", job.id)
        .eq("status", "pending") 
        .select()
        .single();

      if (lockError || !lockedJob) {
        console.log(`Failed to lock job ${job.id}, it may have been picked up by another process.`);
        continue;
      }

      console.log(`Job ${job.id} successfully locked. Dispatching to worker...`);

      try {
        // 4. Send the job payload to the external worker service
        const workerResponse = await fetch(workerServiceUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            video_id: job.video_id,
            file_path: job.file_path,
          }),
        });

        if (!workerResponse.ok) {
          const errorText = await workerResponse.text();
          throw new Error(`Worker service returned error: ${workerResponse.status} ${errorText}`);
        }

        console.log(`Worker service succeeded for job ${job.id}. Updating database states...`);

        // 5. Update queue status to done and mark video as processed
        const { error: queueUpdateError } = await supabase
          .from("video_processing_queue")
          .update({ status: "done" })
          .eq("id", job.id);

        if (queueUpdateError) {
          console.error(`Warning: Failed to update queue record ${job.id} to done`, queueUpdateError);
        }

        const { error: videoUpdateError } = await supabase
          .from("videos")
          .update({ status: "processed" })
          .eq("id", job.video_id);

        if (videoUpdateError) {
           console.error(`Warning: Failed to update video record ${job.video_id} to processed`, videoUpdateError);
        }

        processedCount++;
        console.log(`Job ${job.id} successfully completed.`);

      } catch (workerError) {
        console.error(`Error processing job ${job.id}:`, workerError);

        // 6. Handle failure conditions
        const nextRetries = (job.retries || 0) + 1;
        
        if (nextRetries < MAX_RETRIES) {
          console.log(`Job ${job.id} failed. Retrying (${nextRetries}/${MAX_RETRIES}). Reverting to pending.`);
          await supabase
            .from("video_processing_queue")
            .update({ 
               status: "pending", 
               retries: nextRetries 
            })
            .eq("id", job.id);
        } else {
          console.error(`Job ${job.id} has reached max retries (${MAX_RETRIES}). Marking as failed permanently.`);
          
          await supabase
            .from("video_processing_queue")
            .update({ 
               status: "failed", 
               retries: nextRetries 
            })
            .eq("id", job.id);

          await supabase
            .from("videos")
            .update({ status: "failed" })
            .eq("id", job.video_id);
        }
      }
    }

    console.log(`Finished processing batch. Total processed / attempted: ${processedCount} / ${pendingJobs.length}`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Batch processing completed", 
      processed: processedCount 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Critical error in queue processor:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Internal server error" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
