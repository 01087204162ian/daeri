"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "보험료 산출", href: "#calculator" },
  { label: "담보 및 보상한도", href: "#coverage" },
  { label: "탁송 및 대리구분", href: "#service-type" },
  { label: "가입신청", href: "#apply" },
  { label: "상담신청", href: "#consultation" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="/images/db-logo.png" 
              alt="DB손해보험" 
              className="h-10 sm:h-12 md:h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <a
              href="tel:1588-0000"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground"
            >
              <Phone className="h-4 w-4" />
              1533-0513
            </a>
            <Button asChild>
              <Link href="#consultation">무료 상담</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden rounded-md p-2 text-muted-foreground hover:bg-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="메뉴 열기"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border py-4">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
              <a
                href="tel:1533-0513"
                className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground"
              >
                <Phone className="h-4 w-4" />
                1588-0000
              </a>
              <Button className="w-full" asChild>
                <Link href="#consultation" onClick={() => setIsMenuOpen(false)}>무료 상담</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
