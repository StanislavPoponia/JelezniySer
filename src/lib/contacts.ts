// Єдине джерело контактних даних, що не залежать від мови.
// Адреса, назви днів і підписи — у src/messages/*.json (розділ contacts).

export const contacts = {
  mapQuery: "вулиця Сергія Ватрича, 24Б, Чернівці, Чернівецька область, Україна",
  email: "jelezniyser@gmail.com",
  phones: [
    { display: "+38 (095) 201-60-46", value: "+380952016046", viber: false },
    { display: "+38 (050) 522-70-03", value: "+380505227003", viber: true },
  ],
} as const;

// Години роботи: null — вихідний. Порядок — з понеділка.
export const schedule = [
  { day: "mon", hours: "09:00 – 21:00" },
  { day: "tue", hours: "09:00 – 21:00" },
  { day: "wed", hours: "09:00 – 21:00" },
  { day: "thu", hours: "09:00 – 21:00" },
  { day: "fri", hours: "09:00 – 21:00" },
  { day: "sat", hours: "10:00 – 18:00" },
  { day: "sun", hours: null },
] as const;

// Відкриває новий лист у Gmail із заповненими адресою й темою (працює без поштової програми).
export const emailLink = (subject: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    contacts.email,
  )}&su=${encodeURIComponent(subject)}`;

export const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  contacts.mapQuery,
)}`;

// Вбудована карта без API-ключа; lang — мова підписів на карті.
export const mapEmbedSrc = (lang: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(
    contacts.mapQuery,
  )}&hl=${lang}&z=16&output=embed`;

export const viberLink = (phone: string) => `viber://chat?number=${encodeURIComponent(phone)}`;

export const telLink = (phone: string) => `tel:${phone}`;
