'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Profile } from '../ProfileEditor'

interface Stats {
  answersCount: number
  questionsCount: number
  budgetCount: number
  teamCount: number
}

export default function OnboardHomePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/onboard/me', { credentials: 'include' })
        if (res.status === 401) {
          window.location.href = '/onboard/login'
          return
        }
        const data = await res.json()
        if (!res.ok) {
          if (!cancelled) setError(data.error ?? 'Failed to load your account.')
          return
        }
        if (!cancelled) {
          setProfile(data.profile)
          setStats(data.stats)
        }
      } catch {
        if (!cancelled) setError('Failed to load your account.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
          Loading your workspace…
        </div>
      </div>
    )
  }

  if (error || !profile || !stats) {
    return (
      <div className="w-full max-w-5xl">
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm">
          {error || 'Something went wrong.'}
        </div>
      </div>
    )
  }

  const questionnaireTone: StatusTone = profile.completed
    ? 'done'
    : stats.answersCount > 0
      ? 'progress'
      : 'idle'
  const budgetTone: StatusTone = stats.budgetCount > 0 ? 'progress' : 'idle'
  const teamTone: StatusTone = stats.teamCount > 0 ? 'progress' : 'idle'
  const isReturning =
    profile.completed || stats.answersCount > 0 || stats.budgetCount > 0 || stats.teamCount > 0

  return (
    <div className="w-full max-w-6xl space-y-14">
      <div>
        <h1 className="text-3xl font-bold text-navy-900 tracking-tight">
          {isReturning ? `Welcome back, ${profile.first_name}` : `Welcome, ${profile.first_name}`}
        </h1>
        <div className="mt-6 space-y-4 text-slate-500 text-sm leading-7 max-w-4xl">
          <p>
            This onboarding is how we start the engagement on solid ground. Fractional CTO work
            only helps if it is aimed at how your company actually operates — the systems people
            depend on, the constraints you already live with, and the outcomes leadership cares about.
          </p>
          <p>
            We are not collecting this for a file. We use it to decide how to structure the path:
            what to look at first, what can wait, where risk concentrates, and how we should work
            with your team. Incomplete answers slow that down and force us to guess.
          </p>
          <p>
            Please complete each section as thoroughly as you can. You can save as you go and
            return at any time.
          </p>
        </div>
      </div>

      <section>
        <h2 className="text-base font-semibold text-navy-800 mb-6">Onboarding sections</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <SectionCard
            href="/onboard/questionnaire"
            title="Questionnaire"
            description="This is the main briefing. It covers strategy, systems, operations, and constraints — how the company actually runs, where complexity lives, and what leadership needs from technology. We use it to shape the plan, not as a formality."
            status={profile.completed ? 'Submitted' : stats.answersCount > 0 ? 'In progress' : 'Not started'}
            tone={questionnaireTone}
            cta={profile.completed ? 'View' : stats.answersCount > 0 ? 'Continue' : 'Start'}
            icon="clipboard"
          />
          <SectionCard
            href="/onboard/budget-audit"
            title="Budget Audit"
            description="List software, SaaS, vendors, and other recurring tech spend. We use this to find overlap, unused tools, and contract or cost issues that should influence what we keep, replace, or leave for later."
            status={stats.budgetCount > 0 ? `${stats.budgetCount} expense${stats.budgetCount === 1 ? '' : 's'}` : 'Not started'}
            tone={budgetTone}
            cta={stats.budgetCount > 0 ? 'Continue' : 'Start'}
            icon="chart"
          />
          <SectionCard
            href="/onboard/team"
            title="Team"
            description="Who does the work, how they are organized, and where skills sit. An org chart and skills matrix help us see coverage gaps and how we should work with your people — not around them."
            status={stats.teamCount > 0 ? `${stats.teamCount} team member${stats.teamCount === 1 ? '' : 's'}` : 'Not started'}
            tone={teamTone}
            cta={stats.teamCount > 0 ? 'Continue' : 'Start'}
            icon="people"
          />
        </div>
      </section>

      <p className="text-slate-400 text-sm leading-relaxed pt-4">
        Questions? If anything is unclear, or you would rather talk something through than type it,
        reach out to{' '}
        <a
          href="mailto:onboarding@techonpartners.com"
          className="text-blue-600 font-medium hover:text-blue-700"
        >
          onboarding@techonpartners.com
        </a>
        .
      </p>
    </div>
  )
}

type StatusTone = 'idle' | 'progress' | 'done'
type CardIcon = 'clipboard' | 'chart' | 'people'

const TONE_BADGE: Record<StatusTone, string> = {
  idle: 'bg-slate-100 text-slate-600',
  progress: 'bg-blue-50 text-blue-700',
  done: 'bg-emerald-50 text-emerald-700',
}

function CardIconGlyph({ name }: { name: CardIcon }) {
  if (name === 'clipboard') {
    return (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <rect x="5" y="4" width="10" height="13" rx="2" />
        <path d="M8 4V3.5A1.5 1.5 0 019.5 2h1A1.5 1.5 0 0112 3.5V4M7.5 9h5M7.5 12h3" strokeLinecap="round" />
      </svg>
    )
  }
  if (name === 'chart') {
    return (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M4 15V5M4 15h12" strokeLinecap="round" />
        <path d="M7 12v-3M10 12V7M13 12V8" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="7" cy="7" r="2.2" />
      <circle cx="13.5" cy="7.5" r="1.8" />
      <path d="M3.5 15c.5-2.2 2-3.4 4.2-3.4 1.4 0 2.6.5 3.4 1.3M12 11.8c1.8 0 3.1 1 3.6 2.7" strokeLinecap="round" />
    </svg>
  )
}

function SectionCard({
  href,
  title,
  description,
  status,
  tone,
  cta,
  icon,
}: {
  href: string
  title: string
  description: string
  status: string
  tone: StatusTone
  cta: string
  icon: CardIcon
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200 p-7 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <CardIconGlyph name={icon} />
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${TONE_BADGE[tone]}`}>
          {status}
        </span>
      </div>
      <h3 className="font-semibold text-navy-800 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mt-2 flex-1">{description}</p>
      <span className="mt-6 text-sm font-medium text-blue-600">
        {cta} →
      </span>
    </Link>
  )
}
