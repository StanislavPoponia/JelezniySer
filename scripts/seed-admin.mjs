// Створює (або оновлює) акаунт адміна.
// Запуск: node --env-file=.env.local scripts/seed-admin.mjs
// Потрібні змінні: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD

const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key, ADMIN_EMAIL: email, ADMIN_PASSWORD: password } =
  process.env;

for (const [name, v] of Object.entries({
  NEXT_PUBLIC_SUPABASE_URL: url,
  SUPABASE_SERVICE_ROLE_KEY: key,
  ADMIN_EMAIL: email,
  ADMIN_PASSWORD: password,
})) {
  if (!v) {
    console.error(`Не задано ${name} у .env.local`);
    process.exit(1);
  }
}
if (password.length < 8) {
  console.error("ADMIN_PASSWORD має містити щонайменше 8 символів");
  process.exit(1);
}

const base = url.replace(/\/+$/, "");
const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

async function api(path, init = {}) {
  const res = await fetch(`${base}${path}`, { ...init, headers: { ...headers, ...init.headers } });
  const text = await res.text();
  let body;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  return { res, body };
}

// 1. Створити користувача (або знайти, якщо вже є)
let userId;
const created = await api("/auth/v1/admin/users", {
  method: "POST",
  body: JSON.stringify({ email, password, email_confirm: true }),
});

if (created.res.ok) {
  userId = created.body.id;
  console.log("Користувача створено.");
} else if (created.body?.error_code === "email_exists") {
  let page = 1;
  while (!userId) {
    const list = await api(`/auth/v1/admin/users?page=${page}&per_page=200`);
    if (!list.res.ok) break;
    const users = list.body.users ?? [];
    userId = users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
    if (users.length < 200) break;
    page++;
  }
  if (!userId) {
    console.error("Користувач існує, але не знайдений у списку.");
    process.exit(1);
  }
  // Оновити пароль до значення з .env.local
  await api(`/auth/v1/admin/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ password, email_confirm: true }),
  });
  console.log("Користувач уже існував, пароль оновлено.");
} else {
  console.error("Помилка створення користувача:", created.res.status, created.body);
  process.exit(1);
}

// 2. Видати роль admin
const prof = await api("/rest/v1/profiles?on_conflict=id", {
  method: "POST",
  headers: { Prefer: "resolution=merge-duplicates,return=representation" },
  body: JSON.stringify({ id: userId, role: "admin" }),
});

if (!prof.res.ok) {
  console.error("Не вдалося записати роль у profiles:", prof.res.status, prof.body);
  console.error("Чи виконано supabase/migrations/0001_profiles.sql у SQL Editor?");
  process.exit(1);
}

console.log(`Готово: ${email} тепер admin.`);
