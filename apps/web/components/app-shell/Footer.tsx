 'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { SocialLink } from '@/components/ui/SocialLink';
import { siteConfig } from '@/lib/site-config';

function IconX() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M18.9 3H21l-4.6 5.3L22 21h-4.4l-3.4-4.8L10 21H7.9l4.9-5.7L2 3h4.5l3.1 4.4L13.5 3h2.1l-4.2 4.9L18.9 3Zm-1.5 16h1.2L6.7 4.9H5.4L17.4 19Z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M6.9 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM5 9.5h3.8V20H5V9.5Zm6.1 0h3.6v1.4h.1c.5-.9 1.8-1.8 3.7-1.8 4 0 4.7 2.6 4.7 6V20h-3.8v-4.3c0-1 0-2.4-1.5-2.4s-1.8 1.1-1.8 2.3V20h-3.8V9.5Z" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20Zm4.3-5.8c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1s-.6.7-.7.8c-.1.1-.3.2-.5.1a6.6 6.6 0 0 1-3.2-2.8c-.1-.2 0-.3.1-.5l.4-.4c.1-.1.1-.2.2-.3s0-.2 0-.3c0-.1-.5-1.2-.7-1.7-.2-.4-.3-.4-.5-.4h-.4a.8.8 0 0 0-.6.3c-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3a9 9 0 0 0 3.5 3.1c.5.2 1 .4 1.3.5.5.2 1 .1 1.3.1.4-.1 1.3-.5 1.5-1 .2-.5.2-.9.1-1-.1-.1-.2-.1-.5-.2Z" />
    </svg>
  );
}

function socialIcon(platform: (typeof siteConfig.footer.socialLinks)[number]['platform']) {
  switch (platform) {
    case 'x':
      return <IconX />;
    case 'linkedin':
      return <IconLinkedIn />;
    case 'whatsapp':
      return <IconWhatsApp />;
    default:
      return null;
  }
}

export function Footer() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const syncTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="mt-10 border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-[1360px] gap-6 px-4 py-8 md:grid-cols-3">
        <div>
          <Image
            src={isDark ? siteConfig.brand.logoDark : siteConfig.brand.logo}
            alt="Tax logo"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
          <p className="mt-2 text-sm text-text-muted">Your money. Your rights. Know them.</p>
          <p className="mt-2 text-xs text-text-muted">© {new Date().getFullYear()} tax.hubs.dpdns.org</p>
        </div>

        <div className="space-y-2 text-sm">
          {siteConfig.navigation.footerLinks.map((link) => (
            <a key={link.href} className="block text-text hover:text-accent" href={link.href}>
              {link.label}
            </a>
          ))}
          {siteConfig.footer.referenceLinks.map((link) => (
            <a
              key={link.href}
              className="block text-text hover:text-accent"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {siteConfig.footer.socialLinks.map((link) => (
            <SocialLink key={link.platform} href={link.href} label={link.label} icon={socialIcon(link.platform)} />
          ))}
        </div>
      </div>
      <div className="border-t border-border bg-surface-muted px-4 py-3 text-center text-xs text-text-muted">
        Data sourced from official tax authorities and applicable tax laws. Updated annually. Not financial advice.
        <br />
        Copyright © {new Date().getFullYear()} tax.hubs.dpdns.org. All rights reserved. No scraping,
        AI/ML training, bulk extraction, or reuse of code/content without prior written permission. See{' '}
        <a className="text-accent hover:text-accent-hover" href="/terms">
          Terms
        </a>{' '}
        and{' '}
        <a className="text-accent hover:text-accent-hover" href="/copyright">
          Copyright Policy
        </a>
        .
      </div>
    </footer>
  );
}
