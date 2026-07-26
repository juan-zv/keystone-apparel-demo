import * as React from "react"
import { Link, NavLink } from "react-router"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/", label: "Record Sales", end: true },
  { to: "/sales-report", label: "Sales Report", end: false },
  { to: "/presales", label: "Presales", end: false },
] as const

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    "relative rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all duration-200",
    isActive
      ? "bg-primary text-primary-foreground shadow-xs"
      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
  )
}

export function NavHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-xs transition-transform group-hover:scale-105">
              <img width="32" height="32" src="./favicon.svg" alt="Keystone Apparel" className="h-full w-full rounded-[6px] object-cover bg-background" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-foreground leading-none">Keystone Apparel</span>
              <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase leading-tight">Sales System</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/40">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <img width="24" height="24" src="./favicon.svg" alt="Logo" />
                  Keystone Apparel
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {navItems.map((item, index) => (
                  <React.Fragment key={item.to}>
                    {index > 0 && <Separator className="my-1" />}
                    <NavLink to={item.to} end={item.end} className={navLinkClass}>
                      {item.label}
                    </NavLink>
                  </React.Fragment>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
