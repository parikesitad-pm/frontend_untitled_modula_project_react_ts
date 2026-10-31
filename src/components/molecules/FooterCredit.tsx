import React from 'react';

const linkClass =
  'font-semibold text-accent-text underline decoration-accent-deep underline-offset-2 transition-colors hover:text-ink hover:decoration-accent';

const ExternalLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
    {children}
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

export const FooterCredit: React.FC = () => (
  <span className="inline-flex flex-wrap items-center justify-center gap-1.5">
    <span>Crafted with &lt;3 by</span>
    <ExternalLink href="https://d-ap.my.id">dap_</ExternalLink>
    <span aria-hidden="true">·</span>
    <ExternalLink href="https://github.com/parikesitad-pm">a MODULA Project</ExternalLink>
  </span>
);
