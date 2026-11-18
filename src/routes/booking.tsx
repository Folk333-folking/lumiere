import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Site } from "@/components/site";
import { useSalon } from "@/lib/salon/store";
import {
  MASTERS,
  PROMOS,
  SERVICES,
  computeSlots,
  dur,
  mastersFor,
  money,
  promoDiscount,
  serviceById,
  upcomingDays,
  formatDate,
  type Slot,
} from "@/lib/salon/engine";

type Search = { service?: string; master?: string };

export const Route = createFileRoute("/booking")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    service: typeof search.service === "string" ? search.service : undefined,
    master: typeof search.master === "string" ? search.master : undefined,
  }),
  head: () => ({ meta: [{ title: "Запись — LUMIÈRE" }] }),
  component: BookingPage,
});

const STEPS = ["Услуга", "Мастер", "Дата", "Время", "Контакты"];

function BookingPage() {
  const salon = useSalon();
  const search = Route.useSearch();
  return (
    <Site>
      <main className="page narrow">
        <p className="kicker">Онлайн</p>
        <h1>Запись</h1>
        {!salon.ready ? (
          <p className="muted">Открываем свободные окна…</p>
        ) : (
          <Wizard service={search.service} master={search.master} />
        )}
      </main>
    </Site>
  );
}

function Wizard({ service, master }: Search) {
  const salon = useSalon();
  const navigate = useNavigate();
  const preset = serviceById(service ?? "");
  const presetMaster = MASTERS.some((m) => m.id === master) ? master! : "any";
  const [step, setStep] = useState(preset ? 2 : 1);
  const [serviceId, setServiceId] = useState(preset?.id ?? "");
  const [masterId, setMasterId] = useState(() => {
    if (preset && presetMaster !== "any" && mastersFor(preset.id).some((m) => m.id === presetMaster)) return presetMaster;
    return presetMaster;
  });
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [promo, setPromo] = useState("");
  const [cert, setCert] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const svc = serviceById(serviceId);
  const days = useMemo(
    () =>
      svc
        ? upcomingDays({ serviceId: svc.id, masterId, appointments: salon.data.appointments })
        : [],
    [svc, masterId, salon.data.appointments],
  );
  const slots = useMemo(
    () =>
      svc && date
        ? computeSlots({ serviceId: svc.id, masterId, date, appointments: salon.data.appointments })
        : [],
    [svc, masterId, date, salon.data.appointments],
  );

  const quote = useMemo(() => {
    if (!slot) return null;
    const p = promoDiscount(promo, slot.price, date);
    const discount = p.error ? 0 : p.discount;
    const found = cert.trim()
      ? salon.data.certs.find((c) => c.code.toUpperCase() === cert.trim().toUpperCase())
      : undefined;
    const certUsed =
      found && found.status === "active" ? Math.min(found.balance, Math.max(0, slot.price - discount)) : 0;
    return { discount, certUsed, due: Math.max(0, slot.price - discount - certUsed), promoError: p.error, promoTitle: p.title };
  }, [slot, promo, date, cert, salon.data.certs]);

  function back() {
    setError("");
    setStep((s) => Math.max(1, s - 1));
  }

  return (
    <div>
      <div className="steps">
        {STEPS.map((label, i) => (
          <span key={label} className={i + 1 === step ? "on" : ""}>
            {i + 1}. {label}
          </span>
        ))}
      </div>
      {error ? <p className="flash bad">{error}</p> : null}

      {step === 1 ? (
        <div className="choice">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={serviceId === s.id ? "on" : ""}
              onClick={() => {
                setServiceId(s.id);
                setMasterId((cur) => (cur !== "any" && mastersFor(s.id).some((m) => m.id === cur) ? cur : "any"));
                setDate("");
                setSlot(null);
                setError("");
                setStep(2);
              }}
            >
              <strong>{s.name}</strong>
              <br />
              {money(s.price)} · {dur(s.duration)}
            </button>
          ))}
        </div>
      ) : null}

      {step === 2 && svc ? (
        <>
          <div className="choice">
            <button
              type="button"
              className={masterId === "any" ? "on" : ""}
              onClick={() => {
                setMasterId("any");
                setDate("");
                setSlot(null);
                setStep(3);
              }}
            >
              Любой свободный мастер
            </button>
            {mastersFor(svc.id).map((m) => (
              <button
                key={m.id}
                type="button"
                className={masterId === m.id ? "on" : ""}
                onClick={() => {
                  setMasterId(m.id);
                  setDate("");
                  setSlot(null);
                  setStep(3);
                }}
              >
                {m.name}
                <br />
                <span className="fine">{m.specialization}</span>
              </button>
            ))}
          </div>
          <p>
            <button type="button" className="textlink" onClick={back}>
              Назад
            </button>
          </p>
        </>
      ) : null}

      {step === 3 ? (
        <>
          <div className="days">
            {days.map((d) => (
              <button
                key={d.date}
                type="button"
                disabled={!d.count}
                className={date === d.date ? "on" : ""}
                onClick={() => {
                  setDate(d.date);
                  setSlot(null);
                  setStep(4);
                }}
              >
                {d.weekday} {d.day}
                <br />
                <span className="fine">{d.count ? `${d.count} окон` : "нет"}</span>
              </button>
            ))}
          </div>
          <p>
            <button type="button" className="textlink" onClick={back}>
              Назад
            </button>
          </p>
        </>
      ) : null}

      {step === 4 ? (
        <>
          <div className="slots">
            {slots.length === 0 ? <p>В этот день свободных окон нет.</p> : null}
            {slots.map((s) => (
              <button
                key={`${s.masterId}-${s.time}`}
                type="button"
                className={slot?.time === s.time && slot.masterId === s.masterId ? "on" : ""}
                onClick={() => {
                  setSlot(s);
                  setStep(5);
                }}
              >
                {s.time}
                <br />
                <span className="fine">{s.masterName.split(" ")[0]}</span>
              </button>
            ))}
          </div>
          <p>
            <button type="button" className="textlink" onClick={back}>
              Назад
            </button>
          </p>
        </>
      ) : null}

      {step === 5 && svc && slot && quote ? (
        <form
          className="stack"
          onSubmit={(e) => {
            e.preventDefault();
            setPending(true);
            setError("");
            const res = salon.book({
              serviceId: svc.id,
              masterId: slot.masterId,
              date,
              time: slot.time,
              name,
              phone,
              email,
              comment,
              promo,
              certificate: cert,
            });
            setPending(false);
            if (!res.ok) {
              setError(res.error);
              return;
            }
            void navigate({ to: "/visit/$token", params: { token: res.token }, search: { fresh: true } });
          }}
        >
          <label>
            Имя
            <input required value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Телефон
            <input required placeholder="+7 900 000-00-00" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label>
            Почта, если хотите письмо
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Комментарий
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
          </label>
          <label>
            Промокод
            <input value={promo} placeholder={PROMOS[0]?.code} onChange={(e) => setPromo(e.target.value)} />
          </label>
          <label>
            Сертификат
            <input value={cert} placeholder="GIFT-4401" onChange={(e) => setCert(e.target.value)} />
          </label>
          {quote.promoError && promo.trim() ? <p className="fine">{quote.promoError}</p> : null}
          <div className="summary">
            <p>
              {svc.name} · {slot.masterName}
            </p>
            <p>
              {formatDate(date)} {slot.time}–{slot.end}
            </p>
            <p>
              К оплате <strong>{money(quote.due)}</strong>
              {quote.discount ? ` · скидка ${money(quote.discount)}` : ""}
              {quote.certUsed ? ` · сертификат ${money(quote.certUsed)}` : ""}
            </p>
          </div>
          <button className="btn" type="submit" disabled={pending}>
            Подтвердить запись
          </button>
          <button type="button" className="textlink" onClick={back}>
            Назад
          </button>
        </form>
      ) : null}
    </div>
  );
}
