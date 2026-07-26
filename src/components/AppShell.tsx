import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Bell,
  Calendar,
  Image as ImageIcon,
  Mic2,
  Building2,
  Home,
  MessageSquare,
  Menu,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { CONFERENCE } from "@/data/conference";
import kabarakLogo from "@/public/images/Kabarak_University_Logo.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type NavItem = {
  to: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
};

const NAV: NavItem[] = [
  { to: "/", label: "Home", shortLabel: "Home", icon: Home },
  { to: "/schedule", label: "Schedule", shortLabel: "Schedule", icon: Calendar },
  { to: "/speakers", label: "Speakers", shortLabel: "Speakers", icon: Mic2 },
  { to: "/gallery", label: "Gallery", shortLabel: "Gallery", icon: ImageIcon },
  { to: "/partners", label: "Partners", shortLabel: "Partners", icon: Building2 },
  { to: "/announcements", label: "News", shortLabel: "News", icon: Bell },
  { to: "/feedback", label: "Feedback", shortLabel: "Feedback", icon: MessageSquare },
];

const MOBILE_TAB_PATHS = ["/", "/schedule", "/speakers", "/gallery"] as const;

export function isConfiguredExternalUrl(url: string): boolean {
  return Boolean(url && !/your-[\w-]*-id/i.test(url));
}

export function AppShell({ children }: { children?: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="mx-auto flex max-w-6xl gap-8 px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-6 md:px-6 lg:pb-10 lg:pt-10">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1">
            {NAV.map((n) => (
              <NavLink key={n.to} item={n} active={pathname === n.to} showFullLabel />
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children ?? <Outlet />}</main>
      </div>
      <MobileTabBar pathname={pathname} />
      <footer className="mx-auto max-w-6xl px-6 pb-28 pt-6 text-center text-xs text-muted-foreground lg:pb-10">
        © {new Date().getFullYear()} Confera
      </footer>
    </div>
  );
}

function NavLink({
  item,
  active,
  showFullLabel,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  showFullLabel?: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-foreground/75 hover:bg-accent hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{showFullLabel ? item.label : item.shortLabel}</span>
    </Link>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="ribbon h-1 w-full" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link to="/" className="group flex min-w-0 items-center gap-3">
          <img
            src={kabarakLogo}
            alt="Kabarak University"
            width={56}
            height={56}
            className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14"
          />
          <div className="min-w-0 leading-tight">
            <div className="font-display text-base text-foreground sm:text-lg">{CONFERENCE.shortName}</div>
            <div className="truncate text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Kabarak · {CONFERENCE.dates}
            </div>
          </div>
        </Link>
        <Link
          to="/announcements"
          className="relative inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground/80 hover:border-primary/40 hover:text-foreground"
        >
          <Bell className="h-3.5 w-3.5 text-primary" />
          <span className="hidden sm:inline">Live updates</span>
          <span className="ml-0.5 inline-flex h-1.5 w-1.5 rounded-full bg-destructive" />
        </Link>
      </div>
    </header>
  );
}

function MobileTabBar({ pathname }: { pathname: string }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const primaryTabs = MOBILE_TAB_PATHS.map((path) => NAV.find((n) => n.to === path)!);
  const moreTabs = NAV.filter((n) => !(MOBILE_TAB_PATHS as readonly string[]).includes(n.to));
  const moreActive = moreTabs.some((n) => n.to === pathname);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-5 px-1">
          {primaryTabs.map((n) => {
            const Icon = n.icon;
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex flex-col items-center gap-0.5 px-1 py-2.5 text-[10px] leading-tight ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${active ? "stroke-[2.2]" : ""}`} />
                <span className="max-w-full truncate text-center">{n.shortLabel}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center gap-0.5 px-1 py-2.5 text-[10px] leading-tight ${
              moreActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Menu className={`h-5 w-5 shrink-0 ${moreActive ? "stroke-[2.2]" : ""}`} />
            <span>More</span>
          </button>
        </div>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-[env(safe-area-inset-bottom)]">
          <SheetHeader className="text-left">
            <SheetTitle className="font-display">All sections</SheetTitle>
          </SheetHeader>
          <nav className="mt-4 grid gap-1">
            {moreTabs.map((n) => (
              <NavLink
                key={n.to}
                item={n}
                active={pathname === n.to}
                showFullLabel
                onNavigate={() => setMoreOpen(false)}
              />
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-primary">{eyebrow}</div>
      )}
      <h1 className="font-display text-3xl text-foreground sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{subtitle}</p>}
      <div className="gold-rule mt-5 h-px" />
    </div>
  );
}
