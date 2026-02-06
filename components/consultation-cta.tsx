"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Phone, MessageSquare, Clock } from "lucide-react"
import { toast } from "sonner"

const contactMethods = [
  {
    icon: Phone,
    title: "전화 상담",
    description: "평일 09:00 - 18:00",
    value: "1588-0513",
  },
  {
    icon: MessageSquare,
    title: "카카오톡 상담",
    description: "실시간 상담 가능",
    value: "@심지글로벌",
  },
  {
    icon: Clock,
    title: "24시간 접수",
    description: "사고 접수는 24시간",
    value: "1588-0100",
  },
]

export function ConsultationCTA() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    serviceType: "",
    message: "",
    consentPrivacy: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatPhoneNumber = (value: string): string => {
    // 숫자만 추출
    const numbers = value.replace(/\D/g, "")
    
    // 길이에 따라 하이픈 추가
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`
    } else {
      // 11자리 초과 시 11자리까지만
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      // 쿠키에서 partner 코드 가져오기 (URL 파라미터는 서버에서 쿠키로 변환됨)
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "SUBMIT_FAILED")
      }
      
      // 성공 시 토스트 메시지 표시 및 폼 초기화
      toast.success("상담신청이 완료되었습니다", {
        description: "담당자가 확인 후 곧 연락드리겠습니다.",
        duration: 5000,
      })
      
      // 폼 초기화
      setForm({
        name: "",
        phone: "",
        serviceType: "",
        message: "",
        consentPrivacy: false,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "SUBMIT_FAILED"
      setError(errorMessage)
      toast.error("상담신청에 실패했습니다", {
        description: "잠시 후 다시 시도해주세요.",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="consultation" className="py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title - Center */}
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-pretty text-xl font-bold text-foreground sm:text-3xl lg:text-4xl">
            상담신청
          </h2>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base text-muted-foreground">
            가입 문의부터 보상 처리까지, 대리운전 보험의 모든 것을 도와드립니다.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left - Contact Methods */}
          <div>
            <div className="space-y-4">
              {contactMethods.map((method) => (
                <div
                  key={method.title}
                  className="flex items-center gap-4 rounded-lg border border-border bg-background p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <method.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{method.title}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  <span className="font-semibold text-primary">{method.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm lg:p-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* 이름 */}
              <div className="flex flex-row items-center gap-2 sm:gap-4">
                <Label htmlFor="consult-name" className="text-sm font-medium w-32 shrink-0">
                  이름 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="consult-name"
                  placeholder="홍길동"
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="h-10 flex-1 bg-background border-border/60 shadow-sm transition-all duration-200 hover:border-border focus-visible:border-primary focus-visible:shadow-md"
                />
              </div>

              {/* 연락처 */}
              <div className="flex flex-row items-center gap-2 sm:gap-4">
                <Label htmlFor="consult-phone" className="text-sm font-medium w-32 shrink-0">
                  연락처 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="consult-phone"
                  type="tel"
                  placeholder="010-0000-0000"
                  required
                  value={form.phone}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value)
                    setForm((p) => ({ ...p, phone: formatted }))
                  }}
                  className="h-10 flex-1 bg-background border-border/60 shadow-sm transition-all duration-200 hover:border-border focus-visible:border-primary focus-visible:shadow-md"
                />
              </div>

              {/* 상담 유형 */}
              <div className="flex flex-row items-center gap-2 sm:gap-4">
                <Label htmlFor="consult-service-type" className="text-sm font-medium w-32 shrink-0">
                  상담 유형
                </Label>
                <select
                  id="consult-service-type"
                  className="h-10 flex-1 bg-background border-border/60 shadow-sm transition-all duration-200 hover:border-border focus:border-primary focus:shadow-md rounded-md px-3 py-2 text-sm"
                  value={form.serviceType}
                  onChange={(e) => setForm((p) => ({ ...p, serviceType: e.target.value }))}
                >
                  <option value="">선택해주세요</option>
                  <option value="proxy">대리운전 보험</option>
                  <option value="delivery">탁송운전 보험</option>
                  <option value="claim">보상 문의</option>
                  <option value="other">기타 문의</option>
                </select>
              </div>

              {/* 문의 내용 */}
              <div className="flex flex-row items-start gap-2 sm:gap-4">
                <Label htmlFor="consult-message" className="text-sm font-medium w-32 shrink-0 pt-2">
                  문의 내용
                </Label>
                <Textarea
                  id="consult-message"
                  placeholder="문의하실 내용을 입력해주세요."
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className="flex-1 bg-background border-border/60 shadow-sm transition-all duration-200 hover:border-border focus-visible:border-primary focus-visible:shadow-md"
                />
              </div>

              {/* 개인정보 동의 */}
              <div className="flex items-start gap-2 pt-2">
                <Checkbox
                  id="consult-privacy"
                  checked={form.consentPrivacy}
                  onCheckedChange={(checked) => setForm((p) => ({ ...p, consentPrivacy: checked === true }))}
                />
                <Label htmlFor="consult-privacy" className="text-sm font-medium cursor-pointer">
                  개인정보 수집 및 이용에 동의합니다 <span className="text-destructive">*</span>
                </Label>
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  접수에 실패했습니다. 잠시 후 다시 시도해주세요. ({error})
                </p>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "접수 중..." : "상담 신청하기"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
