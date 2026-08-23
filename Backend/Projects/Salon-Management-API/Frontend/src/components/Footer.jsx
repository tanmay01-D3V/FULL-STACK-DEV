import { Link } from "react-router-dom";

/* ── Swap these with your real handles ─────────────────────────── */
const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/glowandgrace",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]" aria-hidden="true">
        <rect x="2.8" y="2.8" width="18.4" height="18.4" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.3" cy="6.7" r="1.15" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/glowandgrace",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true">
        <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.87.24-1.46 1.49-1.46h1.4V5a20 20 0 0 0-2.05-.1c-2.03 0-3.42 1.24-3.42 3.51V11H8.5v3h2.42v7h2.58Z" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/glowandgrace",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3L17.61 20.65Z" />
      </svg>
    ),
  },
];

/* ── Your dev profiles ─────────────────────────────────────────── */
const DEV = {
  name: "Tanmay Vijay Sherkar",
  role: "Full-Stack Developer",
  avatarInitials: "TV",
  links: [
    {
      label: "GitHub",
      href: "https://github.com/tanmay01-D3V",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.1 11.1 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/tanmay-sherkar-185986266/",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true">
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
        </svg>
      ),
    },
  ],
};

function SocialButton({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-800 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-brand-600 hover:bg-brand-700 hover:text-white"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-100 bg-gradient-to-b from-white to-brand-50/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-plum-700 text-white shadow-card"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 2c1.1 3 2.9 4.8 5.9 5.9C14.9 9 13.1 10.8 12 13.8 10.9 10.8 9.1 9 6.1 7.9 9.1 6.8 10.9 5 12 2z" />
                <circle cx="18" cy="17.5" r="3.5" />
              </svg>
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-stone-900">
              Glow &amp; Grace
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-500">
            Signature treatments, effortless booking and a calmer way to run
            your salon — all in one place.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {SOCIALS.map((s) => (
              <SocialButton key={s.label} href={s.href} label={s.label}>
                {s.icon}
              </SocialButton>
            ))}
          </div>
        </div>

        {/* Explore */}
        <nav aria-label="Footer">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-600">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["Home", "/"],
              ["Services", "/services"],
              ["Login", "/login"],
              ["Register", "/register"],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="text-stone-500 transition hover:text-brand-700">
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="http://localhost:3000/"
                target="_blank"
                rel="noreferrer"
                className="text-stone-500 transition hover:text-brand-700"
              >
                API health
              </a>
            </li>
          </ul>
        </nav>

        {/* Dev credit */}
        <div className="card p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-600">Crafted by</h3>
          <div className="mt-4 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-plum-700 font-display text-sm font-semibold text-white"
            >
              {DEV.avatarInitials}
            </span>
            <div>
              <p className="font-display text-base font-semibold text-stone-900">{DEV.name}</p>
              <p className="text-xs font-medium text-stone-500">{DEV.role}</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-stone-500">
            Designed &amp; developed the full salon platform — Express + Supabase
            API and this React frontend.
          </p>
          <div className="mt-4 flex items-center gap-3">
            {DEV.links.map((l) => (
              <SocialButton key={l.label} href={l.href} label={l.label}>
                {l.icon}
              </SocialButton>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-100/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-center sm:flex-row sm:px-6 sm:text-left">
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} Glow &amp; Grace. All rights reserved.
          </p>
          <p className="text-xs text-stone-400">
            Designed &amp; built by{" "}
            <a
              href={DEV.links.find((l) => l.label === "LinkedIn")?.href ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-brand-700 transition hover:text-brand-900"
            >
              {DEV.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
