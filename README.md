# سیستم تیکتینگ سازمانی (فرانت‌اند)

**تسک فنی – توسعه‌دهنده فول‌استک**  
**قسمت فرانت‌اند (React + Vite)**

## ۱. مقدمه

هدف از این پروژه، پیاده‌سازی **فرانت‌اند** یک سیستم تیکتینگ استاندارد با استفاده از **React**، **TypeScript**، **Vite** و **React Query** است.  
به دلیل عدم دسترسی به بک‌اند واقعی (Django + DRF)، از **json-server** به عنوان mock backend موقت استفاده شده تا تمام قابلیت‌های مورد نیاز (احراز هویت، لیست تیکت‌ها، ایجاد، فیلتر، تغییر وضعیت و ...) شبیه‌سازی شود.

**نکته مهم:** این پروژه آماده اتصال به بک‌اند واقعی است. فقط کافی است `VITE_API_URL` را تغییر دهید و interceptorهای axios را تنظیم کنید.

## ۲. معماری و تکنولوژی‌های انتخاب‌شده (فرانت‌اند)

- **React 19 + TypeScript** → برای تایپ‌سیفتی بالا و نگهداری آسان کد
- **Vite** → به جای CRA، برای سرعت بسیار بالاتر در توسعه و بیلد
- **React Query (TanStack Query)** → مدیریت درخواست‌ها، cache، refetch خودکار، loading/error/success states و invalidateQueries برای بروزرسانی realtime بدون refresh
- **Tailwind CSS** → استایل‌دهی سریع، responsive و بدون نوشتن CSS زیاد
- **React Hook Form** → اعتبارسنجی فرم‌ها با عملکرد بالا و کد تمیز
- **react-hot-toast** → نمایش نوتیفیکیشن‌های کاربرپسند (success/error)
- **Axios** → کلاینت HTTP با interceptor برای مدیریت خطاها (401 → logout)
- **json-server** → mock backend ساده و قدرتمند برای شبیه‌سازی REST API
- **Docker + Docker Compose + nginx** → برای containerize کردن پروژه و آماده‌سازی برای deployment

**دلیل انتخاب معماری:**
- React Query بهترین انتخاب برای مدیریت state سرور-ساید و realtime updates بدون نیاز به WebSocket است.
- Vite + Tailwind ترکیب بسیار سریع و مدرنی برای توسعه UI است.
- json-server اجازه می‌دهد بدون بک‌اند واقعی، تمام جریان‌های کاربری (User/Admin) را تست کنیم.

## ۳. ساختار پروژه
my-ticketing-app/
├── src/
│   ├── components/         → کامپوننت‌های reusable (TicketTable, TicketFilter, InputField و ...)
│   ├── context/            → AuthContext برای مدیریت کاربر
│   ├── hooks/              → custom hooks (useTickets, useCreateFake, useUsers, useRegister و ...)
│   ├── pages/              → صفحات اصلی (TicketList, CreateTicket, Login, Register)
│   ├── config/             → endpoints, api (axios instance)
│   ├── types/              → interfaceها (Ticket, User, TicketFilters و ...)
│   ├── utils/              → توابع کمکی (cookies, toast و ...)
│   └── App.tsx / main.tsx
├── public/
├── db.json                 → دیتابیس فیک json-server
├── Dockerfile
├── nginx.conf
├── docker-compose.yml
├── server.js               → (اختیاری) اسکریپت ران json-server
├── README.md
└── package.json


## ۴. قابلیت‌های پیاده‌سازی‌شده (فرانت‌اند)

- احراز هویت mock (Login / Register) با localStorage + cookie
- لیست تیکت‌ها (برای User فقط تیکت‌های خودش، برای Admin همه تیکت‌ها)
- فیلتر بر اساس status, priority, search (با q= در json-server)
- صفحه‌بندی ساده (page + limit)
- ایجاد تیکت جدید توسط کاربر
- تغییر وضعیت توسط Admin
- بروزرسانی realtime لیست تیکت‌ها بعد از ایجاد/تغییر (با invalidateQueries)
- مدیریت خطاها (toast برای 400/401/403/404)
- صفحه Not Found (404)
- UI responsive با Tailwind

## ۵. DevOps و Docker

### سرویس‌ها در docker-compose.yml
- **frontend**: React app (build شده با Vite + سرو با nginx)
- **mock-backend**: json-server (روی پورت 3000 داخل کانتینر)

### نحوه اجرای پروژه با Docker

1. **کلون پروژه** (اگر هنوز نکردی)
   ```bash
   git clone <repository-url>
   cd my-ticketing-app

2. **بیلد کردن ایمیج‌ها
   ```bash
   docker compose build

3. **بیلد کردن ایمیج‌ها
   ```bash
   docker compose up -d
4. **توقف پروژه
   ```bash
   docker compose up -d

**اجرای محلی (بدون Docker)

1. **نصب وابستگی‌هاBash
   ```bash
   npm install

2. **ران کردن json-server (شبیه‌سازی بک‌اند):
   ```bash
   npm run server

3. **ران کردن فرانت‌اند::
   ```bash
   npm run dev
