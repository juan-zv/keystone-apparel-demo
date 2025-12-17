import { Link } from "react-router"
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

export function NavHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4">
                {/* Desktop Navigation */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <img width="40" height="40" src="./favicon.svg" alt="Keystone Apparel Logo" />
                        <span className="hidden font-bold sm:inline-block">
                            Keystone Apparel
                        </span>
                    </div>
                    
                    <nav className="hidden md:flex items-center gap-4">
                        <Button asChild variant="ghost">
                            <Link to="/">Record Sales</Link>
                        </Button>
                        <Button asChild variant="ghost">
                            <Link to="/sales-report">Sales Report</Link>
                        </Button>
                        <Button asChild variant="ghost">
                            <Link to="/presales">Presales</Link>
                        </Button>
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <ModeToggle />
                    
                    {/* Mobile Navigation */}
                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 mt-6">
                                <Button asChild variant="ghost" className="justify-start text-lg">
                                    <Link to="/">Record Sales</Link>
                                </Button>
                                <Separator />
                                <Button asChild variant="ghost" className="justify-start text-lg">
                                    <Link to="/sales-report">Sales Report</Link>
                                </Button>
                                <Separator />
                                <Button asChild variant="ghost" className="justify-start text-lg">
                                    <Link to="/presales">Presales</Link>
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
