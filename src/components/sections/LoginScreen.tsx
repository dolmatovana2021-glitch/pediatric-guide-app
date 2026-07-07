import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DOCTOR_BEAR } from "@/components/shared/sectionTypes";
import { requestCode, verifyCode, formatPhoneInput } from "@/components/shared/auth";

export function LoginScreen() {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const digits = phone.replace(/\D/g, "");
  const phoneValid = digits.length === 11;

  const sendCode = async () => {
    setError("");
    setLoading(true);
    try {
      const { demoCode } = await requestCode(phone);
      setDemoCode(demoCode || "");
      setStep("code");
    } catch {
      setError("Не удалось отправить код. Проверьте номер.");
    } finally {
      setLoading(false);
    }
  };

  const confirm = async () => {
    setError("");
    setLoading(true);
    try {
      await verifyCode(phone, code);
    } catch {
      setError("Неверный или просроченный код.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-golos flex items-center justify-center px-5">
      <div className="w-full max-w-[400px]">
        <div className="blob-bg rounded-3xl p-6 mb-6 text-center relative overflow-hidden">
          <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-3 shadow-lg">
            <img src={DOCTOR_BEAR} alt="Доктор" className="w-full h-full object-cover" />
          </div>
          <p className="font-caveat text-primary text-2xl font-bold">МалышДок</p>
          <p className="text-muted-foreground text-sm mt-1">
            Вход по номеру телефона
          </p>
        </div>

        {step === "phone" ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">
                Ваш номер телефона
              </label>
              <Input
                inputMode="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                className="h-12 text-base rounded-2xl"
              />
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <Button
              onClick={sendCode}
              disabled={!phoneValid || loading}
              className="w-full h-12 rounded-2xl text-base font-semibold"
            >
              {loading ? "Отправляем…" : "Получить код"}
            </Button>
            <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
              Продолжая, вы соглашаетесь с обработкой персональных данных.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => {
                setStep("phone");
                setCode("");
                setError("");
              }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <Icon name="ArrowLeft" size={16} />
              Изменить номер
            </button>
            <p className="text-sm text-foreground">
              Мы отправили код на <span className="font-semibold">{phone}</span>
            </p>

            {demoCode && (
              <div className="flex items-start gap-2 text-[12px] bg-mint-50 border border-mint-200 rounded-xl p-3">
                <Icon name="Info" size={14} className="flex-shrink-0 mt-0.5 text-primary" />
                <span>
                  Демо-режим: ваш код — <span className="font-bold">{demoCode}</span>
                </span>
              </div>
            )}

            <Input
              inputMode="numeric"
              placeholder="Код из 6 цифр"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="h-12 text-base rounded-2xl tracking-[0.3em] text-center"
            />
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <Button
              onClick={confirm}
              disabled={code.length !== 6 || loading}
              className="w-full h-12 rounded-2xl text-base font-semibold"
            >
              {loading ? "Проверяем…" : "Войти"}
            </Button>
            <button
              onClick={sendCode}
              disabled={loading}
              className="w-full text-sm text-primary font-medium"
            >
              Отправить код ещё раз
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;
