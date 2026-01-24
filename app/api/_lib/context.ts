import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getPartnerCodeFromHost } from "@/lib/partner";

export type PartnerRow = { id: string; code: string; name: string };

export async function getPartnerContext(): Promise<{
  partner: PartnerRow;
  partnerCode: string;
  ip: string | null;
  userAgent: string | null;
}> {
  const h = await headers();
  const host = h.get("host");
  const partnerCode = getPartnerCodeFromHost(host);
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = h.get("user-agent");

  const supabase = supabaseAdmin();
  const { data: partner, error } = await supabase
    .from("partners")
    .select("id, code, name")
    .eq("code", partnerCode)
    .maybeSingle();

  if (error) throw new Error(`Partner lookup failed: ${error.message}`);
  if (!partner) throw new Error(`Unknown partner_code: ${partnerCode}`);

  return { partner, partnerCode, ip, userAgent };
}

