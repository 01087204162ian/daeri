import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground">
                <span className="text-lg font-bold text-primary">E</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">심지글로벌(주)</span>
                <span className="text-[10px] text-primary-foreground/70">대리운전 보험 전문</span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
              심지글로벌(주)은 DB손해보험의 공식 판매대리점으로,
              <br />
              대리운전 종사자를 위한 맞춤형 보험 서비스를 제공합니다.
            </p>
            <div className="mt-4 space-y-1 text-sm text-primary-foreground/70">
              <p>대표: 장인하 | 사업자등록번호: 878-87-02566</p>
              <p>주소: 경기도 과천시 과천대로7길 33, B동 1201호(갈현동, 디테크타워 과천)</p>
              <p>대표전화: 1533-0513 | 이메일: sj@simg.kr</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold">바로가기</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#calculator" className="text-primary-foreground/70 hover:text-primary-foreground">
                  보험료 산출
                </Link>
              </li>
              <li>
                <Link href="#coverage" className="text-primary-foreground/70 hover:text-primary-foreground">
                  담보 및 보상한도
                </Link>
              </li>
              <li>
                <Link href="#service-type" className="text-primary-foreground/70 hover:text-primary-foreground">
                  탁송 및 대리구분
                </Link>
              </li>
              <li>
                <Link href="#apply" className="text-primary-foreground/70 hover:text-primary-foreground">
                  가입신청
                </Link>
              </li>
              <li>
                <Link href="#consultation" className="text-primary-foreground/70 hover:text-primary-foreground">
                  상담신청
                </Link>
              </li>
            </ul>
          </div>

          {/* Insurance Partner */}
          <div>
            <h4 className="font-semibold">제휴 보험사</h4>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-24 items-center justify-center rounded bg-primary-foreground px-3">
                <span className="text-sm font-bold text-primary">DB손해보험</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-primary-foreground/70">
              DB손해보험 등록번호
              <br />
              2024-0001234
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-primary-foreground/20 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-primary-foreground/60">
              © 2025 심지글로벌(주). All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-primary-foreground/60 hover:text-primary-foreground">
                이용약관
              </Link>
              <Link href="#" className="text-primary-foreground/60 hover:text-primary-foreground">
                개인정보처리방침
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
