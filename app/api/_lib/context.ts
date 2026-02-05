import { headers } from "next/headers";
import { queryOne } from "@/lib/mysql";
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

  const partner = await queryOne<PartnerRow>(
    "SELECT id, code, name FROM partners WHERE code = ? LIMIT 1",
    [partnerCode]
  );

  if (!partner) {
    throw new Error(`Unknown partner_code: ${partnerCode}`);
  }

  return { partner, partnerCode, ip, userAgent };
}

