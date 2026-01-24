export const TENANT_BASE_DOMAIN = "daeri-site.com";

export function getPartnerCodeFromHost(hostHeader: string | null): string {
  if (!hostHeader) return "default";
  const host = hostHeader.split(":")[0]?.toLowerCase() ?? "";

  // localhost / preview
  if (host === "localhost" || host.endsWith(".vercel.app")) return "default";

  // kakao.daeri-site.com -> kakao
  if (host === TENANT_BASE_DOMAIN) return "default";
  if (host.endsWith(`.${TENANT_BASE_DOMAIN}`)) {
    const subdomain = host.slice(0, -(`.${TENANT_BASE_DOMAIN}`.length));
    const firstLabel = subdomain.split(".")[0];
    return firstLabel || "default";
  }

  return "default";
}

