"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Lightbulb, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { NachoIcon } from "@/components/ui/nacho-icon";

const links = [
  { href: "/", label: "Leaderboard", icon: Trophy },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/recommendations", label: "Recommendations", icon: Lightbulb },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 via-amber-400 to-red-500 shadow-lg shadow-orange-500/30 group-hover:scale-105 transition">
            <NachoIcon className="h-5.5 w-5.5 text-black fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-[0.2em] text-orange-400/80">Divjot's</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold text-emerald-400 uppercase tracking-widest border border-emerald-500/15">
                <span className="status-dot status-dot-green" /> ONLINE
              </span>
            </div>
            <h1 className="text-lg font-bold text-zinc-50">Nacho Index</h1>
          </div>
        </Link>
        <nav className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-200"
                    : "text-zinc-400 hover:text-zinc-100",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
