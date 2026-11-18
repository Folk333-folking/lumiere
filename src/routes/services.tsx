import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Site } from "@/components/site";
import { useSalon } from "@/lib/salon/store";
import { SERVICES, dur, money, photo } from "@/lib/salon/engine";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [{ title: "Услуги — LUMIÈRE" }] }),
  component: ServicesPage,
});

const CATS = ["Все", ...Array.from(new Set(SERVICES.map((s) => s.category)))];

function ServicesPage() {
  const { ready, data, toggleFav } = useSalon();
  const [cat, setCat] = useState("Все");
  const [onlyFav, setOnlyFav] = useState(false);
  const favs = ready ? data.favorites : [];
  const list = SERVICES.filter((s) => (cat === "Все" || s.category === cat) && (!onlyFav || favs.includes(s.id)));

  return (
    <Site>
      <main className="page">
        <div className="section-h">
          <div>
            <p className="kicker">Каталог</p>
            <h1>Услуги</h1>
          </div>
          <p className="lede">Цена и длительность — как в записи. Избранное хранится на этом устройстве.</p>
        </div>
        <div className="cats">
          {CATS.map((c) => (
            <button key={c} type="button" className={c === cat ? "on" : ""} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
          <button type="button" className={onlyFav ? "on textlink" : "textlink"} onClick={() => setOnlyFav((v) => !v)}>
            {onlyFav ? "Показать все" : "Только избранное"}
          </button>
        </div>
        {list.length === 0 ? <p className="muted">В избранном пока пусто.</p> : null}
        <div className="cards">
          {list.map((s) => {
            const on = favs.includes(s.id);
            return (
              <article className="card" key={s.id}>
                <Link to="/booking" search={{ service: s.id }}>
                  <img src={photo(s.photo)} alt={s.name} />
                </Link>
                <div className="card-b">
                  <p className="kicker">{s.category}</p>
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                  <p className="meta">
                    <span>{money(s.price)}</span>
                    <span>{dur(s.duration)}</span>
                  </p>
                  <div className="row">
                    <Link className="btn" to="/booking" search={{ service: s.id }}>
                      Записаться
                    </Link>
                    <button
                      type="button"
                      className={on ? "fav on" : "fav"}
                      aria-pressed={on}
                      aria-label={on ? "Убрать из избранного" : "В избранное"}
                      onClick={() => toggleFav(s.id)}
                    >
                      <Heart on={on} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </Site>
  );
}
