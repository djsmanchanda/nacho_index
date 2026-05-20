"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortOption = "score-desc" | "score-asc" | "newest" | "brand";
export type FilterBrand = string | "all";

type Props = {
  brands: string[];
  sort: SortOption;
  brandFilter: FilterBrand;
  onSortChange: (v: SortOption) => void;
  onBrandChange: (v: FilterBrand) => void;
};

export function LeaderboardFilters({
  brands,
  sort,
  brandFilter,
  onSortChange,
  onBrandChange,
}: Props) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-zinc-50">Rankings</h2>
        <p className="text-sm text-zinc-500">Sorted by weighted snack science</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Select value={brandFilter} onValueChange={onBrandChange}>
          <SelectTrigger className="w-[160px]" aria-label="Filter rankings by brand">
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All brands</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="w-[180px]" aria-label="Sort rankings">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="score-desc">Score: high → low</SelectItem>
            <SelectItem value="score-asc">Score: low → high</SelectItem>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="brand">Brand A–Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
