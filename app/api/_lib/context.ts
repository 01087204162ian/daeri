import { headers } from "next/headers";
import { queryOne } from "@/lib/mysql";
import { getPartnerCodeFromUrl, getPartnerCodeFromCookie } from "@/lib/partner";

export type PartnerRow = { id: string; code: string; name: string };

export async function getPartnerContext(req?: Request): Promise<{
  partner: PartnerRow;
  partnerCode: string;
  ip: string | null;
  userAgent: string | null;
}> {
  const h = await headers();
  
  // 1. 쿠키에서 파트너 코드 확인 (우선순위 - 미들웨어에서 설정됨)
  const cookieHeader = h.get("cookie");
  let partnerCode = getPartnerCodeFromCookie(cookieHeader);
  
  // 2. 쿠키에 없으면 URL 파라미터에서 확인 (API 직접 호출 시 대응)
  if (partnerCode === "default" && req?.url) {
    const urlPartnerCode = getPartnerCodeFromUrl(req.url);
    if (urlPartnerCode !== "default") {
      partnerCode = urlPartnerCode;
    }
  }
  
  // 3. referer 헤더에서도 확인 (클라이언트 사이드 호출 대응)
  if (partnerCode === "default") {
    const referer = h.get("referer");
    if (referer) {
      const refererPartnerCode = getPartnerCodeFromUrl(referer);
      if (refererPartnerCode !== "default") {
        partnerCode = refererPartnerCode;
      }
    }
  }
  
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

