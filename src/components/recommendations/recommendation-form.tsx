"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { createRecommendation } from "@/app/actions/recommendations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emptyForm = {
  brand: "",
  flavor: "",
  countryOfOrigin: "",
};

export function RecommendationForm() {
  const [form, setForm] = useState(emptyForm);
  const [pending, startTransition] = useTransition();

  function updateField(key: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createRecommendation(form);
        toast.success("Recommendation logged");
        setForm(emptyForm);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to log recommendation");
      }
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <CardHeader>
          <CardTitle>Give a recommendation</CardTitle>
          <p className="text-sm text-zinc-500">
            Add a nacho, chip, or crisp that belongs in the lab queue.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={form.brand}
                onChange={(e) => updateField("brand", e.target.value)}
                placeholder="Cornitos"
                required
                maxLength={80}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flavor">Flavour</Label>
              <Input
                id="flavor"
                value={form.flavor}
                onChange={(e) => updateField("flavor", e.target.value)}
                placeholder="Sweet Chili"
                required
                maxLength={120}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="countryOfOrigin">Country of Origin</Label>
              <Input
                id="countryOfOrigin"
                value={form.countryOfOrigin}
                onChange={(e) => updateField("countryOfOrigin", e.target.value)}
                placeholder="India"
                required
                maxLength={80}
              />
            </div>
            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send recommendation
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-orange-500/20 bg-black/35">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <Image
          src="/placeholder-snack.svg"
          alt="Placeholder snack packet"
          fill
          className="object-contain p-10"
          sizes="360px"
          priority
        />
      </div>
    </div>
  );
}
