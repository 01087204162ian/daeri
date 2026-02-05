'use client'

import { Analytics } from '@vercel/analytics/next'

export function VercelAnalytics() {
  // Vercel 환경에서만 Analytics 활성화
  if (process.env.NEXT_PUBLIC_VERCEL_ENV) {
    return <Analytics />
  }
  return null
}
