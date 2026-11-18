import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { ClientGate, useSalon } from "@/lib/salon/store";
import {
  STATUS_LABEL,
  STUDIO,
  dueOf,
  formatDate,
  masterById,
  money,
  mskToday,
  serviceById,
  shift,
  weekday,
  weekdayShort,
  type Appt,
  type Status,
} from "@/lib/salon/engine";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Кабинет — LUMIÈRE" }] }),
  component: AdminPage,
});

const TABS = ["Сегодня", "Записи", "Календарь", "Гости", "Сертификаты"] as const;
type Tab = (typeof TABS)[number];

function AdminPage() {
  return (
    <ClientGate
      fallback={
        <main className="login-body">
          <p className="kicker">Кабинет</p>
        </main>
      }
    >
      <AdminInner />
    </ClientGate>
  );
}

function AdminInner() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("lumiere-admin") === "1");
  if (!authed) {
    return (
      <Login
        onOk={() => {
          sessionStorage.setItem("lumiere-admin", "1");
          setAuthed(true);
        }}
      />
    );
  }
  return <Desk onLeave={() => { sessionStorage.removeItem("lumiere-admin"); setAuthed(false); }} />;
}

function Login({ onOk }: { onOk: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  return (
    <main className="login-body">
      <form
        className="login stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (password.trim().toLowerCase() !== "lumiere") {
            setError("Неверный пароль");
            return;
          }
          onOk();
        }}
      >
        <p className="word">{STUDIO.name}</p>
        <h1>Кабинет</h1>
        <p className="muted">Демо-пароль: lumiere. Записи живут в этом браузере.</p>
        <label>
          Пароль
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </label>
        {error ? <p className="flash bad">{error}</p> : null}
        <button className="btn" type="submit">
          Войти
        </button>
        <Link to="/" className="textlink">
          На сайт
        </Link>
      </form>
    </main>
  );
}

function Desk({ onLeave }: { onLeave: () => void }) {
  const salon = useSalon();
  const [tab, setTab] = useState<Tab>("Сегодня");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Status | "all">("all");
  const [weekOf, setWeekOf] = useState(() => mondayOf(mskToday()));
  const [certAmount, setCertAmount] = useState(5000);
  const [buyer, setBuyer] = useState("");
  const [recipient, setRecipient] = useState("");
  const [issued, setIssued] = useState("");

  const today = mskToday();
  const appts = salon.data.appointments;
  const todayList = appts.filter((a) => a.date === today && a.status !== "cancelled");
  const revenue = todayList.reduce((s, a) => s + dueOf(a), 0);
  const pending = appts.filter((a) => a.status === "pending").length;

  const filtered = appts.filter((a) => {
    if (status !== "all" && a.status !== status) return false;
    const blob = `${a.clientName} ${a.phone}`.toLowerCase();
    return blob.includes(q.trim().toLowerCase());
  });

  const week = useMemo(() => Array.from({ length: 7 }, (_, i) => shift(weekOf, i)), [weekOf]);

  const guests = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; visits: number; spent: number }>();
    for (const a of appts) {
      if (a.status === "cancelled") continue;
      const key = a.phone;
      const prev = map.get(key) ?? { name: a.clientName, phone: a.phone, visits: 0, spent: 0 };
      prev.visits += 1;
      prev.spent += dueOf(a);
      prev.name = a.clientName;
      map.set(key, prev);
    }
    return [...map.values()].sort((a, b) => b.visits - a.visits);
  }, [appts]);

  const bars = Array.from({ length: 7 }, (_, i) => {
    const date = shift(today, i - 6);
    const count = appts.filter((a) => a.date === date && a.status !== "cancelled").length;
    return { date, count };
  });
  const maxBar = Math.max(1, ...bars.map((b) => b.count));

  return (
    <div className="admin">
      <aside>
        <Link to="/" className="word">
          {STUDIO.name}
        </Link>
        <nav>
          {TABS.map((t) => (
            <button key={t} type="button" className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </nav>
        <button type="button" className="textlink" onClick={onLeave}>
          Выйти
        </button>
      </aside>
      <main>
        {!salon.ready ? <p className="muted">Открываем записи…</p> : null}
        {tab === "Сегодня" ? (
          <>
            <p className="kicker">{formatDate(today)}</p>
            <h1>Сегодня</h1>
            <div className="stats">
              <div className="stat">
                <span className="fine">Визитов</span>
                <b>{todayList.length}</b>
              </div>
              <div className="stat">
                <span className="fine">К оплате</span>
                <b>{money(revenue)}</b>
              </div>
              <div className="stat">
                <span className="fine">Ждут подтверждения</span>
                <b>{pending}</b>
              </div>
              <div className="stat">
                <span className="fine">В студии</span>
                <b>{todayList.filter((a) => a.status === "arrived").length}</b>
              </div>
            </div>
            <svg className="chart" viewBox="0 0 280 180" role="img" aria-label="Записи за семь дней">
              {bars.map((b, i) => {
                const h = (b.count / maxBar) * 140;
                return <rect key={b.date} x={16 + i * 38} y={156 - h} width={24} height={Math.max(h, 2)} />;
              })}
            </svg>
            <p className="fine">Семь дней, без отменённых.</p>
            <AppointmentTable rows={todayList} onStatus={salon.setStatus} />
          </>
        ) : null}

        {tab === "Записи" ? (
          <>
            <h1>Записи</h1>
            <div className="filters">
              <input value={q} placeholder="Имя или телефон" onChange={(e) => setQ(e.target.value)} />
              <select value={status} onChange={(e) => setStatus(e.target.value as Status | "all")}>
                <option value="all">Все статусы</option>
                {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
            <AppointmentTable rows={filtered} onStatus={salon.setStatus} />
          </>
        ) : null}

        {tab === "Календарь" ? (
          <>
            <h1>Неделя</h1>
            <div className="toolbar">
              <button type="button" className="btn ghost" onClick={() => setWeekOf(shift(weekOf, -7))}>
                Назад
              </button>
              <button type="button" className="btn ghost" onClick={() => setWeekOf(mondayOf(mskToday()))}>
                Эта неделя
              </button>
              <button type="button" className="btn ghost" onClick={() => setWeekOf(shift(weekOf, 7))}>
                Дальше
              </button>
            </div>
            <div className="cal">
              {week.map((d) => (
                <div key={d} className="dow">
                  {weekdayShort(d)}
                </div>
              ))}
              {week.map((d) => (
                <div key={d} className="cell">
                  <b>{d.slice(8)}</b>
                  {appts
                    .filter((a) => a.date === d && a.status !== "cancelled")
                    .sort((a, b) => a.start.localeCompare(b.start))
                    .map((a) => (
                      <span key={a.id} className="pill">
                        {a.start} {a.clientName.split(" ")[0]}
                      </span>
                    ))}
                </div>
              ))}
            </div>
          </>
        ) : null}

        {tab === "Гости" ? (
          <>
            <h1>Гости</h1>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Имя</th>
                    <th>Телефон</th>
                    <th>Визиты</th>
                    <th>Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((g) => (
                    <tr key={g.phone}>
                      <td>{g.name}</td>
                      <td>{g.phone}</td>
                      <td>{g.visits}</td>
                      <td>{money(g.spent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        {tab === "Сертификаты" ? (
          <>
            <h1>Сертификаты</h1>
            <form
              className="stack"
              onSubmit={(e) => {
                e.preventDefault();
                const res = salon.createCert(certAmount, buyer, recipient);
                if (!res.ok) setIssued(res.error);
                else {
                  setIssued(res.code);
                  setBuyer("");
                  setRecipient("");
                }
              }}
            >
              <label>
                Номинал
                <input type="number" min={1000} step={100} value={certAmount} onChange={(e) => setCertAmount(Number(e.target.value))} />
              </label>
              <label>
                От кого
                <input value={buyer} onChange={(e) => setBuyer(e.target.value)} />
              </label>
              <label>
                Кому
                <input value={recipient} onChange={(e) => setRecipient(e.target.value)} />
              </label>
              <button className="btn" type="submit">
                Выпустить
              </button>
              {issued ? <p className="flash">Код: {issued}</p> : null}
            </form>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Код</th>
                    <th>Остаток</th>
                    <th>Кому</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {salon.data.certs.map((c) => (
                    <tr key={c.code}>
                      <td>{c.code}</td>
                      <td>
                        {money(c.balance)} / {money(c.amount)}
                      </td>
                      <td>{c.recipient}</td>
                      <td>{c.status === "active" ? "активен" : "использован"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

function AppointmentTable({ rows, onStatus }: { rows: Appt[]; onStatus: (id: string, status: Status) => void }) {
  if (rows.length === 0) return <p className="muted">Пусто.</p>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Когда</th>
            <th>Гость</th>
            <th>Услуга</th>
            <th>Мастер</th>
            <th>Сумма</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id}>
              <td>
                {formatDate(a.date)}
                <br />
                {a.start}–{a.end}
              </td>
              <td>
                {a.clientName}
                <br />
                <span className="fine">{a.phone}</span>
              </td>
              <td>{serviceById(a.serviceId)?.name}</td>
              <td>{masterById(a.masterId)?.name}</td>
              <td>{money(dueOf(a))}</td>
              <td>
                <select value={a.status} onChange={(e) => onStatus(a.id, e.target.value as Status)}>
                  {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function mondayOf(date: string) {
  const wd = weekday(date);
  const offset = wd === 0 ? -6 : 1 - wd;
  return shift(date, offset);
}
