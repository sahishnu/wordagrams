import { getSession } from "next-auth/react";
import { supabaseAdmin } from "../../lib/supabase";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(404).json({
      message: "User is not signed in.",
    });
  }

  const { email } = session.user;

  // Check if user stats exist
  const { data: existingStats, error: fetchError } = await supabaseAdmin
    .from("user_stats")
    .select("*")
    .eq("email", email)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    return res.status(500).json({ error: fetchError.message });
  }

  // If no stats exist, create them
  if (!existingStats) {
    const { data: newStats, error: insertError } = await supabaseAdmin
      .from("user_stats")
      .insert([{ email, solved_count: 0 }])
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }

    if (req.method === "POST") {
      const { data: updatedStats, error: updateError } = await supabaseAdmin
        .from("user_stats")
        .update({ solved_count: 1 })
        .eq("email", email)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }

      return res.status(200).json({
        solvedCount: updatedStats.solved_count,
      });
    }

    return res.status(200).json({
      solvedCount: newStats.solved_count,
    });
  }

  if (req.method === "POST") {
    const { data: updatedStats, error: updateError } = await supabaseAdmin
      .from("user_stats")
      .update({ solved_count: existingStats.solved_count + 1 })
      .eq("email", email)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    return res.status(200).json({
      solvedCount: updatedStats.solved_count,
    });
  }

  return res.status(200).json({
    solvedCount: existingStats.solved_count,
  });
}
