import type { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

export default async (req: Request) => {
  try {
    // 환경변수 확인
    const supabaseUrl = Netlify.env.get("SUPABASE_URL");
    const supabaseKey = Netlify.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials");
      return;
    }

    // Supabase 클라이언트 생성
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 헬스체크 쿼리 실행
    const { data, error } = await supabase
      .from("health_check")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Supabase ping failed:", error.message);
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
  schedule: "0 9 * * 1,3,5",
};
