import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle2 } from "lucide-react"

const benefits = [
  "24시간 보상 접수 가능",
  "합리적인 보험료",
  "빠른 보상 처리",
]

const coverageData = [
  {
    category: "대인배상",
    description: "자동차 사고로 다른 사람을 죽게하거나 다치게 함으로써 입은 손해를 보상",
    amount: "책임보험초과 무한\n책임보험포함 무한"
  },
  {
    category: "대물배상",
    description: "자동차 사고로 다른 사람의 재물에 입은 손해를 보상",
    amount: "3천/5천/1억"
  },
  {
    category: "자기신체손해",
    description: "자동차 사고로 운전자가 죽거나 다친 경우의 손해를 보상",
    amount: "사망/후유장해/부상\n3천만/3천만/1천5백만\n5천만/5천만/1천5백만\n1억/1억/1천5백만"
  },
  {
    category: "자기차량",
    subItems: [
      {
        name: "자기부담금",
        description: "자기 차량 손해금 중에서 운전자가 부담해야할 금액",
        amount: "30만/50만"
      },
      {
        name: "차대차",
        description: "자동차 사고로 인해 차량에 직접적으로 생긴 손해를 보상",
        amount: "1천만/2천만/3천만"
      },
      {
        name: "차대차+기타",
        description: "자동차 사고로 인해 차량에 직접적으로 생긴 손해를 보상(단독사고 포함)",
        amount: "1천만/2천만/3천만"
      }
    ]
  },
  {
    category: "벌금비용",
    description: "운전자가 대인사고를 야기한 경우 형사합의금, 방어비용, 벌금 지급(벌금 담보 제외 가능)",
    amount: "형사합의 지원금\n사망1천만/부상2백만\n방어비용: 2백만\n벌금담보: 2천만"
  }
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-12 sm:py-16 lg:py-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Content - 모바일과 데스크톱 공통 */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs sm:text-sm text-primary-foreground">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span className="whitespace-nowrap">DB손해보험 공식 판매사</span>
            </div>
            
            <h1 className="mt-4 sm:mt-6 text-pretty text-2xl sm:text-3xl font-bold tracking-tight text-primary-foreground lg:text-4xl xl:text-5xl break-words">
              대리운전 종사자를 위한
              <br />
              <span className="text-accent">든든한 보험</span>
            </h1>
            
            <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg leading-relaxed text-primary-foreground/80 break-words px-2 sm:px-0">
              합리적인 보험료로 만일의 사고에 대비하세요.
              <br />
              DB손해보험과 함께하는 안전한 대리운전
            </p>

            <ul className="mt-6 sm:mt-8 flex flex-col gap-2 sm:gap-3 sm:flex-row sm:justify-center lg:justify-start">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-primary-foreground/90">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-accent" />
                  <span className="text-xs sm:text-sm font-medium break-words">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 sm:mt-10 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center lg:justify-start px-2 sm:px-0">
              <Button size="lg" variant="secondary" className="text-sm sm:text-base font-semibold w-full sm:w-auto" asChild>
                <Link href="#calculator">보험료 알아보기</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-sm sm:text-base bg-transparent w-full sm:w-auto" asChild>
                <Link href="#consultation">무료 상담 신청</Link>
              </Button>
            </div>
          </div>

          {/* Coverage Section - 모바일: 카드 형식, 데스크톱: 테이블 형식 */}
          <div className="mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto">
            <div className="rounded-2xl bg-background p-4 sm:p-6 shadow-xl">
              <h3 className="text-base sm:text-lg font-bold text-primary border-b-2 border-primary pb-3 mb-4">
                보상하는 내용
              </h3>
              
              {/* 모바일: 카드 형식 */}
              <div className="lg:hidden space-y-4">
                {coverageData.map((item, index) => (
                  <div key={index}>
                    {item.subItems ? (
                      // 자기차량 (서브 아이템 있음)
                      <div className="space-y-3">
                        <div className="font-bold text-primary text-base mb-2">{item.category}</div>
                        {item.subItems.map((subItem, subIndex) => (
                          <div key={subIndex} className="bg-muted/30 rounded-lg p-3 space-y-2">
                            <div className="font-semibold text-foreground text-sm">{subItem.name}</div>
                            <div className="text-xs text-muted-foreground">{subItem.description}</div>
                            <div className="text-sm font-medium text-accent mt-2">{subItem.amount}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // 일반 항목
                      <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                        <div className="font-bold text-primary text-base">{item.category}</div>
                        <div className="text-xs text-muted-foreground leading-relaxed">{item.description}</div>
                        <div className="text-sm font-medium text-accent mt-2 whitespace-pre-line">{item.amount}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 데스크톱: 테이블 형식 */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="px-3 py-2 text-center font-semibold text-foreground border border-border w-[100px]">구분</th>
                      <th className="px-3 py-2 text-left font-semibold text-foreground border border-border">보상하는 내용</th>
                      <th className="px-3 py-2 text-center font-semibold text-foreground border border-border w-[140px]">가입금액</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    <tr>
                      <td className="px-3 py-2 text-center font-medium text-primary border border-border align-top">대인배상</td>
                      <td className="px-3 py-2 text-muted-foreground border border-border">자동차 사고로 다른 사람을 죽게하거나 다치게 함으로써 입은 손해를 보상</td>
                      <td className="px-3 py-2 text-center text-accent font-medium border border-border leading-tight">책임보험초과 무한<br/>책임보험포함 무한</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-center font-medium text-primary border border-border align-top">대물배상</td>
                      <td className="px-3 py-2 text-muted-foreground border border-border">자동차 사고로 다른 사람의 재물에 입은 손해를 보상</td>
                      <td className="px-3 py-2 text-center text-accent font-medium border border-border">3천/5천/1억</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-center font-medium text-primary border border-border align-top">자기신체손해</td>
                      <td className="px-3 py-2 text-muted-foreground border border-border">자동차 사고로 운전자가 죽거나 다친 경우의 손해를 보상</td>
                      <td className="px-3 py-2 text-center text-accent font-medium border border-border leading-tight">
                        사망/후유장해/부상<br/>
                        3천만/3천만/1천5백만<br/>
                        5천만/5천만/1천5백만<br/>
                        1억/1억/1천5백만
                      </td>
                    </tr>
                    <tr>
                      <td rowSpan={3} className="px-3 py-2 text-center font-medium text-primary border border-border align-middle">자기차량</td>
                      <td className="px-3 py-2 text-muted-foreground border border-border">
                        <span className="font-medium text-foreground">자기부담금</span> - 자기 차량 손해금 중에서 운전자가 부담해야할 금액
                      </td>
                      <td className="px-3 py-2 text-center text-accent font-medium border border-border">30만/50만</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-muted-foreground border border-border">
                        <span className="font-medium text-foreground">차대차</span> - 자동차 사고로 인해 차량에 직접적으로 생긴 손해를 보상
                      </td>
                      <td className="px-3 py-2 text-center text-accent font-medium border border-border">1천만/2천만/3천만</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-muted-foreground border border-border">
                        <span className="font-medium text-foreground">차대차+기타</span> - 자동차 사고로 인해 차량에 직접적으로 생긴 손해를 보상(단독사고 포함)
                      </td>
                      <td className="px-3 py-2 text-center text-accent font-medium border border-border">1천만/2천만/3천만</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-center font-medium text-primary border border-border align-top">벌금비용</td>
                      <td className="px-3 py-2 text-muted-foreground border border-border">운전자가 대인사고를 야기한 경우 형사합의금, 방어비용, 벌금 지급(벌금 담보 제외 가능)</td>
                      <td className="px-3 py-2 text-center text-accent font-medium border border-border leading-tight">
                        형사합의 지원금<br/>
                        사망1천만/부상2백만<br/>
                        방어비용: 2백만<br/>
                        벌금담보: 2천만
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <Button className="mt-4 sm:mt-6 w-full text-sm sm:text-base" size="lg" asChild>
                <Link href="#apply">지금 가입하기</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
