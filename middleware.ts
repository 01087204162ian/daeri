import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 미들웨어: URL 파라미터에서 파트너 코드를 읽어서 쿠키에 저장
 * 외부 사용자에게 URL 파라미터가 노출되지 않도록 처리
 * 
 * 동작 방식:
 * 1. URL에 ?partner=kakao 파라미터가 있으면 쿠키에 저장
 * 2. URL에서 파라미터 제거하여 리다이렉트 (외부에 노출 방지)
 * 3. 이후 요청은 쿠키에서 파트너 코드를 읽음
 */
export function middleware(request: NextRequest) {
  // URL 파라미터에서 partner 코드 확인
  const partnerParam = request.nextUrl.searchParams.get("partner") || request.nextUrl.searchParams.get("p");
  const existingCookie = request.cookies.get("partner_code");
  
  // 파라미터가 있고, 쿠키와 다르면 쿠키에 저장하고 URL에서 제거
  if (partnerParam && partnerParam.trim()) {
    const partnerCode = partnerParam.trim().toLowerCase();
    
    // 쿠키가 없거나 다른 파트너 코드인 경우
    if (!existingCookie || existingCookie.value !== partnerCode) {
      const url = request.nextUrl.clone();
      url.searchParams.delete("partner");
      url.searchParams.delete("p");
      
      // 쿠키 설정과 함께 리다이렉트
      const response = NextResponse.redirect(url);
      response.cookies.set("partner_code", partnerCode, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1년
        path: "/",
      });
      
      return response;
    } else if (partnerParam) {
      // 쿠키는 이미 있지만 URL에 파라미터가 있는 경우, 파라미터만 제거
      const url = request.nextUrl.clone();
      url.searchParams.delete("partner");
      url.searchParams.delete("p");
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청 경로에 매칭:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
