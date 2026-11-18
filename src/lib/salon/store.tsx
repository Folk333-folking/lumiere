import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  applyBook,
  applyCancel,
  applyMove,
  applyReview,
  applyStatus,
  findAppt,
  issueCert,
  seedState,
  type BookInput,
  type Persisted,
  type Status,
} from "./engine";

const KEY = "lumiere-salon-v1";

function readOrSeed(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Persisted;
      if (parsed && Array.isArray(parsed.appointments) && Array.isArray(parsed.certs)) return parsed;
    }
  } catch {
    /* fresh seed */
  }
  const seeded = seedState();
  localStorage.setItem(KEY, JSON.stringify(seeded));
  return seeded;
}

type SalonApi = {
  ready: boolean;
  data: Persisted;
  book: (input: BookInput) => { ok: true; token: string } | { ok: false; error: string };
  cancel: (id: string) => { ok: boolean; error?: string };
  move: (id: string, date: string, time: string, masterId: string) => { ok: boolean; error?: string };
  review: (id: string, rating: number, text: string) => { ok: boolean; error?: string };
  setStatus: (id: string, status: Status) => void;
  toggleFav: (id: string) => void;
  createCert: (amount: number, buyer: string, recipient: string) => { ok: true; code: string } | { ok: false; error: string };
  appt: (token: string) => ReturnType<typeof findAppt> | undefined;
};

const EMPTY: Persisted = { appointments: [], certs: [], reviews: [], favorites: [] };

const Ctx = createContext<SalonApi | null>(null);

export function SalonProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Persisted | null>(null);
  const ref = useRef<Persisted | null>(null);
  ref.current = data;

  useEffect(() => {
    setData(readOrSeed());
  }, []);

  const api = useMemo<SalonApi>(() => {
    const commit = (next: Persisted) => {
      localStorage.setItem(KEY, JSON.stringify(next));
      ref.current = next;
      setData(next);
    };
    return {
      ready: data !== null,
      data: data ?? EMPTY,
      appt: (token) => (ref.current ? findAppt(ref.current, token) : undefined),
      book: (input) => {
        const cur = ref.current;
        if (!cur) return { ok: false, error: "Секунду — открываем запись" };
        const res = applyBook(cur, input);
        if (!res.ok) return res;
        commit(res.state);
        return { ok: true, token: res.token };
      },
      cancel: (id) => {
        const cur = ref.current;
        if (!cur) return { ok: false, error: "Секунду" };
        const res = applyCancel(cur, id);
        if (!res.ok) return res;
        commit(res.state);
        return { ok: true };
      },
      move: (id, date, time, masterId) => {
        const cur = ref.current;
        if (!cur) return { ok: false, error: "Секунду" };
        const res = applyMove(cur, id, date, time, masterId);
        if (!res.ok) return res;
        commit(res.state);
        return { ok: true };
      },
      review: (id, rating, text) => {
        const cur = ref.current;
        if (!cur) return { ok: false, error: "Секунду" };
        const res = applyReview(cur, id, rating, text);
        if (!res.ok) return res;
        commit(res.state);
        return { ok: true };
      },
      setStatus: (id, status) => {
        const cur = ref.current;
        if (!cur) return;
        commit(applyStatus(cur, id, status));
      },
      toggleFav: (id) => {
        const cur = ref.current;
        if (!cur) return;
        const favorites = cur.favorites.includes(id) ? cur.favorites.filter((x) => x !== id) : [...cur.favorites, id];
        commit({ ...cur, favorites });
      },
      createCert: (amount, buyer, recipient) => {
        const cur = ref.current;
        if (!cur) return { ok: false, error: "Секунду" };
        const res = issueCert(cur, amount, buyer, recipient);
        if (!res.ok) return res;
        commit(res.state);
        return { ok: true, code: res.code };
      },
    };
  }, [data]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useSalon() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Салон ещё не готов");
  return ctx;
}

export function ClientGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(true), []);
  if (!on) return fallback ?? null;
  return children;
}
