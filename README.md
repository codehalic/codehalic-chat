# تنظیم محیط (ENV)

برای اجرای صحیح پروژه، مقادیر محیطی را در هر اپ تنظیم کنید.

## API (`apps/api`)

1. یک فایل `.env.local` بسازید کنار `apps/api/.env.example` و مقادیر را طبق نیاز پر کنید:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/codehalic-chat
MONGO_DB=
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret
SMSIR_API_KEY=
SMSIR_TEMPLATE_ID=0
```

2. سرور را با `npm run dev` از روت اجرا کنید. ماژول `ConfigModule` این مقادیر را بارگذاری می‌کند.

## Web (`apps/web`)

1. یک فایل `.env.local` بسازید کنار `apps/web/.env.example`:

```
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:8080/chat
```

2. اجرای فرانت با `npm run dev` از روت. Vite مقادیر را از `.env.*` می‌خواند.

## نکات

- اگر MongoDB یا Redis در لوکال ندارید، برای توسعه می‌توانید فقط Redis را لازم داشته باشید (برای OTP). در حالت توسعه، در صورت عدم دسترسی به MongoDB، ورود با fallback انجام می‌شود.
- سوکت روی `http://localhost:8080/chat` است. API به صورت پیش‌فرض روی `http://localhost:3000` بالا می‌آید.

