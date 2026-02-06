/**
 * URL에서 파트너 코드 추출
 * URL 파라미터 방식: ?partner=kakao 또는 ?p=kakao
 * 주의: 외부 사용자에게 노출되지 않도록 쿠키에 저장됨
 */
export function getPartnerCodeFromUrl(url: string | null): string {
  if (!url) return "default";
  
  try {
    const urlObj = new URL(url);
    // ?partner=kakao 또는 ?p=kakao 파라미터 확인
    const partnerCode = urlObj.searchParams.get("partner") || urlObj.searchParams.get("p");
    
    if (partnerCode && partnerCode.trim()) {
      return partnerCode.trim().toLowerCase();
    }
  } catch (e) {
    // URL 파싱 실패 시 기본값 반환
  }
  
  return "default";
}

/**
 * 쿠키에서 파트너 코드 추출
 */
export function getPartnerCodeFromCookie(cookieHeader: string | null): string {
  if (!cookieHeader) return "default";
  
  // 쿠키 문자열에서 partner_code 찾기
  const match = cookieHeader.match(/(?:^|;\s*)partner_code=([^;]+)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]).trim().toLowerCase();
  }
  
  return "default";
}

