import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { STUDIO } from "@/lib/salon/engine";

const LINKS = [
  { to: "/services", label: "Услуги" },
  { to: "/masters", label: "Мастера" },
  { to: "/gallery", label: "Работы" },
  { to: "/certificates", label: "Сертификаты" },
] as const;

export function Site({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className="top">
        <div className="bar">
          <span>{STUDIO.address}</span>
          <span>{STUDIO.hours}</span>
          <a href={`tel:${STUDIO.phoneTel}`}>{STUDIO.phone}</a>
        </div>
        <div className={open ? "nav open" : "nav"}>
          <Link to="/" className="word">
            {STUDIO.name}
          </Link>
          <nav id="sitenav">
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to} data-active={pathname === l.to ? "true" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
          <Link to="/booking" className="btn">
            Записаться
          </Link>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            Меню
          </button>
        </div>
      </header>
      {children}
      <footer className="foot">
        <div>
          <p className="word">{STUDIO.name}</p>
          <p className="muted">{STUDIO.tagline}</p>
        </div>
        <div>
          <p>
            <a href={`https://yandex.ru/maps/?text=${encodeURIComponent(STUDIO.address)}`}>{STUDIO.address}</a>
          </p>
          <p>{STUDIO.hours}</p>
          <p>
            <a href={`tel:${STUDIO.phoneTel}`}>{STUDIO.phone}</a>
          </p>
          <p>
            <a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a>
          </p>
        </div>
        <div>
          <a href={STUDIO.instagram}>Instagram</a>
          <a href={STUDIO.telegram}>Telegram</a>
          <a href={STUDIO.whatsapp}>WhatsApp</a>
          <Link to="/admin">Кабинет</Link>
        </div>
        <p className="fine">© 2026 {STUDIO.name}</p>
      </footer>
    </>
  );
}

export function Heart({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z"
        fill={on ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
