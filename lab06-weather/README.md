# Лабораторна робота №6: ReactJS

SPA на React і React Router. Сторінка входу, захищена сторінка `/dashboard` з прогнозом погоди на 5 днів.

## Запуск

Потрібен Node.js 18 або новіший.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # збірка в dist/
npm run preview   # перегляд зібраної версії
npm run lint      # перевірка коду ESLint
```

## Вхід

Логін і пароль за умовою: «ім’я + номер курсу». За замовчуванням це `mark5` / `mark5`.
Свої дані впишіть у `src/config/auth.js`.

## Маршрути

| Адреса       | Що відбувається                                                    |
|--------------|--------------------------------------------------------------------|
| `/`          | Перенаправляє на `/dashboard`                                      |
| `/login`     | Форма входу; авторизованого користувача одразу веде на `/dashboard` |
| `/dashboard` | Прогноз; без входу перенаправляє на `/login`                        |
| інші         | Сторінка «Такої сторінки немає»                                    |

## Структура

```
src/
├── api/            запити до зовнішніх API
│   ├── http.js         fetch + зрозумілі повідомлення про помилки
│   ├── weather.js      Open-Meteo: прогноз на 5 днів
│   └── geocoding.js    координати → назва міста
├── components/     перевикористовувані компоненти
│   ├── WeatherCard.jsx   блок одного дня (один компонент для всіх 5 днів)
│   ├── WeatherIcon.jsx   SVG-піктограми погоди
│   ├── Loader.jsx        лоадер під час завантаження
│   ├── TextField.jsx     поле форми з підказкою та помилкою
│   ├── ProtectedRoute.jsx  редірект неавторизованих на /login
│   ├── Header.jsx, LocationSwitch.jsx
│   └── ErrorBoundary.jsx   класовий компонент, ловить помилки рендерингу
├── config/         логіни, назви маршрутів, координати Києва
├── context/        AuthContext і AuthProvider (стан входу)
├── hooks/          useAuth, useGeolocation, useWeather
├── pages/          LoginPage, DashboardPage, NotFoundPage
├── services/       перевірка логіна й пароля
├── styles/         глобальні стилі й токени теми
└── utils/          cookies, валідація форми, форматування, коди погоди
```

## Відповідність умовам

| Умова | Де реалізовано |
|---|---|
| Сторінка авторизації з логіном і паролем | `pages/LoginPage.jsx` |
| Після входу перехід на `/dashboard` | `LoginPage.jsx` → `navigate()` |
| Прогноз на 5 днів, лоадер під час завантаження | `hooks/useWeather.js`, `components/Loader.jsx` |
| Блоки погоди — один компонент з різними значеннями | `components/WeatherCard.jsx` у `days.map(...)` |
| AJAX | `fetch` у `api/http.js` |
| 1. React (Vite) | увесь проєкт |
| 2. Маршрутизація react-router без перезавантаження | `main.jsx` (`BrowserRouter`), `App.jsx` (`Routes`, `Route`, `Navigate`) |
| 3. Обробка помилок у формі | `utils/validation.js`, `LoginPage.jsx`, `TextField.jsx` |
| Дод. 1. Геолокація | `hooks/useGeolocation.js`; якщо доступу немає, показується Київ |
| Дод. 2. Редірект без входу + cookies | `components/ProtectedRoute.jsx`, `context/AuthProvider.jsx`, `utils/cookies.js` |

### Як працює форма

- Порожні поля: «Введіть логін.» / «Введіть пароль.»
- Неправильний формат логіна (не «ім’я латиницею + курс 1–6») або пароль коротший за 4 символи: повідомлення під полем.
- Помилка поля з’являється, коли користувач залишив поле або натиснув «Увійти».
- Правильний формат, але неіснуюча пара логін/пароль: загальне повідомлення «Неправильний логін або пароль».
- Фокус переходить на перше поле з помилкою (через `useRef`).

### Cookies

Після входу записується cookie `lab6_auth`. Без «Запам’ятати мене» вона сесійна і зникає після закриття браузера, з галочкою живе 7 днів. «Вийти» видаляє cookie.

Це навчальна авторизація на клієнті, без сервера. У реальному застосунку логін перевіряє сервер і видає захищену `HttpOnly`-cookie.

## Примітки

**Чому не MetaWeather.** MetaWeather API закрили у 2022 році, а умова дозволяє взяти інший API. Тут використано [Open-Meteo](https://open-meteo.com/): безкоштовний, без ключа, з підтримкою CORS. Назву міста за координатами визначає BigDataCloud. Якщо цей сервіс недоступний, прогноз однаково показується.

**React Router v4 з лекції і сучасна версія.** У проєкті react-router-dom 7. Основні відмінності API:

| v4 (лекція) | v6 / v7 (проєкт) |
|---|---|
| `<Switch>` | `<Routes>` |
| `<Route component={Page} />` | `<Route element={<Page />} />` |
| `<Redirect to="/login" />` | `<Navigate to="/login" replace />` |
| `history.push()` | `useNavigate()` |
| `<NavLink activeClassName>` | `<NavLink className={({ isActive }) => ...}>` |
| `<Prompt>` | `useBlocker()` (лише з data router) |
