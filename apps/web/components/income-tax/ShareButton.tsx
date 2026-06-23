'use client';

import { useMemo, useState } from 'react';

import { buildShareUrl, type CalcState } from '@/lib/share-url';

type ShareButtonProps = {
  state: CalcState;
  disabled?: boolean;
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20Zm4.3-5.8c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1s-.6.7-.7.8c-.1.1-.3.2-.5.1a6.6 6.6 0 0 1-3.2-2.8c-.1-.2 0-.3.1-.5l.4-.4c.1-.1.1-.2.2-.3s0-.2 0-.3c0-.1-.5-1.2-.7-1.7-.2-.4-.3-.4-.5-.4h-.4a.8.8 0 0 0-.6.3c-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3a9 9 0 0 0 3.5 3.1c.5.2 1 .4 1.3.5.5.2 1 .1 1.3.1.4-.1 1.3-.5 1.5-1 .2-.5.2-.9.1-1-.1-.1-.2-.1-.5-.2Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M18.9 3H21l-4.6 5.3L22 21h-4.4l-3.4-4.8L10 21H7.9l4.9-5.7L2 3h4.5l3.1 4.4L13.5 3h2.1l-4.2 4.9L18.9 3Zm-1.5 16h1.2L6.7 4.9H5.4L17.4 19Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M6.9 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM5 9.5h3.8V20H5V9.5Zm6.1 0h3.6v1.4h.1c.5-.9 1.8-1.8 3.7-1.8 4 0 4.7 2.6 4.7 6V20h-3.8v-4.3c0-1 0-2.4-1.5-2.4s-1.8 1.1-1.8 2.3V20h-3.8V9.5Z" />
    </svg>
  );
}

export function ShareButton({ state, disabled = false }: ShareButtonProps) {
  const [toast, setToast] = useState<'copied' | 'shared' | null>(null);
  const url = useMemo(() => buildShareUrl(state), [state]);

  const onShare = async () => {
    if (disabled) {
      return;
    }

    if (navigator.share) {
      await navigator.share({ title: 'Income Tax Calculation', url });
      setToast('shared');
    } else {
      await navigator.clipboard.writeText(url);
      setToast('copied');
    }

    window.setTimeout(() => setToast(null), 2000);
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent('Check my tax calculation: ');

  return (
    <div className="w-fit rounded-card border border-border bg-surface p-2">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onShare}
          disabled={disabled}
          aria-label="Share this calculation"
          className="inline-flex h-7 items-center gap-1 rounded-input border border-border bg-surface px-2 text-[11px] font-medium text-text hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span aria-hidden="true">🔗</span>
          <span>Share</span>
        </button>
        <a
          href={`https://wa.me/?text=${encodedText}${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share to WhatsApp"
          title="Share to WhatsApp"
          className="inline-flex h-7 w-7 items-center justify-center rounded-input border border-border text-text"
        >
          <WhatsAppIcon />
        </a>
        <a
          href={`https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share to X"
          title="Share to X"
          className="inline-flex h-7 w-7 items-center justify-center rounded-input border border-border text-text"
        >
          <XIcon />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share to LinkedIn"
          title="Share to LinkedIn"
          className="inline-flex h-7 w-7 items-center justify-center rounded-input border border-border text-text"
        >
          <LinkedInIcon />
        </a>
      </div>
      {toast ? (
        <p className="mt-1 text-[10px] leading-none text-accent">{toast === 'copied' ? 'Copied!' : 'Shared!'}</p>
      ) : null}
    </div>
  );
}
