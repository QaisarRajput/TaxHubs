type SocialLinkProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export function SocialLink({ href, label, icon }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-border bg-surface px-3 text-text transition hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
    >
      <span className="sr-only">{label}</span>
      {icon}
    </a>
  );
}
