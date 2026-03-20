export function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">{eyebrow}</p>
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}
