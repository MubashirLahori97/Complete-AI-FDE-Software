import type { ReactNode } from 'react';
import { ArrowUpRight, Check, ArrowRight } from 'lucide-react';

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
export function SectionHeading({
  title,
  subtitle,
  href,
  link,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  link?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {href && (
        <a className="text-link" href={href}>
          {link}
          <ArrowRight size={16} />
        </a>
      )}
    </div>
  );
}
export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="text-link" href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ArrowUpRight size={15} />
    </a>
  );
}
export function Checkbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="check-row">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="custom-check" aria-hidden="true">
        {checked && <Check size={13} />}
      </span>
      <span>{children}</span>
    </label>
  );
}
export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
    >
      <div style={{ width: `${value}%` }} />
    </div>
  );
}
