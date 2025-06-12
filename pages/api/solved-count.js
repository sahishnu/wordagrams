import { getSession } from "next-auth/react";
import { supabaseAdmin } from "../../lib/supabase";

const ANON_USER = "anon";

export default async function handler(req, res) {
  const session = await getSession({ req });
  let user;
  if (session?.user) {
    user = session.user;
  } else {
    user = ANON_USER;
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({
      message: "Day slug not provided",
    });
  }

  // Check if solved count exists
  const { data: existingCount, error: fetchError } = await supabaseAdmin
    .from("solved_counts")
    .select("*")
    .eq("slug", slug)
    .single();

  // TODO: What is going on here.
  if (fetchError && fetchError.code !== "PGRST116") {
    return res.status(500).json({ error: fetchError.message });
  }

  // If no solved count exists, create it
  if (!existingCount) {
    const { data: newCount, error: insertError } = await supabaseAdmin
      .from("solved_counts")
      .insert([{ slug, hits: 0 }])
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }
  }

  if (req.method === "POST") {
    const body = JSON.parse(req.body);
    const { timeTaken } = body;

    // Insert solve time
    const { error: solveTimeError } = await supabaseAdmin
      .from("solve_times")
      .insert([
        {
          solved_count_id: existingCount?.id || newCount.id,
          time_taken: timeTaken,
          user_email: user !== ANON_USER ? user.email : null,
          user_name: user !== ANON_USER ? user.name : null,
        },
      ]);

    if (solveTimeError) {
      return res.status(500).json({ error: solveTimeError.message });
    }

    // Update hits count
    const { data: updatedCount, error: updateError } = await supabaseAdmin
      .from("solved_counts")
      .update({ hits: (existingCount?.hits || 0) + 1 })
      .eq("slug", slug)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    // Get top 10 solve times
    const { data: solveTimes, error: solveTimesError } = await supabaseAdmin
      .from("solve_times")
      .select("*")
      .eq("solved_count_id", updatedCount.id)
      .order("time_taken", { ascending: true })
      .limit(10);

    if (solveTimesError) {
      return res.status(500).json({ error: solveTimesError.message });
    }

    // Filter and format solve times
    const filteredSolveTimes = solveTimes
      .filter((time) => time.user_email !== null)
      .map((time) => ({
        timeTaken: time.time_taken,
        user: time.user_name,
        isUser: time.user_email === user.email,
      }));

    return res.status(200).json({
      hits: updatedCount.hits,
      solveTimes: filteredSolveTimes,
    });
  }

  // For GET requests, fetch existing solve times
  const { data: solveTimes, error: solveTimesError } = await supabaseAdmin
    .from("solve_times")
    .select("*")
    .eq("solved_count_id", existingCount?.id)
    .order("time_taken", { ascending: true })
    .limit(10);

  if (solveTimesError) {
    return res.status(500).json({ error: solveTimesError.message });
  }

  const filteredSolveTimes = solveTimes
    .filter((time) => time.user_email !== null)
    .map((time) => ({
      timeTaken: time.time_taken,
      user: time.user_name,
      isUser: time.user_email === user.email,
    }));

  return res.status(200).json({
    hits: existingCount?.hits || 0,
    solveTimes: filteredSolveTimes,
  });
}
