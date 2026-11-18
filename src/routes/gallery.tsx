import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Site } from "@/components/site";
import { GALLERY, photo, type GalleryShot } from "@/lib/salon/engine";

export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [{ title: "Работы — LUMIÈRE" }] }),
  component: GalleryPage,
});

function GalleryPage() {
  const [shot, setShot] = useState<GalleryShot | null>(null);
  useEffect(() => {
    if (!shot) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShot(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shot]);

  return (
    <Site>
      <main className="page">
        <p className="kicker">03 — работы</p>
        <h1>Недавние руки</h1>
        <p className="lede">Форма, длина и цвет без шума. Нажмите на кадр, чтобы открыть его крупно.</p>
        <div className="mosaic stack-top">
          {GALLERY.map((g) => (
            <figure key={g.id}>
              <button type="button" className="shot" onClick={() => setShot(g)}>
                <img src={photo(g.photo)} alt={g.title} />
              </button>
              <figcaption>{g.title}</figcaption>
            </figure>
          ))}
        </div>
        {shot ? (
          <div className="modal" role="dialog" aria-modal="true" aria-label={shot.title} onClick={() => setShot(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <img src={photo(shot.photo)} alt={shot.title} />
              <div className="between">
                <p>{shot.title}</p>
                <button type="button" className="textlink" onClick={() => setShot(null)}>
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </Site>
  );
}
