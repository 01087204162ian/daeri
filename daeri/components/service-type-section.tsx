const faqItems = [
  {
    question: "대리운전은 반드시 '동승'을 해야하나요?",
    answer: "대리운전은 '음주' 등으로 차를 운전하지 못한 경우 운전만을 대행하는 것으로 통상 '동승'이 반드시 필요합니다. 다만, 사고조사에 따라 통상의 대리운전 과정 중의 일시적 무동승 등 보험회사가 인정하는 통상의 대리운전은 예외처리 가능",
  },
  {
    question: "'보험회사가 인정하는 통상의 대리운전'이란?",
    answer: "대리운전은 동승이 필요하지만, 운행목적 및 비동승사유 등에서 볼 때, 대리운전으로 확인된 경우를 말합니다.",
    examples: [
      "음주상태로 차량 한대에 함께타고, 나머지 차량은 따라오게 한 경우",
      "대리운전 도중, 술한잔 더하기 위해 중간 목적지에 내리고 집으로 차량만을 보낸 경우"
    ]
  },
  {
    question: "탁송운전은 반드시 '비동승' 이어야 하나요?",
    answer: "탁송은 차량만의 운송을 위해 차량을 옮겨주는 것입니다. 따라서, 이용자(차주)가 동승하지 않아야 합니다.",
    note: "차주 동승은 결국 운전의 대행인 '대리운전'을 말합니다."
  },
  {
    question: "렌트업체 종업원이 고객의 차를 배송 또는 반송 하는 경우에는 어떤 특약을 가입해야 하나요?",
    answer: "질문 상황 외에도 수탁차량을 요청지까지 운전하여 운송 해주는 경우는 모두 '탁송'에 해당합니다. 이 경우, 탁송 운전위험 담보 특약을 가입하면 됩니다.",
    note: "탁송은 이용자(차주)의 비동승이 원칙이라는 점은 반드시 유의."
  },
]

export function ServiceTypeSection() {
  return (
    <section id="service-type" className="bg-secondary py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-pretty text-xl font-bold text-foreground sm:text-3xl lg:text-4xl">
            탁송 및 대리구분
          </h2>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base text-muted-foreground">
            대리운전과 탁송운전의 구분 방법을 확인하세요
          </p>
        </div>

        {/* 운전가능차량 테이블 */}
        <div className="bg-background rounded-xl shadow-lg overflow-hidden mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-bold text-primary bg-muted px-4 sm:px-6 py-3 sm:py-4 border-b-2 border-primary">
            대리 / 탁송 구분 방법
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-semibold text-foreground border border-border w-[70px] sm:w-[100px]">구분</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-semibold text-foreground border border-border">운전가능차량</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-center font-medium text-primary border border-border">대리</td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-muted-foreground border border-border">
                    승용, 경/3종승합, 경/4종화물, 3종화물(1.4t이하)
                  </td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-center font-medium text-primary border border-border">탁송</td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-muted-foreground border border-border">
                    승용차 / 승합차(15인승이하) / 화물차(12t 미만)
                  </td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-center font-medium text-primary border border-border">확대탁송</td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-muted-foreground border border-border">
                    승용차 / 승합차 / 화물차 / 특정용도 및 특수작업차 / 9종 건설기계(의무)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ 섹션 */}
        <div className="bg-background rounded-xl shadow-lg overflow-hidden">
          <h3 className="text-base sm:text-lg font-bold text-primary bg-muted px-4 sm:px-6 py-3 sm:py-4 border-b-2 border-primary">
            자주 묻는 질문
          </h3>
          
          <div className="divide-y divide-border">
            {faqItems.map((item, index) => (
              <div key={index} className="p-4 sm:p-6">
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary text-primary-foreground font-bold text-xs sm:text-sm">
                    Q{index + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">{item.question}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                    
                    {item.examples && (
                      <div className="mt-3 pl-4 border-l-2 border-accent">
                        <p className="text-xs font-medium text-foreground mb-1">예시)</p>
                        <ul className="space-y-1">
                          {item.examples.map((example, i) => (
                            <li key={i} className="text-xs text-muted-foreground">
                              {i + 1}. {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {item.note && (
                      <p className="mt-2 text-xs text-accent font-medium">
                        * {item.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
