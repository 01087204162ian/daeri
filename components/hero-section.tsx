import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle2 } from "lucide-react"

const benefits = [
  "24시간 보상 접수 가능",
  "합리적인 보험료",
  "빠른 보상 처리",
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 lg:py-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-primary-foreground">
              <Shield className="h-4 w-4" />
              DB손해보험 공식 판매사
            </div>
            
            <h1 className="mt-6 text-pretty text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
              대리운전 종사자를 위한
              <br />
              <span className="text-accent">든든한 보험</span>
            </h1>
            
            <p className="mt-6 text-lg leading-relaxed text-primary-foreground/80">
              합리적인 보험료로 만일의 사고에 대비하세요.
              <br className="hidden sm:block" />
              DB손해보험과 함께하는 안전한 대리운전
            </p>

            <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-primary-foreground/90">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm font-medium">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button size="lg" variant="secondary" className="text-base font-semibold" asChild>
                <Link href="#calculator">보험료 알아보기</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base bg-transparent" asChild>
                <Link href="#consultation">무료 상담 신청</Link>
              </Button>
            </div>
          </div>

          {/* Coverage Table Card */}
          <div className="mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto">
            <div className="rounded-2xl bg-background p-4 sm:p-6 shadow-xl">
              <h3 className="text-base sm:text-lg font-bold text-primary border-b-2 border-primary pb-2 mb-0">
                보상하는 내용
              </h3>
              
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <table className="w-full text-xs sm:text-sm min-w-[480px]">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="px-2 sm:px-3 py-2 text-center font-semibold text-foreground border border-border w-[80px] sm:w-[100px]">구분</th>
                      <th className="px-2 sm:px-3 py-2 text-center font-semibold text-foreground border border-border">보상하는 내용</th>
                      <th className="px-2 sm:px-3 py-2 text-center font-semibold text-foreground border border-border w-[100px] sm:w-[140px]">가입금액</th>
                    </tr>
                  </thead>
                  <tbody className="text-[10px] sm:text-xs">
                    <tr>
                      <td className="px-2 sm:px-3 py-2 text-center font-medium text-primary border border-border">대인배상</td>
                      <td className="px-2 sm:px-3 py-2 text-muted-foreground border border-border">자동차 사고로 다른 사람을 죽게하거나 다치게 함으로써 입은 손해를 보상</td>
                      <td className="px-2 sm:px-3 py-2 text-center text-accent font-medium border border-border text-[9px] sm:text-xs">책임보험초과 무한<br/>책임보험포함 무한</td>
                    </tr>
                    <tr>
                      <td className="px-2 sm:px-3 py-2 text-center font-medium text-primary border border-border">대물배상</td>
                      <td className="px-2 sm:px-3 py-2 text-muted-foreground border border-border">자동차 사고로 다른 사람의 재물에 입은 손해를 보상</td>
                      <td className="px-2 sm:px-3 py-2 text-center text-accent font-medium border border-border">3천/5천/1억</td>
                    </tr>
                    <tr>
                      <td className="px-2 sm:px-3 py-2 text-center font-medium text-primary border border-border">자기신체손해</td>
                      <td className="px-2 sm:px-3 py-2 text-muted-foreground border border-border">자동차 사고로 운전자가 죽거나 다친 경우의 손해를 보상</td>
                      <td className="px-2 sm:px-3 py-2 text-center text-accent font-medium border border-border text-[8px] sm:text-[10px] leading-tight">
                        사망/후유장해/부상<br/>
                        3천만/3천만/1천5백만<br/>
                        5천만/5천만/1천5백만<br/>
                        1억/1억/1천5백만
                      </td>
                    </tr>
                    <tr>
                      <td rowSpan={3} className="px-2 sm:px-3 py-2 text-center font-medium text-primary border border-border align-middle">자기차량</td>
                      <td className="px-2 sm:px-3 py-2 text-muted-foreground border border-border">
                        <span className="font-medium text-foreground">자기부담금</span> <span className="hidden sm:inline">-</span> <span className="hidden sm:inline">자기 차량 손해금 중에서 운전자가 부담해야할 금액</span>
                      </td>
                      <td className="px-2 sm:px-3 py-2 text-center text-accent font-medium border border-border">30만/50만</td>
                    </tr>
                    <tr>
                      <td className="px-2 sm:px-3 py-2 text-muted-foreground border border-border">
                        <span className="font-medium text-foreground">차대차</span> <span className="hidden sm:inline">- 자동차 사고로 인해 차량에 직접적으로 생긴 손해를 보상</span>
                      </td>
                      <td className="px-2 sm:px-3 py-2 text-center text-accent font-medium border border-border text-[9px] sm:text-xs">1천만/2천만/3천만</td>
                    </tr>
                    <tr>
                      <td className="px-2 sm:px-3 py-2 text-muted-foreground border border-border">
                        <span className="font-medium text-foreground">차대차+기타</span> <span className="hidden sm:inline">- 자동차 사고로 인해 차량에 직접적으로 생긴 손해를 보상(단독사고 포함)</span>
                      </td>
                      <td className="px-2 sm:px-3 py-2 text-center text-accent font-medium border border-border text-[9px] sm:text-xs">1천만/2천만/3천만</td>
                    </tr>
                    <tr>
                      <td className="px-2 sm:px-3 py-2 text-center font-medium text-primary border border-border">벌금비용</td>
                      <td className="px-2 sm:px-3 py-2 text-muted-foreground border border-border"><span className="hidden sm:inline">운전자가 대인사고를 야기한 경우 형사합의금, 방어비용, 벌금 지급(벌금 담보 제외 가능)</span><span className="sm:hidden">형사합의금, 방어비용, 벌금 지급</span></td>
                      <td className="px-2 sm:px-3 py-2 text-accent font-medium border border-border text-[8px] sm:text-[10px] leading-tight">
                        형사합의 지원금<br/>
                        사망1천만/부상2백만<br/>
                        방어비용: 2백만<br/>
                        벌금담보: 2천만
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <Button className="mt-4 w-full" size="lg" asChild>
                <Link href="#consultation">지금 가입하기</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
