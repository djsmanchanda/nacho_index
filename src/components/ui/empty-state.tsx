import Link from "next/link";
import { Button } from "./button";
import { NachoIcon } from "./nacho-icon";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-16 text-center">
      <NachoIcon size={48} className="mb-4 text-amber-500/60 fill-amber-500/10" />
      <h3 className="text-lg font-semibold text-zinc-200">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-zinc-500">{description}</p>
      {actionHref && actionLabel && (
        <Button asChild className="mt-6">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
