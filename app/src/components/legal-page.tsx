import { PublicShell } from "@/components/public-shell";

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <PublicShell>
      <article className="page-shell max-w-3xl py-10 sm:py-16">
        <h1 className="text-4xl font-semibold text-[var(--primary-strong)] sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">{intro}</p>
        <div className="mt-10 space-y-8 leading-7 text-[var(--muted)] [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[var(--foreground)] [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">{children}</div>
      </article>
    </PublicShell>
  );
}
