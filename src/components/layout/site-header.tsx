"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Lightbulb, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Leaderboard", icon: Trophy },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/recommendations", label: "Recommendations", icon: Lightbulb },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-amber-300/5 bg-[#050505]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] bg-[#111315] shadow-[0_0_22px_rgba(245,158,11,0.24),0_10px_28px_rgba(0,0,0,0.45)] ring-1 ring-amber-200/10 transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.34),0_12px_32px_rgba(0,0,0,0.55)]">
            <Image
              src="/logo.png"
              alt="Nacho Index logo"
              fill
              className="object-contain"
              sizes="56px"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-400/85">Divjot&apos;s</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold text-emerald-400 uppercase tracking-widest border border-emerald-500/15">
                <span className="status-dot status-dot-green" /> ONLINE
              </span>
            </div>
            <h1 className="text-lg font-bold text-zinc-50">Nacho Index</h1>
          </div>
        </Link>
        <nav className="flex items-center gap-1 rounded-2xl border border-amber-200/10 bg-[#101113]/80 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
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
                    ? "bg-amber-400/10 text-amber-100 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.18),0_0_18px_rgba(245,158,11,0.12)]"
                    : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-100",
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
