import { createFileRoute, Link } from "@tanstack/react-router";
import { Site } from "@/components/site";
import { MASTERS, photo } from "@/lib/salon/engine";

export const Route = createFileRoute("/masters")({
  head: () => ({ meta: [{ title: "Мастера — LUMIÈRE" }] }),
  component: MastersPage,
});

function MastersPage() {
  return (
    <Site>
      <main className="page">
        <p className="kicker">Студия</p>
        <h1>Мастера</h1>
        <p className="lede">Трое. У каждого свой стол, своё окно и свой почерк — можно выбрать человека, а не «любого свободного».</p>
        <div className="masters stack-top">
          {MASTERS.map((m) => {
            const day = m.days.find((d) => d.working);
            return (
              <article className="master" key={m.id}>
                <img src={photo(m.photo)} alt={`Работа мастера ${m.name}`} />
                <div>
                  <h2>{m.name}</h2>
                  <p className="kicker">{m.specialization}</p>
                  <p>{m.bio}</p>
                  <p className="meta">
                    {m.daysLabel} · {day?.start}–{day?.end}
                  </p>
                  <Link className="btn" to="/booking" search={{ master: m.id }}>
                    Записаться к {m.called}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </Site>
  );
}
