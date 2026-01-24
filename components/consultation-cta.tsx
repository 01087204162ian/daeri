"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, MessageSquare, Clock } from "lucide-react"

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
    value: "@심지그로벌",
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
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "SUBMIT_FAILED")
      }
      setIsSubmitted(true)
      setForm({
        name: "",
        phone: "",
        serviceType: "",
        message: "",
        consentPrivacy: false,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "SUBMIT_FAILED")
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
            <h3 className="text-lg font-bold text-foreground sm:text-xl mb-6">
              연락처 안내
            </h3>

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
            <h3 className="text-xl font-semibold text-foreground">상담 신청</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              정보를 남겨주시면 상담사가 연락드립니다.
            </p>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="consult-name">이름</Label>
                  <Input
                    id="consult-name"
                    placeholder="홍길동"
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consult-phone">연락처</Label>
                  <Input
                    id="consult-phone"
                    type="tel"
                    placeholder="010-0000-0000"
                    required
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consult-service-type">상담 유형</Label>
                <select
                  id="consult-service-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

              <div className="space-y-2">
                <Label htmlFor="consult-message">문의 내용</Label>
                <Textarea
                  id="consult-message"
                  placeholder="문의하실 내용을 입력해주세요."
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="consult-privacy"
                  className="mt-1 h-4 w-4 rounded border-input"
                  checked={form.consentPrivacy}
                  onChange={(e) => setForm((p) => ({ ...p, consentPrivacy: e.target.checked }))}
                  required
                />
                <label htmlFor="consult-privacy" className="text-sm text-muted-foreground">
                  개인정보 수집 및 이용에 동의합니다.{" "}
                  <a href="#" className="text-primary underline">
                    자세히 보기
                  </a>
                </label>
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  접수에 실패했습니다. 잠시 후 다시 시도해주세요. ({error})
                </p>
              )}
              {isSubmitted && (
                <p className="text-sm text-primary">
                  상담 신청이 접수되었습니다. 담당자가 곧 연락드리겠습니다.
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
