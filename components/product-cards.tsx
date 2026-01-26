export function ProductCards() {
  return (
    <section id="coverage" className="py-12 sm:py-20 lg:py-28 bg-secondary/30">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-pretty text-xl font-bold text-foreground sm:text-3xl lg:text-4xl">
            담보 및 보상한도
          </h2>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base text-muted-foreground">
            대리운전 종사자를 위한 맞춤형 보상 내용을 확인하세요
          </p>
        </div>

        <div className="bg-background rounded-xl shadow-lg overflow-hidden">
          <h3 className="text-base sm:text-lg font-bold text-primary bg-secondary px-4 sm:px-6 py-3 sm:py-4 border-b-2 border-primary">
            보상하는 내용
          </h3>
          
          {/* 모바일: 카드 형식 */}
          <div className="lg:hidden p-4 space-y-4">
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <div className="font-bold text-primary text-base">대인배상</div>
              <div className="text-sm text-muted-foreground leading-relaxed">자동차 사고로 다른 사람을 죽게하거나 다치게 함으로써 입은 손해를 보상</div>
              <div className="text-sm font-semibold text-accent mt-2">
                <div>책임보험초과 무한</div>
                <div>책임보험포함 무한</div>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <div className="font-bold text-primary text-base">대물배상</div>
              <div className="text-sm text-muted-foreground leading-relaxed">자동차 사고로 다른 사람의 재물에 입은 손해를 보상</div>
              <div className="text-sm font-semibold text-accent mt-2">3천/5천/1억</div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <div className="font-bold text-primary text-base">자기신체손해</div>
              <div className="text-sm text-muted-foreground leading-relaxed">자동차 사고로 운전자가 죽거나 다친 경우의 손해를 보상</div>
              <div className="text-sm font-semibold text-accent mt-2 leading-relaxed">
                <div>사망/후유장해/부상</div>
                <div>3천만/3천만/1천5백만</div>
                <div>5천만/5천만/1천5백만</div>
                <div>1억/1억/1천5백만</div>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="font-bold text-primary text-base">자기차량</div>
              
              <div className="space-y-3 pl-2 border-l-2 border-primary">
                <div className="space-y-1">
                  <div className="font-semibold text-foreground text-sm">자기부담금</div>
                  <div className="text-xs text-muted-foreground">자기 차량 손해금 중에서 운전자가 부담해야할 금액</div>
                  <div className="text-sm font-semibold text-accent mt-1">30만/50만</div>
                </div>

                <div className="space-y-1">
                  <div className="font-semibold text-foreground text-sm">차대차</div>
                  <div className="text-xs text-muted-foreground">자동차 사고로 인해 차량에 직접적으로 생긴 손해를 보상</div>
                  <div className="text-sm font-semibold text-accent mt-1">1천만/2천만/3천만</div>
                </div>

                <div className="space-y-1">
                  <div className="font-semibold text-foreground text-sm">차대차+기타</div>
                  <div className="text-xs text-muted-foreground">자동차 사고로 인해 차량에 직접적으로 생긴 손해를 보상(단독사고 포함)</div>
                  <div className="text-sm font-semibold text-accent mt-1">1천만/2천만/3천만</div>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <div className="font-bold text-primary text-base">벌금비용</div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                운전자가 대인사고를 야기한 경우 형사합의금, 방어비용, 벌금 지급
                <span className="text-xs block mt-1">(벌금 담보 제외 가능)</span>
              </div>
              <div className="text-sm font-semibold text-accent mt-2 leading-relaxed">
                <div>형사합의 지원금</div>
                <div>사망1천만/부상2백만</div>
                <div>방어비용: 2백만</div>
                <div>벌금담보: 2천만</div>
              </div>
            </div>
          </div>

          {/* 데스크톱: 테이블 형식 */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary">
                  <th className="px-4 py-3 text-center font-semibold text-foreground border border-border w-[120px]">구분</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground border border-border">보상하는 내용</th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground border border-border w-[160px]">가입금액</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4 text-center font-medium text-primary border border-border">대인배상</td>
                  <td className="px-4 py-4 text-muted-foreground border border-border">
                    자동차 사고로 다른 사람을 죽게하거나 다치게 함으로써 입은 손해를 보상
                  </td>
                  <td className="px-4 py-4 text-center border border-border">
                    <span className="text-accent font-semibold">책임보험초과 무한</span><br/>
                    <span className="text-accent font-semibold">책임보험포함 무한</span>
                  </td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4 text-center font-medium text-primary border border-border">대물배상</td>
                  <td className="px-4 py-4 text-muted-foreground border border-border">
                    자동차 사고로 다른 사람의 재물에 입은 손해를 보상
                  </td>
                  <td className="px-4 py-4 text-center text-accent font-semibold border border-border">
                    3천/5천/1억
                  </td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4 text-center font-medium text-primary border border-border">자기신체손해</td>
                  <td className="px-4 py-4 text-muted-foreground border border-border">
                    자동차 사고로 운전자가 죽거나 다친 경우의 손해를 보상
                  </td>
                  <td className="px-4 py-4 text-center text-accent font-semibold border border-border leading-relaxed">
                    사망/후유장해/부상<br/>
                    3천만/3천만/1천5백만<br/>
                    5천만/5천만/1천5백만<br/>
                    1억/1억/1천5백만
                  </td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td rowSpan={3} className="px-4 py-4 text-center font-medium text-primary border border-border align-middle">자기차량</td>
                  <td className="px-4 py-4 text-muted-foreground border border-border">
                    <span className="font-medium text-foreground">자기부담금</span> - 자기 차량 손해금 중에서 운전자가 부담해야할 금액
                  </td>
                  <td className="px-4 py-4 text-center text-accent font-semibold border border-border">
                    30만/50만
                  </td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4 text-muted-foreground border border-border">
                    <span className="font-medium text-foreground">차대차</span> - 자동차 사고로 인해 차량에 직접적으로 생긴 손해를 보상
                  </td>
                  <td className="px-4 py-4 text-center text-accent font-semibold border border-border">
                    1천만/2천만/3천만
                  </td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4 text-muted-foreground border border-border">
                    <span className="font-medium text-foreground">차대차+기타</span> - 자동차 사고로 인해 차량에 직접적으로 생긴 손해를 보상(단독사고 포함)
                  </td>
                  <td className="px-4 py-4 text-center text-accent font-semibold border border-border">
                    1천만/2천만/3천만
                  </td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4 text-center font-medium text-primary border border-border">벌금비용</td>
                  <td className="px-4 py-4 text-muted-foreground border border-border">
                    운전자가 대인사고를 야기한 경우 형사합의금, 방어비용, 벌금 지급
                    <span className="text-xs block mt-1">(벌금 담보 제외 가능)</span>
                  </td>
                  <td className="px-4 py-4 text-center text-accent font-semibold border border-border leading-relaxed">
                    형사합의 지원금<br/>
                    사망1천만/부상2백만<br/>
                    방어비용: 2백만<br/>
                    벌금담보: 2천만
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 유의사항 */}
        <div className="mt-6 sm:mt-8 bg-background rounded-xl shadow-lg overflow-hidden">
          <h3 className="text-base sm:text-lg font-bold text-primary bg-secondary px-4 sm:px-6 py-3 sm:py-4 border-b-2 border-primary">
            대리운전업보험 가입시 유의 사항
          </h3>
          
          <div className="p-4 sm:p-6">
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>1년 단위 손해율로 할인할증 적용</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>운전자의 성별/연령에 따라 보험료가 다릅니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>대인 사고의 경우 대인 배상 1(책임보험)으로 보상 받을 수 있는 금액은 제외한다 (사고 발생 차량의 대인배상1으로 보상)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>사고 발생 시 대인배상 2, 대물, 자기차량 손해 등은 대리운전업자 특약에 가입한 한도 내에서 보상 한다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>대리운전 중에 탑승한 차주가 죽거나 다친 경우, 차주에 대해 대인 배상 담보로 보상한다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <div>
                  <span>운전 가능한 차종</span>
                  <div className="mt-1 ml-4 space-y-1">
                    <p><span className="font-medium text-foreground">자가용:</span> 승용차, 1톤 이하 화물차, 16인승 이하 승합차</p>
                    <p><span className="font-medium text-foreground">사업용:</span> 대여 승용차, 16인승 이하 대여승합차</p>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span className="text-destructive font-medium">가입자 본인 소유 차량 및 본인이 통상적으로 운전하는 차량은 보상하지 않음</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
