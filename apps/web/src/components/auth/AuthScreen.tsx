import React, { useMemo, useState } from "react";
import { useAuth } from "../../store/auth";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";

export function AuthScreen() {
  const { challenge, verify } = useAuth();
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"form" | "code">("form");
  const [error, setError] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [remain, setRemain] = useState<number>(0);
  React.useEffect(() => {
    if (step !== "code") return;
    if (remain <= 0) return;
    const id = setInterval(() => {
      setRemain((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [step, remain]);

  function toEnglishDigits(s: string): string {
    const pers = "۰۱۲۳۴۵۶۷۸۹";
    const arab = "٠١٢٣٤٥٦٧٨٩";
    return s
      .split("")
      .map((ch) => {
        const p = pers.indexOf(ch);
        if (p >= 0) return String(p);
        const a = arab.indexOf(ch);
        if (a >= 0) return String(a);
        return ch;
      })
      .join("");
  }

  const phoneDigits = useMemo(
    () => toEnglishDigits(phone).replace(/\D/g, ""),
    [phone]
  );
  const normalizedTen = useMemo(() => {
    let d = toEnglishDigits(phone).replace(/\D/g, "");
    if (d.startsWith("0098")) d = d.slice(4);
    else if (d.startsWith("98")) d = d.slice(2);
    else if (d.startsWith("0")) d = d.slice(1);
    return d;
  }, [phone]);
  const isIran = /^9\d{9}$/.test(normalizedTen);

  const onChallenge = async () => {
    setError(undefined);
    if (!isIran) {
      setError(
        "فقط شماره‌های ایران مجازند. نمونه: 09xxxxxxxxx یا +989xxxxxxxxx"
      );
      return;
    }
    try {
      setBusy(true);
      const res = await challenge({ phone, firstName, lastName });
      if (res.ok) {
        setStep("code");
        setRemain(res.expiresIn ?? 120);
      } else if (res.error === "cooldown") {
        setStep("code");
        setRemain(res.remain ?? 120);
        setError("کد قبلاً ارسال شده. لطفاً تا پایان زمان باقیمانده صبر کنید.");
      } else {
        setError("ارسال کد ناموفق بود. دوباره تلاش کنید.");
      }
    } finally {
      setBusy(false);
    }
  };

  const onVerify = async () => {
    setError(undefined);
    if (!/^\d{4,6}$/.test(code.trim())) {
      setError("کد تایید معتبر وارد کنید");
      return;
    }
    try {
      setBusy(true);
      const ok = await verify({ phone, code });
      if (!ok) setError("تایید ناموفق بود. کد یا شماره را بررسی کنید.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center bg-background">
      <div className="w-full max-w-[420px] mx-3 overflow-hidden rounded-2xl border bg-secondary shadow-lg">
        <div className="flex items-center gap-3 border-b bg-secondary p-4">
          <div className="rounded-full bg-primary p-2 text-primary-foreground">
            <Icon name="phone" />
          </div>
          <div className="text-lg font-bold">ورود به گفتگو</div>
        </div>

        {step === "form" && (
          <div className="space-y-4 p-5 sm:p-6">
            <div className="text-sm text-muted-foreground">
              لطفاً شماره موبایل ایران خود را وارد کنید
            </div>
            <div className="flex items-center gap-2" dir="ltr">
              <div className="rounded-md border bg-secondary px-3 py-2 text-sm">
                +98
              </div>
              <Input
                dir="ltr"
                className="text-left"
                placeholder="9123456789"
                value={normalizedTen}
                onChange={(e) => {
                  let raw = toEnglishDigits(e.target.value);
                  let d = raw.replace(/\D/g, "");
                  if (d.startsWith("0098")) d = d.slice(4);
                  else if (d.startsWith("98")) d = d.slice(2);
                  else if (d.startsWith("0")) d = d.slice(1);
                  setPhone(d);
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="نام"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                placeholder="نام خانوادگی"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            {error && <div className="text-xs text-red-600">{error}</div>}
            <div className="flex justify-end">
              <Button onClick={onChallenge} disabled={busy} className="gap-2">
                <Icon name="send" />
                ارسال کد
              </Button>
            </div>
          </div>
        )}

        {step === "code" && (
          <div className="space-y-4 p-5 sm:p-6">
            <div className="text-sm text-muted-foreground">
              کد تایید پیامکی را وارد کنید
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-md border bg-secondary px-3 py-2 text-sm">
                کد
              </div>
              <Input
                dir="ltr"
                className="text-left tracking-widest"
                placeholder="12345"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            {remain > 0 && (
              <div className="text-xs text-muted-foreground">
                ارسال دوباره پس از{" "}
                {String(Math.floor(remain / 60)).padStart(2, "0")}:
                {String(remain % 60).padStart(2, "0")}
              </div>
            )}
            {error && <div className="text-xs text-red-600">{error}</div>}
            <div className="flex justify-end gap-2">
              <Button className="gap-2" onClick={() => setStep("form")}>
                <Icon name="arrow-right" />
                بازگشت
              </Button>
              <Button onClick={onVerify} disabled={busy} className="gap-2">
                <Icon name="lock" />
                ورود
              </Button>
              <Button
                onClick={onChallenge}
                disabled={remain > 0 || busy}
                className="gap-2"
              >
                <Icon name="send" />
                ارسال دوباره
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
