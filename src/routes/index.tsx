import { createFileRoute, Link } from "@tanstack/react-router";
import { Site } from "@/components/site";
import { useSalon } from "@/lib/salon/store";
import {
  GALLERY,
  MASTERS,
  PROMOS,
  REVIEWS,
  SERVICES,
  STUDIO,
  dur,
  money,
  photo,
} from "@/lib/salon/engine";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { ready, data } = useSalon();
  const voices = ready ? [...REVIEWS, ...data.reviews] : REVIEWS;
  return (
    <Site>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="kicker">{STUDIO.tagline}</p>
            <h1>Тихие руки, точная форма.</h1>
            <p className="lede">{STUDIO.description}</p>
            <div className="hero-actions">
              <Link className="btn" to="/booking">
                Записаться онлайн
              </Link>
              <Link className="textlink" to="/services">
                Смотреть услуги
              </Link>
            </div>
          </div>
          <figure className="hero-frame">
            <img src="/img/hero.jpg" alt="Нюдовая палитра и форма ногтя в студии" />
            <figcaption>палитра · нюд · {STUDIO.hours}</figcaption>
          </figure>
        </section>

        <section className="section">
          <div className="section-h">
            <p className="kicker">01 — услуги</p>
            <h2>То, с чем приходят чаще всего</h2>
          </div>
          <div className="cards">
            {SERVICES.filter((s) => s.popular).map((s) => (
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
                  <Link className="textlink" to="/booking" search={{ service: s.id }}>
                    Записаться
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section points">
          <div className="section-h">
            <p className="kicker">02 — студия</p>
            <h2>Как у нас устроено</h2>
          </div>
          <ol>
            <li>
              <strong>Один гость за столом.</strong>
              <span>Без очереди через плечо и без спешки к следующему.</span>
            </li>
            <li>
              <strong>Стерильно и тихо.</strong>
              <span>Инструмент в крафте, свет тёплый, разговоров ровно столько, сколько хочется.</span>
            </li>
            <li>
              <strong>Форма важнее декора.</strong>
              <span>Сначала архитектура ногтя, потом цвет. Дизайн — если он нужен, а не «потому что можно».</span>
            </li>
          </ol>
        </section>

        <section className="section">
          <div className="section-h">
            <p className="kicker">03 — работы</p>
            <h2>Недавние руки</h2>
            <Link className="textlink" to="/gallery">
              Вся галерея
            </Link>
          </div>
          <div className="mosaic">
            {GALLERY.slice(0, 6).map((g) => (
              <figure key={g.id}>
                <img src={photo(g.photo)} alt={g.title} />
                <figcaption>{g.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-h">
            <p className="kicker">04 — мастера</p>
            <h2>К кому сесть</h2>
          </div>
          <div className="masters">
            {MASTERS.map((m) => (
              <article className="master" key={m.id}>
                <img src={photo(m.photo)} alt={`Работа мастера ${m.name}`} />
                <div>
                  <h3>{m.name}</h3>
                  <p className="kicker">{m.specialization}</p>
                  <p>{m.bio}</p>
                  <p className="meta">
                    {m.daysLabel} · {m.days.find((d) => d.working)?.start}–{m.days.find((d) => d.working)?.end}
                  </p>
                  <Link className="textlink" to="/booking" search={{ master: m.id }}>
                    Записаться к {m.called}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section quotes">
          <div className="section-h">
            <p className="kicker">05 — отзывы</p>
            <h2>После визита</h2>
          </div>
          {voices.map((r) => (
            <blockquote key={r.id}>
              <p>{r.text}</p>
              <footer>{r.clientName}</footer>
            </blockquote>
          ))}
        </section>

        <section className="section promo-line">
          <p className="kicker">Сейчас</p>
          {PROMOS.map((p) => (
            <p key={p.code}>
              <strong>{p.code}</strong> — {p.title}
            </p>
          ))}
          <Link className="textlink" to="/booking">
            Применить при записи
          </Link>
        </section>

        <section className="section visit" id="contacts">
          <div>
            <p className="kicker">06 — визит</p>
            <h2>Как добраться</h2>
            <p>{STUDIO.description}</p>
            <p>
              <a href={`https://yandex.ru/maps/?text=${encodeURIComponent(STUDIO.address)}`}>{STUDIO.address}</a>
            </p>
            <p>{STUDIO.hours}</p>
            <p>
              <a href={`tel:${STUDIO.phoneTel}`}>{STUDIO.phone}</a>
            </p>
          </div>
          <Link className="btn" to="/booking">
            Записаться онлайн
          </Link>
        </section>
      </main>
    </Site>
  );
}
