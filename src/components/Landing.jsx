import { useState } from "react";
import {
  Heart, Sparkles, FlaskConical, TrendingUp, Share2, ShieldCheck,
  Upload, BarChart3, Send, ArrowRight, Check, Pill, FileText, Stethoscope
} from "lucide-react";

export default function Landing() {
  const goToApp = () => {
    window.location.hash = "#/app";
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <TopBar onEnter={goToApp} />
      <Hero onEnter={goToApp} />
      <ProblemBlock />
      <HowItWorks />
      <PreviewBlock />
      <ForPatients />
      <ForDoctors />
      <FinalCTA onEnter={goToApp} />
      <Footer />
    </div>
  );
}

function TopBar({ onEnter }) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
            <Heart size={14} className="text-white" fill="currentColor" />
          </div>
          <span className="text-[18px] font-serif font-medium tracking-tight">Aist</span>
        </div>
        <button
          onClick={onEnter}
          className="text-[13px] font-medium text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
        >
          Войти
        </button>
      </div>
    </header>
  );
}

function Hero({ onEnter }) {
  return (
    <section className="max-w-5xl mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-20">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-medium uppercase tracking-wider mb-5">
            <Sparkles size={11} />
            MVP
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-medium leading-[1.1] tracking-tight mb-5">
            Все анализы беременности —{" "}
            <span className="text-purple-600">в одном дашборде</span>
          </h1>
          <p className="text-[16px] text-gray-600 leading-relaxed mb-7 max-w-md">
            Загрузи PDF или фото — AIst распознает показатели, покажет динамику и подсветит отклонения.
            Делись с врачом одной ссылкой.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onEnter}
              className="text-[14px] font-medium text-white bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl flex items-center gap-2 transition"
            >
              Попробовать
              <ArrowRight size={14} />
            </button>
            <span className="text-[12px] text-gray-400">Бесплатно.</span>
          </div>
        </div>

        <div className="relative">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px] md:w-[300px]">
      <div className="rounded-[36px] bg-gray-900 p-2 shadow-2xl">
        <div className="rounded-[28px] bg-white overflow-hidden">
          <div className="h-5 bg-gray-900 flex items-center justify-center">
            <div className="w-24 h-3 bg-gray-900 rounded-b-xl" />
          </div>

          <div className="bg-gradient-to-br from-pink-50 via-white to-purple-50 p-3 pb-4 space-y-2">
            <div className="bg-white/60 rounded-xl px-3 py-2 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                <Heart size={11} className="text-pink-700" fill="currentColor" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[8px] uppercase tracking-wider text-gray-400">Анна</p>
                <p className="text-[10px] font-medium text-gray-800">25 нед · I (0) Rh+</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-100 via-pink-50 to-purple-100 rounded-2xl p-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[8px] uppercase tracking-wider text-pink-700 font-medium">Срок</p>
                <span className="bg-white/70 text-purple-800 text-[8px] px-2 py-0.5 rounded-full font-medium">II триместр</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-serif font-medium text-gray-900 leading-none">25</span>
                <span className="font-serif text-gray-600 text-[9px] italic">нед</span>
                <span className="text-lg font-serif text-gray-900 ml-1">4</span>
                <span className="font-serif text-gray-600 text-[8px] italic">дн</span>
              </div>
              <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-pink-300 via-purple-300 to-amber-200 rounded-full" style={{ width: "63%" }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-white rounded-xl p-2">
                <p className="text-[7px] uppercase tracking-wider text-gray-400 font-medium mb-1">Индекс</p>
                <div className="flex items-center gap-1.5">
                  <div className="relative w-7 h-7">
                    <svg viewBox="0 0 32 32" className="-rotate-90 w-7 h-7">
                      <circle cx="16" cy="16" r="12" stroke="#f3f4f6" strokeWidth="3" fill="none" />
                      <circle cx="16" cy="16" r="12" stroke="#a78bfa" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="75.4" strokeDashoffset="6.8" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[8px] font-serif font-medium">91</span>
                    </div>
                  </div>
                  <p className="text-[8px] text-gray-600">Отлично</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-2">
                <p className="text-[7px] uppercase tracking-wider text-gray-400 font-medium mb-1">Анализов</p>
                <p className="text-xl font-serif text-gray-900 leading-none">7</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-2 space-y-1">
              <div className="flex items-center gap-1.5 mb-1">
                <Pill size={9} className="text-purple-600" />
                <p className="text-[9px] font-medium text-gray-700">Витамины</p>
              </div>
              <div className="flex items-center gap-1.5 bg-purple-50/50 rounded px-2 py-1">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check size={6} className="text-white" strokeWidth={3} />
                </div>
                <p className="text-[8px] text-gray-700 flex-1">Фолиевая кислота</p>
              </div>
              <div className="flex items-center gap-1.5 bg-purple-50/50 rounded px-2 py-1">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check size={6} className="text-white" strokeWidth={3} />
                </div>
                <p className="text-[8px] text-gray-700 flex-1">Магний B6</p>
              </div>
            </div>

            <div className="bg-rose-50 rounded-xl p-2 flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-rose-100 flex items-center justify-center">
                <TrendingUp size={9} className="text-rose-600 rotate-180" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[7px] font-medium text-rose-600 uppercase">Понижен</p>
                <p className="text-[9px] font-medium text-gray-900">Цинк</p>
                <p className="text-[7px] text-gray-500">9.5 · норма 10.7–17.5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemBlock() {
  const items = [
    "PDF-файлы из разных лабораторий — в одной папке хаос",
    "Отклонения теряются между анализами",
    "Каждый раз объяснять врачу историю — снова",
    "Не видно динамики: было лучше или хуже?"
  ];
  return (
    <section className="bg-gray-50 border-y border-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <p className="text-[12px] uppercase tracking-wider text-gray-400 font-medium mb-3 text-center">Знакомо?</p>
        <h2 className="text-2xl md:text-3xl font-serif font-medium text-center mb-8 leading-tight">
          Беременность — это десятки анализов. <br className="hidden md:inline"/>
          Хранить их в почте или в мессенджерах неудобно.
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((text, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <span className="text-purple-600 font-serif text-lg leading-none mt-0.5">·</span>
              <p className="text-[13px] text-gray-700 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Загрузи анализ",
      desc: "PDF из любой лаборатории или фото бумажного результата. Без ручного ввода."
    },
    {
      icon: Sparkles,
      title: "AI распознаёт",
      desc: "За 10 секунд извлекает показатели, дату и нормы. Помечает значения вне референса."
    },
    {
      icon: BarChart3,
      title: "Видишь динамику",
      desc: "По каждому показателю — график по неделям беременности. С зелёной зоной нормы."
    },
    {
      icon: Send,
      title: "Делишься с врачом",
      desc: "Одна ссылка → врач открывает дашборд без регистрации и видит всё сразу."
    },
  ];
  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <p className="text-[12px] uppercase tracking-wider text-purple-600 font-medium mb-2 text-center">Как это работает</p>
      <h2 className="text-3xl md:text-4xl font-serif font-medium text-center mb-12 tracking-tight">
        Четыре шага вместо папки в почте
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="relative">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 h-full hover:border-purple-200 hover:shadow-sm transition">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-purple-600" />
                </div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">Шаг {i + 1}</p>
                <h3 className="text-[15px] font-medium text-gray-900 mb-1.5">{s.title}</h3>
                <p className="text-[12px] text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PreviewBlock() {
  return (
    <section className="bg-gradient-to-br from-purple-50/40 via-white to-pink-50/40 py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-[12px] uppercase tracking-wider text-purple-600 font-medium mb-2">Что внутри</p>
          <h2 className="text-3xl md:text-4xl font-serif font-medium tracking-tight">Аккуратно. Информативно. Серьёзно.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <PreviewCard
            title="Срок и триместр"
            desc="Прогресс-бар, дни до родов, текущий триместр — всё на главной."
            content={<MiniPregnancy />}
          />
          <PreviewCard
            title="Индекс здоровья"
            desc="% показателей в норме. Цвет меняется от зелёного к красному."
            content={<MiniHealth />}
          />
          <PreviewCard
            title="Витамины и препараты"
            desc="Что принимаешь сейчас, что уже закончила. Врач видит всё."
            content={<MiniSupplements />}
          />
        </div>
      </div>
    </section>
  );
}

function PreviewCard({ title, desc, content }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div className="p-3 bg-gradient-to-br from-gray-50 to-white">
        {content}
      </div>
      <div className="p-4 border-t border-gray-100">
        <h3 className="text-[14px] font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-[12px] text-gray-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function MiniPregnancy() {
  return (
    <div className="bg-gradient-to-br from-pink-100 via-pink-50 to-purple-100 rounded-xl p-3">
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl font-serif font-medium text-gray-900 leading-none">25</span>
        <span className="font-serif text-gray-600 text-xs italic">нед</span>
      </div>
      <p className="text-[10px] text-gray-600 mb-2">До родов <span className="font-medium text-gray-800">100 дн.</span></p>
      <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-pink-300 via-purple-300 to-amber-200 rounded-full" style={{ width: "63%" }} />
      </div>
    </div>
  );
}

function MiniHealth() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 h-full">
      <div className="relative w-14 h-14">
        <svg viewBox="0 0 60 60" className="-rotate-90 w-14 h-14">
          <circle cx="30" cy="30" r="22" stroke="#f3f4f6" strokeWidth="5" fill="none" />
          <circle cx="30" cy="30" r="22" stroke="#a78bfa" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="138.2" strokeDashoffset="12.4" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-serif font-medium">91</span>
        </div>
      </div>
      <div>
        <p className="text-[13px] font-medium text-gray-900">Отлично</p>
        <p className="text-[10px] text-gray-500">4 отклонения</p>
      </div>
    </div>
  );
}

function MiniSupplements() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-2 space-y-1">
      <div className="flex items-center gap-1.5 mb-1.5 px-1">
        <Pill size={11} className="text-purple-600" />
        <p className="text-[11px] font-medium text-gray-700">Принимает</p>
      </div>
      {["Фолиевая кислота", "Магний B6", "Витамин D"].map((v) => (
        <div key={v} className="flex items-center gap-1.5 bg-purple-50/50 rounded-md px-2 py-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <Check size={8} className="text-white" strokeWidth={3} />
          </div>
          <p className="text-[10px] text-gray-700">{v}</p>
        </div>
      ))}
    </div>
  );
}

function ForPatients() {
  const features = [
    { icon: Upload, title: "Все анализы — в одном месте", desc: "Не теряешь PDF в почте и WhatsApp." },
    { icon: Sparkles, title: "AI читает результаты", desc: "Не вбиваешь цифры вручную — просто грузишь файл." },
    { icon: TrendingUp, title: "Видишь динамику", desc: "Какие показатели растут, какие падают по неделям." },
    { icon: Pill, title: "Витамины под контролем", desc: "Помнишь что и в какой дозировке принимаешь." },
  ];
  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-[12px] uppercase tracking-wider text-purple-600 font-medium mb-2">Для будущих мам</p>
        <h2 className="text-3xl md:text-4xl font-serif font-medium tracking-tight">Спокойнее переживать беременность</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-[14px] font-medium text-gray-900 mb-1">{f.title}</h3>
                <p className="text-[12px] text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ForDoctors() {
  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-[11px] font-medium uppercase tracking-wider mb-4">
              <Stethoscope size={11} />
              Для врачей
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-medium tracking-tight mb-4 leading-tight">
              Полная картина пациентки — за один клик
            </h2>
            <p className="text-[14px] text-gray-300 leading-relaxed mb-5">
              Пациентка присылает ссылку — вы видите её срок, все анализы, динамику показателей и текущие назначения.
              Без регистрации, без логинов.
            </p>
            <ul className="space-y-2.5 text-[13px] text-gray-200">
              {[
                "Все анализы в хронологии — не нужно листать чаты",
                "Подсвечены отклонения от нормы для беременных",
                "Видно что пациентка реально принимает",
                "Ссылка живёт 30 дней, можно отозвать"
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check size={14} className="text-purple-400 mt-0.5 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <div className="bg-purple-100/10 border border-purple-300/20 rounded-xl px-3 py-2 mb-3 flex items-center gap-2">
              <ShieldCheck size={12} className="text-purple-300" />
              <p className="text-[11px] text-purple-200">Режим просмотра для врача</p>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-xl p-3 mb-2">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Пациентка</p>
              <p className="text-[14px] font-medium text-white">Анна · 37 лет · I (0) Rh+</p>
            </div>
            <div className="bg-rose-500/10 border border-rose-400/20 rounded-xl p-3 mb-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-rose-300">Понижен</p>
              <p className="text-[13px] font-medium text-white">Общий белок</p>
              <p className="text-[11px] text-gray-300">61.4 г/л · норма 66.0–83.0</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Pill size={11} className="text-purple-300" />
                <p className="text-[11px] font-medium text-gray-200">Принимает</p>
              </div>
              <p className="text-[11px] text-gray-300">Фолиевая кислота · Магний B6 · Омега 3</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onEnter }) {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl md:text-4xl font-serif font-medium tracking-tight mb-4 leading-tight">
        Начни вести беременность <br className="hidden sm:inline"/>
        <span className="text-purple-600">по-новому</span>
      </h2>
      <p className="text-[14px] text-gray-600 mb-7 max-w-md mx-auto leading-relaxed">
        Загрузи первый анализ за минуту. AI разберёт, дашборд покажет.
      </p>
      <button
        onClick={onEnter}
        className="text-[15px] font-medium text-white bg-purple-600 hover:bg-purple-700 px-6 py-3.5 rounded-xl inline-flex items-center gap-2 transition"
      >
        Попробовать
        <ArrowRight size={15} />
      </button>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
            <Heart size={9} className="text-white" fill="currentColor" />
          </div>
          <span className="text-[14px] font-serif font-medium">Aist</span>
        </div>
        <p className="text-[11px] text-gray-400">© {new Date().getFullYear()} · MVP · не является медицинской рекомендацией</p>
      </div>
    </footer>
  );
}
