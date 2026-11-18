import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Site } from "@/components/site";
import { useSalon } from "@/lib/salon/store";
import {
  STUDIO,
  STATUS_LABEL,
  canChange,
  computeSlots,
  dueOf,
  formatDate,
  masterById,
  money,
  serviceById,
  upcomingDays,
} from "@/lib/salon/engine";

type Search = { fresh?: boolean };

export const Route = createFileRoute("/visit/$token")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    fresh: search.fresh === true || search.fresh === "1" || search.fresh === "true",
  }),
  head: () => ({ meta: [{ title: "Запись — LUMIÈRE" }] }),
  component: VisitPage,
});

function VisitPage() {
  const { token } = Route.useParams();
  const { fresh } = Route.useSearch();
  const salon = useSalon();
  const appt = salon.ready ? salon.data.appointments.find((a) => a.token === token) : undefined;

  return (
    <Site>
      <main className="page narrow">
        {!salon.ready ? <p className="muted">Ищем запись…</p> : null}
        {salon.ready && !appt ? (
          <>
            <p className="kicker">Запись</p>
            <h1>Не нашли</h1>
            <p>Такой ссылки нет в этом браузере. Записи хранятся на устройстве, где их создали.</p>
          </>
        ) : null}
        {appt ? <VisitBody token={token} fresh={!!fresh} /> : null}
      </main>
    </Site>
  );
}

function VisitBody({ token, fresh }: { token: string; fresh: boolean }) {
  const salon = useSalon();
  const appt = salon.data.appointments.find((a) => a.token === token)!;
  const svc = serviceById(appt.serviceId);
  const master = masterById(appt.masterId);
  const open = canChange(appt);
  const [flash, setFlash] = useState(fresh ? "Заявка отправлена. Статус — ожидает подтверждения." : "");
  const [bad, setBad] = useState(false);
  const [moving, setMoving] = useState(false);
  const [date, setDate] = useState(appt.date);
  const [time, setTime] = useState("");
  const [masterId, setMasterId] = useState(appt.masterId);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const days = useMemo(
    () =>
      upcomingDays({
        serviceId: appt.serviceId,
        masterId: appt.masterId,
        appointments: salon.data.appointments.filter((a) => a.id !== appt.id),
      }),
    [appt.serviceId, appt.masterId, appt.id, salon.data.appointments],
  );
  const slots = useMemo(
    () =>
      computeSlots({
        serviceId: appt.serviceId,
        masterId: appt.masterId,
        date,
        appointments: salon.data.appointments,
        excludeId: appt.id,
      }),
    [appt.serviceId, appt.masterId, appt.id, date, salon.data.appointments],
  );

  function note(message: string, isBad = false) {
    setBad(isBad);
    setFlash(message);
  }

  return (
    <>
      {flash ? <p className={bad ? "flash bad" : "flash"}>{flash}</p> : null}
      <p className="kicker">Ваша запись</p>
      <h1>{svc?.name ?? "Визит"}</h1>
      <p className="status">{STATUS_LABEL[appt.status]}</p>
      <dl className="facts">
        <div>
          <dt>Когда</dt>
          <dd>
            {formatDate(appt.date)}, {appt.start}–{appt.end}
          </dd>
        </div>
        <div>
          <dt>Мастер</dt>
          <dd>{master?.name}</dd>
        </div>
        <div>
          <dt>Гость</dt>
          <dd>
            {appt.clientName}, {appt.phone}
          </dd>
        </div>
        <div>
          <dt>Стоимость</dt>
          <dd>
            {money(dueOf(appt))}
            {appt.discount ? <span className="muted"> · скидка {money(appt.discount)}</span> : null}
            {appt.cert ? <span className="muted"> · сертификат {money(appt.cert)}</span> : null}
          </dd>
        </div>
        {appt.comment ? (
          <div>
            <dt>Комментарий</dt>
            <dd>{appt.comment}</dd>
          </div>
        ) : null}
      </dl>

      {open ? (
        <div className="manage">
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              if (!window.confirm("Отменить запись?")) return;
              const res = salon.cancel(appt.id);
              if (!res.ok) note(res.error ?? "Не вышло", true);
              else note("Запись отменена. Это время снова свободно.");
            }}
          >
            Отменить запись
          </button>
          <div className="stack">
            <p className="kicker">Перенести</p>
            {!moving ? (
              <button type="button" className="textlink" onClick={() => setMoving(true)}>
                Выбрать другое окно
              </button>
            ) : (
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
                        setTime("");
                      }}
                    >
                      {d.weekday} {d.day}
                    </button>
                  ))}
                </div>
                <div className="slots">
                  {slots.map((s) => (
                    <button
                      key={s.time + s.masterId}
                      type="button"
                      className={time === s.time && masterId === s.masterId ? "on" : ""}
                      onClick={() => {
                        setTime(s.time);
                        setMasterId(s.masterId);
                      }}
                    >
                      {s.time}
                      <br />
                      <span className="fine">{s.masterName.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn"
                  disabled={!time}
                  onClick={() => {
                    const res = salon.move(appt.id, date, time, masterId);
                    if (!res.ok) note(res.error ?? "Не вышло", true);
                    else {
                      note("Запись перенесена. Статус снова «ожидает».");
                      setMoving(false);
                    }
                  }}
                >
                  Перенести
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <p className="muted">
          Самостоятельно отменить или перенести можно не позднее чем за {STUDIO.cancelHours} ч. Дальше — звонок в студию, {STUDIO.phone}.
        </p>
      )}

      {appt.status === "completed" || appt.status === "arrived" ? (
        appt.reviewed ? (
          <p className="muted">Спасибо, отзыв уже на главной.</p>
        ) : (
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              const res = salon.review(appt.id, rating, text);
              if (!res.ok) note(res.error ?? "Не вышло", true);
              else note("Спасибо. Отзыв появился на главной.");
            }}
          >
            <p className="kicker">Как прошёл визит</p>
            <label>
              Оценка
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Пара слов
              <textarea required maxLength={1000} value={text} onChange={(e) => setText(e.target.value)} />
            </label>
            <button className="btn" type="submit">
              Отправить отзыв
            </button>
          </form>
        )
      ) : null}
    </>
  );
}
