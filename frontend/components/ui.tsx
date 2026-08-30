import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ExternalLink, Check } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 max-w-2xl">
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h2>{title}</h2>
      {subtitle && <p className="mt-3 text-[var(--text-muted)]">{subtitle}</p>}
    </div>
  );
}

export function CardLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="card card-hover block p-6">
      {children}
    </Link>
  );
}

export function SourceList({
  sources,
}: {
  sources: { title: string; url: string }[];
}) {
  if (!sources || sources.length === 0) return null;
  return (
    <div className="mt-6 rounded-[var(--radius-md)] bg-[var(--surface-muted)] p-4">
      <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--text-soft)]">
        Sumber terpercaya/terakreditasi
      </p>
      <ul className="space-y-1.5">
        {sources.map((s, i) => (
          <li key={i}>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm text-[var(--accent-hover)] hover:underline"
            >
              {s.title}
              <ExternalLink size={12} className="opacity-60" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PointsList({
  items,
  title = "Poin penting",
}: {
  items: string[];
  title?: string;
}) {
  return (
    <div className="mt-6">
      <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--text-soft)]">
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((p, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-hover)]">
              <Check size={12} aria-hidden />
            </span>
            <span className="text-[var(--text)]">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CtaButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="btn btn-primary">
      {children}
      <ArrowRight size={16} aria-hidden />
    </Link>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent-hover)]"
    >
      <ArrowRight size={15} className="rotate-180" aria-hidden />
      {label}
    </Link>
  );
}
