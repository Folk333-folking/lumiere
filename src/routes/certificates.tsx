import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Site } from "@/components/site";
import { ClientGate, useSalon } from "@/lib/salon/store";
import { money } from "@/lib/salon/engine";

export const Route = createFileRoute("/certificates")({
  head: () => ({ meta: [{ title: "Сертификаты — LUMIÈRE" }] }),
  component: CertsPage,
});

function CertsPage() {
  return (
    <Site>
      <main className="page narrow">
        <p className="kicker">Подарок</p>
        <h1>Сертификаты</h1>
        <p className="lede">
          Номинал списывается при записи. Для проверки есть демо-код <strong>GIFT-4401</strong> на 5 000 ₽ — он живёт в этом браузере вместе с остальными записями.
        </p>
        <ClientGate fallback={<p className="muted">Открываем сертификаты…</p>}>
          <Checker />
        </ClientGate>
      </main>
    </Site>
  );
}

function Checker() {
  const { data } = useSalon();
  const [code, setCode] = useState("");
  const [asked, setAsked] = useState("");

  const found = asked ? data.certs.find((c) => c.code.toUpperCase() === asked.toUpperCase()) : undefined;

  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        setAsked(code.trim());
      }}
    >
      <label>
        Код сертификата
        <input
          name="code"
          required
          placeholder="GIFT-4401"
          autoComplete="off"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </label>
      <button className="btn" type="submit">
        Проверить баланс
      </button>
      {asked && !found ? <p className="flash bad">Такого сертификата нет.</p> : null}
      {found ? (
        <div className="summary">
          <p className="kicker">{found.status === "active" ? "Активен" : "Использован"}</p>
          <p>
            Остаток <strong>{money(found.balance)}</strong> из {money(found.amount)}
          </p>
          <p className="muted">
            От {found.buyer} · кому {found.recipient}
          </p>
        </div>
      ) : null}
    </form>
  );
}
