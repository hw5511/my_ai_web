import type { Config } from "@netlify/functions";

export default async (req: Request) => {
  try {
    const supabaseUrl = Netlify.env.get("SUPABASE_URL");
    const supabaseKey = Netlify.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials");
      return;
    }

    // Supabase REST API로 직접 호출
    const response = await fetch(
      `${supabaseUrl}/rest/v1/players?select=id&limit=1`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        }
      }
    );

    if (!response.ok) {
      console.error("Supabase ping failed:", response.statusText);
      return;
    }

    const timestamp = new Date().toISOString();
    console.log(`Supabase ping successful: ${timestamp}`);
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};

export const config: Config = {
  // 주 3회 실행 (월, 수, 금 오전 9시 UTC = 오후 6시 KST)
  schedule: "0 9 * * 1,3,5"
};
