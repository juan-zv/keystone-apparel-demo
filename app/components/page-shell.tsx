import type { ReactNode } from "react"
import { NavHeader } from "@/components/nav-header"

interface PageShellProps {
  title: string
  description?: string
  badge?: string
  children: ReactNode
}

export function PageShell({ title, description, badge, children }: PageShellProps) {
  return (
    <>
      <NavHeader />
      <main className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background via-background to-muted/20">
        {/* Subtle background glow effect */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-amber-500/5 via-indigo-500/5 to-transparent blur-3xl opacity-75" />

        <div className="relative container mx-auto max-w-6xl px-4 py-6 sm:py-8">
          <header className="mb-8 text-center">
            {badge && (
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                {badge}
              </span>
            )}
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              {title}
            </h1>
            {description && (
              <p className="mx-auto mt-2.5 max-w-2xl text-sm text-muted-foreground sm:text-base font-normal">
                {description}
              </p>
            )}
          </header>
          {children}
          <footer className="mt-12 flex flex-col items-center gap-1 border-t border-border/50 pt-8 text-sm text-muted-foreground">
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.juanzurita.dev"
              className="font-semibold text-foreground/80 transition-colors hover:text-primary"
            >
              Juansito
            </a>
            <span className="text-xs text-muted-foreground/70">v0.2.1 · Keystone Apparel System</span>
          </footer>
        </div>
      </main>
    </>
  )
}
