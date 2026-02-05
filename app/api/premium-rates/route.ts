import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";

export const runtime = "nodejs";

/**
 * 보험료 데이터 조회 API
 * GET /api/premium-rates
 */
export async function GET() {
  try {
    // 활성화된 보험료 데이터 조회
    const rows = await query<any[]>(
      `SELECT 
        insurance_type,
        age_group,
        daein2,
        daein1_special,
        \`daemul_3천\` as daemul_3천,
        \`daemul_5천\` as daemul_5천,
        \`daemul_1억\` as daemul_1억,
        \`daemul_2억\` as daemul_2억,
        \`jason_3천\` as jason_3천,
        \`jason_5천\` as jason_5천,
        \`jason_1억\` as jason_1억,
        \`jacha_1천\` as jacha_1천,
        \`jacha_2천\` as jacha_2천,
        \`jacha_3천\` as jacha_3천,
        rent_cost,
        legal_cost
      FROM premium_rates
      WHERE is_active = true
        AND (effective_date IS NULL OR effective_date <= CURDATE())
        AND (expiry_date IS NULL OR expiry_date >= CURDATE())
      ORDER BY insurance_type, age_group`
    );

    return NextResponse.json({ ok: true, data: rows });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", message: msg }, { status: 500 });
  }
}
