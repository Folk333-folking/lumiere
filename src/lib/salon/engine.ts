export type Status = "pending" | "confirmed" | "arrived" | "completed" | "cancelled" | "noshow";

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  photo: string;
  category: string;
  popular: boolean;
};

export type DayHours = {
  working: boolean;
  start: string;
  end: string;
  breakStart: string;
  breakEnd: string;
};

export type Master = {
  id: string;
  name: string;
  called: string;
  bio: string;
  specialization: string;
  photo: string;
  daysLabel: string;
  services: string[];
  days: DayHours[];
};

export type GalleryShot = { id: string; title: string; photo: string };

export type Review = {
  id: string;
  clientName: string;
  text: string;
  rating: number;
};

export type Promo = {
  code: string;
  title: string;
  kind: "percent" | "fixed";
  value: number;
  tuesdayOnly?: boolean;
};

export type Cert = {
  code: string;
  amount: number;
  balance: number;
  buyer: string;
  recipient: string;
  status: "active" | "used";
};

export type Appt = {
  id: string;
  token: string;
  clientName: string;
  phone: string;
  email: string;
  comment: string;
  masterId: string;
  serviceId: string;
  date: string;
  start: string;
  end: string;
  price: number;
  discount: number;
  cert: number;
  certCode: string;
  status: Status;
  createdAt: string;
  reviewed: boolean;
};

export type Persisted = {
  appointments: Appt[];
  certs: Cert[];
  reviews: Review[];
  favorites: string[];
};

export type Slot = {
  time: string;
  end: string;
  masterId: string;
  masterName: string;
  price: number;
};

export const STUDIO = {
  name: "LUMIÈRE",
  tagline: "Студия маникюра",
  description:
    "Тихая студия в центре города: чистые линии, спокойный свет и мастера, которые держат форму ногтя так же внимательно, как разговор.",
  address: "Москва, Патриаршие пруды, Малый Козихинский пер., 8",
  phone: "+7 (495) 120-44-18",
  phoneTel: "+74951204418",
  email: "hello@lumiere.studio",
  hours: "Ежедневно 10:00 — 21:00",
  instagram: "https://instagram.com",
  telegram: "https://t.me",
  whatsapp: "https://wa.me/74951204418",
  cancelHours: 3,
};

const WD_SHORT = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];

function week(working: number[], start: string, end: string, bs: string, be: string): DayHours[] {
  return [0, 1, 2, 3, 4, 5, 6].map((d) => ({
    working: working.includes(d),
    start,
    end,
    breakStart: bs,
    breakEnd: be,
  }));
}

export const SERVICES: Service[] = [
  {
    id: "natural",
    name: "Маникюр без покрытия",
    description: "Форма, кутикула и уход без цвета. Чистый, аккуратный ноготь.",
    price: 1800,
    duration: 60,
    photo: "manicure-natural",
    category: "Маникюр",
    popular: true,
  },
  {
    id: "gel",
    name: "Маникюр с гель-лаком",
    description: "Классический маникюр и стойкое покрытие в один тон или с лёгким акцентом.",
    price: 3200,
    duration: 90,
    photo: "gel-polish",
    category: "Маникюр",
    popular: true,
  },
  {
    id: "removal",
    name: "Снятие покрытия",
    description: "Бережное снятие гель-лака без повреждения пластины.",
    price: 700,
    duration: 30,
    photo: "removal",
    category: "Маникюр",
    popular: false,
  },
  {
    id: "extension",
    name: "Наращивание ногтей",
    description: "Длина и архитектура: гель или акригель, форма под вашу руку.",
    price: 5500,
    duration: 150,
    photo: "extension",
    category: "Наращивание",
    popular: true,
  },
  {
    id: "correction",
    name: "Коррекция ногтей",
    description: "Восстановление формы и зоны роста после наращивания.",
    price: 4200,
    duration: 120,
    photo: "correction",
    category: "Наращивание",
    popular: false,
  },
  {
    id: "design",
    name: "Дизайн ногтей",
    description: "Рисунок, фольга, втирка или минималистичный акцент — по эскизу.",
    price: 800,
    duration: 40,
    photo: "design",
    category: "Дизайн",
    popular: true,
  },
  {
    id: "strength",
    name: "Укрепление ногтей",
    description: "Жёсткая база или гель под натуральный ноготь — чтобы не ломались.",
    price: 900,
    duration: 30,
    photo: "strength",
    category: "Уход",
    popular: false,
  },
  {
    id: "pedicure",
    name: "Педикюр",
    description: "Обработка стоп, форма и покрытие. Спокойно, без спешки.",
    price: 3800,
    duration: 90,
    photo: "pedicure",
    category: "Педикюр",
    popular: true,
  },
];

export const MASTERS: Master[] = [
  {
    id: "eva",
    name: "Ева Морозова",
    called: "Еве",
    bio: "Шесть лет в студии. Любит короткую форму и тихие нюдовые оттенки.",
    specialization: "Натуральный маникюр, нюд",
    photo: "eva",
    daysLabel: "пн–сб",
    services: ["natural", "gel", "removal", "strength", "pedicure"],
    days: week([1, 2, 3, 4, 5, 6], "10:00", "19:00", "14:00", "14:30"),
  },
  {
    id: "mira",
    name: "Мира Левина",
    called: "Мире",
    bio: "Архитектура и наращивание. Держит длину так, чтобы она жила, а не ломалась.",
    specialization: "Наращивание, архитектура",
    photo: "mira",
    daysLabel: "вт–вс",
    services: ["extension", "correction", "gel", "natural", "strength"],
    days: week([0, 2, 3, 4, 5, 6], "11:00", "20:00", "15:00", "15:30"),
  },
  {
    id: "sofya",
    name: "Софья Ким",
    called: "Софье",
    bio: "Дизайн без шума: одна линия, один акцент, ничего лишнего.",
    specialization: "Дизайн, гель-лак",
    photo: "sofya",
    daysLabel: "пн–ср, пт–сб",
    services: ["design", "gel", "natural", "removal"],
    days: week([1, 2, 3, 5, 6], "10:00", "18:00", "13:30", "14:00"),
  },
];

export const GALLERY: GalleryShot[] = [
  { id: "milk", title: "Молочный нюд", photo: "milk-nude" },
  { id: "palette", title: "Палитра нюд", photo: "palette" },
  { id: "long", title: "Длинная форма", photo: "long-form" },
  { id: "grey", title: "Тихий серый", photo: "quiet-grey" },
  { id: "color", title: "Цвет", photo: "color-block" },
  { id: "shine", title: "Блеск", photo: "shine" },
  { id: "short", title: "Короткая форма", photo: "short-form" },
  { id: "light", title: "Свет студии", photo: "studio-light" },
];

export const REVIEWS: Review[] = [
  {
    id: "r1",
    clientName: "Катя",
    text: "Пришла на короткую форму и ушла с руками, которые наконец выглядят своими. Никакой спешки.",
    rating: 5,
  },
  {
    id: "r2",
    clientName: "Алина",
    text: "Покрытие держится три недели без сколов. Студия тихая — это редкость.",
    rating: 5,
  },
  {
    id: "r3",
    clientName: "Маша",
    text: "Мира выстроила длину так, что я забываю, что ногти наращённые.",
    rating: 5,
  },
  {
    id: "r4",
    clientName: "Даша",
    text: "Педикюр без боли и без запаха. Записалась на следующий ещё в кресле.",
    rating: 5,
  },
];

export const PROMOS: Promo[] = [
  { code: "LUMIERE10", title: "Первый визит −10%", kind: "percent", value: 10 },
  { code: "QUIET500", title: "Тихий вторник −500 ₽", kind: "fixed", value: 500, tuesdayOnly: true },
];

export const STATUS_LABEL: Record<Status, string> = {
  pending: "ожидает",
  confirmed: "подтверждена",
  arrived: "в студии",
  completed: "завершена",
  cancelled: "отменена",
  noshow: "не пришла",
};

const BLOCKING: Status[] = ["pending", "confirmed", "arrived", "completed"];

export function photo(key: string) {
  return `/img/${key}.jpg`;
}

export function money(n: number) {
  return new Intl.NumberFormat("ru-RU").format(n) + " ₽";
}

export function dur(m: number) {
  if (m < 60) return `${m} мин`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} ч ${r} мин` : `${h} ч`;
}

export function serviceById(id: string) {
  return SERVICES.find((s) => s.id === id);
}

export function masterById(id: string) {
  return MASTERS.find((m) => m.id === id);
}

export function mastersFor(serviceId: string) {
  return MASTERS.filter((m) => m.services.includes(serviceId));
}

export function mskToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function mskMinutes(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Moscow",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return h * 60 + m;
}

export function weekday(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function shift(date: string, days: number) {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

export function formatDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    weekday: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

export function weekdayShort(date: string) {
  return WD_SHORT[weekday(date)];
}

function toMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function fromMin(n: number) {
  const h = Math.floor(n / 60);
  const m = n % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function subtract(ranges: [number, number][], c: number, d: number) {
  if (d <= c) return ranges;
  const out: [number, number][] = [];
  for (const [a, b] of ranges) {
    if (d <= a || c >= b) {
      out.push([a, b]);
      continue;
    }
    if (c > a) out.push([a, c]);
    if (d < b) out.push([d, b]);
  }
  return out;
}

export function phoneDigits(s: string) {
  return (s.match(/\d/g) ?? []).length;
}

export function dueOf(a: Pick<Appt, "price" | "discount" | "cert">) {
  return Math.max(0, a.price - a.discount - a.cert);
}

export function computeSlots(opts: {
  serviceId: string;
  masterId: string;
  date: string;
  appointments: Appt[];
  excludeId?: string;
  now?: Date;
}): Slot[] {
  const svc = serviceById(opts.serviceId);
  if (!svc) return [];
  const now = opts.now ?? new Date();
  const wd = weekday(opts.date);
  const today = mskToday(now);
  const nowMin = opts.date === today ? mskMinutes(now) : -1;
  const out: Slot[] = [];
  for (const master of mastersFor(opts.serviceId)) {
    if (opts.masterId && opts.masterId !== "any" && opts.masterId !== master.id) continue;
    const day = master.days[wd];
    if (!day?.working) continue;
    let ranges: [number, number][] = [[toMin(day.start), toMin(day.end)]];
    if (day.breakStart && day.breakEnd) {
      ranges = subtract(ranges, toMin(day.breakStart), toMin(day.breakEnd));
    }
    for (const a of opts.appointments) {
      if (a.id === opts.excludeId) continue;
      if (a.masterId !== master.id || a.date !== opts.date) continue;
      if (!BLOCKING.includes(a.status)) continue;
      ranges = subtract(ranges, toMin(a.start), toMin(a.end));
    }
    for (const [a, b] of ranges) {
      for (let t = a; t + svc.duration <= b; t += 30) {
        if (t <= nowMin) continue;
        out.push({
          time: fromMin(t),
          end: fromMin(t + svc.duration),
          masterId: master.id,
          masterName: master.name,
          price: svc.price,
        });
      }
    }
  }
  out.sort((x, y) => x.time.localeCompare(y.time) || x.masterName.localeCompare(y.masterName, "ru"));
  return out;
}

export function upcomingDays(opts: {
  serviceId: string;
  masterId: string;
  appointments: Appt[];
  now?: Date;
  count?: number;
}) {
  const now = opts.now ?? new Date();
  const start = mskToday(now);
  const n = opts.count ?? 14;
  return Array.from({ length: n }, (_, i) => {
    const date = shift(start, i);
    const slots = computeSlots({
      serviceId: opts.serviceId,
      masterId: opts.masterId,
      date,
      appointments: opts.appointments,
      now,
    });
    return { date, weekday: weekdayShort(date), count: slots.length, day: date.slice(8) };
  });
}

export function promoDiscount(code: string, price: number, date: string) {
  const c = code.trim().toUpperCase();
  if (!c) return { discount: 0 as number };
  const p = PROMOS.find((x) => x.code === c);
  if (!p) return { discount: 0, error: "Промокод не найден" };
  if (p.tuesdayOnly && weekday(date) !== 2) return { discount: 0, error: "Этот код действует по вторникам" };
  const discount = p.kind === "percent" ? Math.round((price * p.value) / 100) : Math.min(price, p.value);
  return { discount, title: p.title };
}

export function canChange(a: Appt, now = new Date()) {
  if (a.status === "cancelled" || a.status === "completed" || a.status === "noshow" || a.status === "arrived") {
    return false;
  }
  const start = new Date(`${a.date}T${a.start}:00+03:00`).getTime();
  return start - now.getTime() >= STUDIO.cancelHours * 3600 * 1000;
}

function refund(certs: Cert[], code: string, amount: number) {
  return certs.map((c) => {
    if (c.code.toUpperCase() !== code.toUpperCase() || amount <= 0) return c;
    const balance = Math.min(c.amount, c.balance + amount);
    return { ...c, balance, status: "active" as const };
  });
}

function token() {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return "L" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export type BookInput = {
  serviceId: string;
  masterId: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  comment: string;
  promo: string;
  certificate: string;
};

export function applyBook(
  state: Persisted,
  input: BookInput,
  now = new Date(),
): { ok: true; token: string; state: Persisted } | { ok: false; error: string } {
  const name = input.name.trim().replace(/\s+/g, " ");
  const phone = input.phone.trim();
  const email = input.email.trim();
  if (name.length < 2) return { ok: false, error: "Напишите имя" };
  if (phoneDigits(phone) < 10) return { ok: false, error: "Телефон — не меньше 10 цифр" };
  if (email && !email.includes("@")) return { ok: false, error: "Почта выглядит неполной" };
  const svc = serviceById(input.serviceId);
  if (!svc) return { ok: false, error: "Услуга не найдена" };
  const slots = computeSlots({
    serviceId: input.serviceId,
    masterId: input.masterId,
    date: input.date,
    appointments: state.appointments,
    now,
  });
  const slot = slots.find((s) => s.time === input.time && s.masterId === input.masterId);
  if (!slot) return { ok: false, error: "Это окно уже занято. Выберите другое." };
  const promo = promoDiscount(input.promo, slot.price, input.date);
  if (promo.error) return { ok: false, error: promo.error };
  let certs = state.certs;
  let certUsed = 0;
  const code = input.certificate.trim().toUpperCase();
  if (code) {
    const idx = certs.findIndex((c) => c.code.toUpperCase() === code);
    if (idx < 0) return { ok: false, error: "Сертификат не найден" };
    const c = certs[idx];
    if (c.status !== "active" || c.balance <= 0) return { ok: false, error: "Сертификат недоступен" };
    certUsed = Math.min(c.balance, Math.max(0, slot.price - promo.discount));
    const balance = c.balance - certUsed;
    certs = certs.map((x, i) => (i === idx ? { ...x, balance, status: balance <= 0 ? "used" : "active" } : x));
  }
  const id = token();
  const appt: Appt = {
    id,
    token: id,
    clientName: name,
    phone,
    email,
    comment: input.comment.trim(),
    masterId: slot.masterId,
    serviceId: svc.id,
    date: input.date,
    start: slot.time,
    end: slot.end,
    price: slot.price,
    discount: promo.discount,
    cert: certUsed,
    certCode: code,
    status: "pending",
    createdAt: now.toISOString(),
    reviewed: false,
  };
  return { ok: true, token: id, state: { ...state, certs, appointments: [appt, ...state.appointments] } };
}

export function applyCancel(state: Persisted, id: string, now = new Date()) {
  const a = state.appointments.find((x) => x.id === id || x.token === id);
  if (!a) return { ok: false as const, error: "Запись не найдена" };
  if (!canChange(a, now)) {
    return { ok: false as const, error: `Отменить онлайн можно не позже чем за ${STUDIO.cancelHours} часа. Позвоните в студию.` };
  }
  let certs = state.certs;
  if (a.cert > 0 && a.certCode) certs = refund(certs, a.certCode, a.cert);
  return {
    ok: true as const,
    state: {
      ...state,
      certs,
      appointments: state.appointments.map((x) => (x.id === a.id ? { ...x, status: "cancelled" as const, cert: 0 } : x)),
    },
  };
}

export function applyMove(
  state: Persisted,
  id: string,
  date: string,
  time: string,
  masterId: string,
  now = new Date(),
) {
  const a = state.appointments.find((x) => x.id === id || x.token === id);
  if (!a) return { ok: false as const, error: "Запись не найдена" };
  if (!canChange(a, now)) {
    return { ok: false as const, error: "Перенести это время онлайн уже нельзя. Позвоните в студию." };
  }
  const slots = computeSlots({
    serviceId: a.serviceId,
    masterId,
    date,
    appointments: state.appointments,
    excludeId: a.id,
    now,
  });
  const slot = slots.find((s) => s.time === time && s.masterId === masterId);
  if (!slot) return { ok: false as const, error: "Это окно уже занято." };
  return {
    ok: true as const,
    state: {
      ...state,
      appointments: state.appointments.map((x) =>
        x.id === a.id
          ? { ...x, date, start: slot.time, end: slot.end, masterId: slot.masterId, status: "pending" as const }
          : x,
      ),
    },
  };
}

export function applyReview(state: Persisted, id: string, rating: number, text: string) {
  const a = state.appointments.find((x) => x.id === id || x.token === id);
  if (!a) return { ok: false as const, error: "Запись не найдена" };
  if (a.status !== "completed" && a.status !== "arrived") {
    return { ok: false as const, error: "Отзыв можно оставить после визита" };
  }
  const body = text.trim();
  if (body.length < 4) return { ok: false as const, error: "Напишите пару слов" };
  if (a.reviewed) return { ok: false as const, error: "Отзыв уже оставлен" };
  const stars = Math.min(5, Math.max(1, Math.round(rating)));
  const review: Review = { id: "u-" + a.id, clientName: a.clientName.split(" ")[0] || a.clientName, text: body, rating: stars };
  return {
    ok: true as const,
    state: {
      ...state,
      reviews: [review, ...state.reviews],
      appointments: state.appointments.map((x) => (x.id === a.id ? { ...x, reviewed: true } : x)),
    },
  };
}

export function applyStatus(state: Persisted, id: string, status: Status) {
  const a = state.appointments.find((x) => x.id === id);
  if (!a || a.status === status) return state;
  let certs = state.certs;
  let next = { ...a, status };
  if (status === "cancelled" && a.status !== "cancelled" && a.cert > 0 && a.certCode) {
    certs = refund(certs, a.certCode, a.cert);
    next = { ...next, cert: 0 };
  }
  return {
    ...state,
    certs,
    appointments: state.appointments.map((x) => (x.id === id ? next : x)),
  };
}

export function issueCert(state: Persisted, amount: number, buyer: string, recipient: string) {
  const value = Math.round(amount);
  if (value < 1000) return { ok: false as const, error: "Минимальный номинал — 1 000 ₽" };
  let code = "";
  for (let i = 0; i < 20; i++) {
    const n = 1000 + Math.floor(Math.random() * 9000);
    const candidate = `GIFT-${n}`;
    if (!state.certs.some((c) => c.code === candidate)) {
      code = candidate;
      break;
    }
  }
  if (!code) return { ok: false as const, error: "Не удалось подобрать код" };
  const cert: Cert = {
    code,
    amount: value,
    balance: value,
    buyer: buyer.trim() || "Студия",
    recipient: recipient.trim() || "Подарок",
    status: "active",
  };
  return { ok: true as const, code, state: { ...state, certs: [cert, ...state.certs] } };
}

export function seedState(now = new Date()): Persisted {
  const today = mskToday(now);
  const yest = shift(today, -1);
  const tom = shift(today, 1);
  const mk = (
    id: string,
    name: string,
    phone: string,
    masterId: string,
    serviceId: string,
    date: string,
    start: string,
    status: Status,
  ): Appt => {
    const svc = serviceById(serviceId)!;
    return {
      id,
      token: id,
      clientName: name,
      phone,
      email: "",
      comment: "",
      masterId,
      serviceId,
      date,
      start,
      end: fromMin(toMin(start) + svc.duration),
      price: svc.price,
      discount: 0,
      cert: 0,
      certCode: "",
      status,
      createdAt: `${date}T${start}:00+03:00`,
      reviewed: false,
    };
  };
  return {
    favorites: [],
    reviews: [],
    certs: [
      { code: "GIFT-4401", amount: 5000, balance: 5000, buyer: "Студия", recipient: "Подарок", status: "active" },
    ],
    appointments: [
      mk("demo-katya", "Катя Орлова", "+79031220011", "eva", "gel", today, "11:00", "completed"),
      mk("demo-alina", "Алина Вернер", "+79035550102", "mira", "natural", today, "13:00", "arrived"),
      mk("demo-masha", "Маша Ли", "+79161230077", "mira", "gel", tom, "12:00", "pending"),
      mk("demo-dasha", "Даша Ким", "+79261112233", "eva", "pedicure", yest, "16:00", "completed"),
      mk("demo-lera", "Лера Солнцева", "+79030001122", "mira", "natural", today, "18:00", "confirmed"),
    ],
  };
}

export function findAppt(state: Persisted, tokenId: string) {
  return state.appointments.find((a) => a.token === tokenId || a.id === tokenId);
}
