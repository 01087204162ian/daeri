"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle2, XCircle } from "lucide-react"

export function ApplicationForm() {
  const [formData, setFormData] = useState({
    insuranceType: "daeri",
    name: "",
    phone: "",
    residentNumber1: "",
    residentNumber2: "",
    yearlyPremium: "",
    firstPremium: "",
    address: "",
    addressDetail: "",
    isSamePerson: true,
    contractorName: "",
    contractorResidentNumber1: "",
    contractorResidentNumber2: "",
    bankName: "",
    accountNumber: "",
    cardNumber: "",
    cardExpiry: "",
    consentPrivacy: false,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "SUBMIT_FAILED")
      }
      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "SUBMIT_FAILED")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <section id="apply" className="py-12 sm:py-20 lg:py-28 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title - Center */}
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-pretty text-xl font-bold text-foreground sm:text-3xl lg:text-4xl">
            가입신청
          </h2>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base text-muted-foreground">
            5단계로 빠르고 간편하게 대리운전 보험에 가입하세요
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left - Application Process Steps */}
          <div className="rounded-2xl border border-border bg-background p-4 sm:p-6 shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-4">가입 절차 안내</h3>
            
            <Accordion type="single" collapsible className="w-full space-y-2">
              {/* Step 1-1 - 가입신청 (대리기사와 계약자가 같을 경우) */}
              <AccordionItem value="step-1-1" className="border border-border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">1</div>
                    <span className="font-semibold text-foreground text-left">가입신청 (대리기사 = 계약자)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="text-sm text-muted-foreground space-y-1 ml-10 list-disc">
                    <li>대리 운전자 성명, 주민번호, 우편물 받을 주소, 핸드폰번호</li>
                    <li>대리 운전자 은행계좌번호 및 은행명</li>
                    <li>카드 계약 시: 운전자 카드번호와 유효기간</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Step 1-2 - 가입신청 (대리기사와 계약자가 다를 경우) */}
              <AccordionItem value="step-1-2" className="border border-border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">1</div>
                    <span className="font-semibold text-foreground text-left">가입신청 (대리기사 ≠ 계약자)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="text-sm text-muted-foreground space-y-1 ml-10 list-disc">
                    <li>대리 운전자 성명, 주민번호, 우편물 받을 주소, 핸드폰번호</li>
                    <li>계약자 은행계좌번호 및 은행명</li>
                    <li>카드 계약 시: 계약자 카드번호와 유효기간</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Step 2 - DB손해보험 심사 */}
              <AccordionItem value="step-2" className="border border-border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">2</div>
                    <span className="font-semibold text-foreground">DB손해보험 심사</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="text-sm text-muted-foreground space-y-1 ml-10">
                    <li>근무시간(09:00~17:00) 이내 신청건은 <span className="text-primary font-medium">당일 처리</span></li>
                    <li>그 외 시간은 익영업일에 처리됩니다</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Step 3 - 보험료 납입 */}
              <AccordionItem value="step-3" className="border border-border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">3</div>
                    <span className="font-semibold text-foreground">보험료 납입</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="ml-10 text-sm">
                    <div className="flex flex-wrap gap-4 text-muted-foreground">
                      <span>1회차: <span className="text-primary font-medium">25%</span></span>
                      <span>2~7회: <span className="text-primary font-medium">10%</span></span>
                      <span>8~10회: <span className="text-primary font-medium">5%</span></span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Step 4 - 문자안내 */}
              <AccordionItem value="step-4" className="border border-border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">4</div>
                    <span className="font-semibold text-foreground">문자안내</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="text-sm text-muted-foreground space-y-1 ml-10">
                    <li>보험계약 완료 시 운전자님 핸드폰으로 증권번호 발송</li>
                    <li>담당자 핸드폰으로도 증권번호 발송</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* 해지방법 */}
              <AccordionItem value="cancel" className="border border-destructive/30 border-b border-b-destructive/30 bg-destructive/5 rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground font-bold text-xs">
                      <XCircle className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-foreground">해지방법</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="text-sm text-muted-foreground space-y-1 ml-10">
                    <li>계약자, 운전자 신분증을 찍어서 <span className="text-primary font-medium">010-4819-0574</span>로 전송</li>
                    <li>사고가 없으면 일할계산하여 보험료 환급</li>
                    <li>사고가 있을 경우엔 환급금이 없을 수도 있습니다</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Right - Application Form */}
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 보험 유형 선택 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="text-sm font-medium w-32 shrink-0">보험유형 <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.insuranceType}
                  onValueChange={(value) => handleChange("insuranceType", value)}
                >
                  <SelectTrigger className="h-10 flex-1">
                    <SelectValue placeholder="보험 유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daeri">대리</SelectItem>
                    <SelectItem value="taksong">탁송</SelectItem>
                    <SelectItem value="hwakdae">확대탁송</SelectItem>
                    <SelectItem value="daeri-taksong">대리+탁송</SelectItem>
                    <SelectItem value="daeri-hwakdae">대리+확대</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 성명 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="name" className="text-sm font-medium w-32 shrink-0">
                  성명 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="대리기사 성명"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  className="h-10 flex-1"
                />
              </div>

              {/* 연락처 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="phone" className="text-sm font-medium w-32 shrink-0">
                  연락처 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="하이픈없이 핸드폰번호"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, ""))}
                  required
                  className="h-10 flex-1"
                />
              </div>

              {/* 주민번호 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="text-sm font-medium w-32 shrink-0">
                  주민번호 <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    placeholder="앞 6자리"
                    maxLength={6}
                    value={formData.residentNumber1}
                    onChange={(e) => handleChange("residentNumber1", e.target.value.replace(/\D/g, ""))}
                    required
                    className="h-10 flex-1"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="password"
                    placeholder="뒤 7자리"
                    maxLength={7}
                    value={formData.residentNumber2}
                    onChange={(e) => handleChange("residentNumber2", e.target.value.replace(/\D/g, ""))}
                    required
                    className="h-10 flex-1"
                  />
                </div>
              </div>

              {/* 보험료 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="yearlyPremium" className="text-sm font-medium w-32 shrink-0">
                  보험료 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="yearlyPremium"
                  placeholder="년보험료"
                  value={formData.yearlyPremium}
                  onChange={(e) => handleChange("yearlyPremium", e.target.value)}
                  required
                  className="h-10 flex-1"
                />
              </div>

              {/* 1회보험료 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="firstPremium" className="text-sm font-medium w-32 shrink-0">
                  1회보험료 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstPremium"
                  placeholder="1회차보험료"
                  value={formData.firstPremium}
                  onChange={(e) => handleChange("firstPremium", e.target.value)}
                  required
                  className="h-10 flex-1"
                />
              </div>

              {/* 안내 문구 */}
              <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                <p>개인별 가입경력, 사고유무 등에 따라 보험료가 달리 적용될 수 있습니다.</p>
                <p>해지 시, 사고가 있는 경우에는 해지환급금이 없을 수도 있습니다.</p>
              </div>

              {/* 주소 */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <Label htmlFor="address" className="text-sm font-medium w-32 shrink-0 sm:pt-2">
                  주소 <span className="text-destructive">*</span>
                </Label>
                <div className="flex-1 space-y-2">
                  <Input
                    id="address"
                    placeholder="기본 주소"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    required
                    className="h-10"
                  />
                  <Input
                    id="addressDetail"
                    placeholder="상세 주소"
                    value={formData.addressDetail}
                    onChange={(e) => handleChange("addressDetail", e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>

              {/* 대리기사와 계약자 동일 체크박스 */}
              <div className="flex items-center gap-2 pt-2">
                <Checkbox 
                  id="isSamePerson" 
                  checked={formData.isSamePerson}
                  onCheckedChange={(checked) => handleChange("isSamePerson", checked === true)}
                />
                <Label htmlFor="isSamePerson" className="text-sm font-medium cursor-pointer">
                  대리기사와 계약자 동일
                </Label>
              </div>

              {/* 계약자 정보 (대리기사와 다를 경우) */}
              {!formData.isSamePerson && (
                <div className="border border-border rounded-lg p-4 space-y-4 bg-muted/30">
                  <p className="text-sm font-medium text-foreground">계약자 정보</p>
                  
                  {/* 계약자 성명 */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <Label htmlFor="contractorName" className="text-sm font-medium w-32 shrink-0">
                      성명 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contractorName"
                      placeholder="계약자 성명"
                      value={formData.contractorName}
                      onChange={(e) => handleChange("contractorName", e.target.value)}
                      required
                      className="h-10 flex-1"
                    />
                  </div>

                  {/* 계약자 주민번호 */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <Label className="text-sm font-medium w-32 shrink-0">
                      주민번호 <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        placeholder="앞 6자리"
                        maxLength={6}
                        value={formData.contractorResidentNumber1}
                        onChange={(e) => handleChange("contractorResidentNumber1", e.target.value.replace(/\D/g, ""))}
                        required
                        className="h-10 flex-1"
                      />
                      <span className="text-muted-foreground">-</span>
                      <Input
                        type="password"
                        placeholder="뒤 7자리"
                        maxLength={7}
                        value={formData.contractorResidentNumber2}
                        onChange={(e) => handleChange("contractorResidentNumber2", e.target.value.replace(/\D/g, ""))}
                        required
                        className="h-10 flex-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 은행 계좌 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="text-sm font-medium w-32 shrink-0">
                  은행명 <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="은행명"
                  value={formData.bankName}
                  onChange={(e) => handleChange("bankName", e.target.value)}
                  required
                  className="h-10 flex-1"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="text-sm font-medium w-32 shrink-0">
                  계좌번호 <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="계좌번호"
                  value={formData.accountNumber}
                  onChange={(e) => handleChange("accountNumber", e.target.value.replace(/\D/g, ""))}
                  required
                  className="h-10 flex-1"
                />
              </div>

              {/* 카드 결제 안내 */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs text-muted-foreground">
                <p>1회차 보험료를 카드로 결제 하실 분들만 카드번호 입력하세요</p>
              </div>

              {/* 카드번호 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="cardNumber" className="text-sm font-medium w-32 shrink-0">
                  카드번호
                </Label>
                <Input
                  id="cardNumber"
                  placeholder="카드번호"
                  value={formData.cardNumber}
                  onChange={(e) => handleChange("cardNumber", e.target.value.replace(/\D/g, ""))}
                  className="h-10 flex-1"
                />
              </div>

              {/* 유효기간 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="cardExpiry" className="text-sm font-medium w-32 shrink-0">
                  유효기간
                </Label>
                <Input
                  id="cardExpiry"
                  placeholder="MM/YY"
                  value={formData.cardExpiry}
                  onChange={(e) => handleChange("cardExpiry", e.target.value)}
                  className="h-10 flex-1"
                />
              </div>

              {/* 개인정보 동의 */}
              <div className="flex items-start gap-2 pt-2">
                <Checkbox
                  id="apply-consent"
                  checked={formData.consentPrivacy}
                  onCheckedChange={(checked) => handleChange("consentPrivacy", checked === true)}
                />
                <Label htmlFor="apply-consent" className="text-sm font-medium cursor-pointer">
                  개인정보 수집 및 이용에 동의합니다 <span className="text-destructive">*</span>
                </Label>
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  접수에 실패했습니다. 잠시 후 다시 시도해주세요. ({error})
                </p>
              )}

              {/* 제출 버튼 */}
              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-base"
                  disabled={isSubmitting || !formData.consentPrivacy}
                >
                  {isSubmitting ? "접수 중..." : "가입 신청하기"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {isSubmitted && (
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 mt-10">
          <Card className="border-primary/20">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">가입신청이 완료되었습니다</h3>
              <p className="text-muted-foreground mb-6">
                담당자가 확인 후 연락드리겠습니다.<br />
                감사합니다.
              </p>
              <Button onClick={() => setIsSubmitted(false)} variant="outline" className="bg-transparent">
                다시 신청하기
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  )
}
